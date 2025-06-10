const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const ChatbotSettings = require('../models/ChatbotSettings');
const ChatConversation = require('../models/ChatConversation');
const openaiService = require('../services/openaiService');
const { protect, admin } = require('../middleware/authMiddleware');

// Rate limiting for chat messages
const chatRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 messages per minute
  message: {
    success: false,
    message: 'Quá nhiều tin nhắn. Vui lòng chờ một chút.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// @desc    Get chatbot settings (public)
// @route   GET /api/chatbot/settings
// @access  Public
router.get('/settings', async (req, res) => {
  try {
    const settings = await ChatbotSettings.getSettings();
    
    // Return only public settings
    const publicSettings = {
      is_enabled: settings.is_enabled,
      bot_name: settings.bot_name,
      welcome_message: settings.welcome_message,
      welcome_message_en: settings.welcome_message_en,
      chat_position: settings.chat_position,
      primary_color: settings.primary_color,
      bot_avatar: settings.bot_avatar,
      quick_replies: settings.quick_replies.filter(reply => reply.is_active),
      max_conversation_length: settings.max_conversation_length
    };

    res.json({
      success: true,
      data: publicSettings
    });
  } catch (error) {
    console.error('Get chatbot settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy cài đặt chatbot'
    });
  }
});

// @desc    Start new conversation
// @route   POST /api/chatbot/conversation/start
// @access  Public
router.post('/conversation/start', async (req, res) => {
  try {
    const { language = 'vi' } = req.body;
    const sessionId = uuidv4();
    const userIp = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    const userId = req.user?.id || null;

    // Check if chatbot is enabled
    const settings = await ChatbotSettings.getSettings();
    if (!settings.is_enabled) {
      return res.status(503).json({
        success: false,
        message: 'Chatbot hiện tại không khả dụng'
      });
    }

    // Create new conversation
    const conversation = await ChatConversation.createConversation(
      sessionId,
      userIp,
      userAgent,
      userId,
      language
    );

    // Get welcome message
    const welcomeMessage = language === 'en' 
      ? settings.welcome_message_en 
      : settings.welcome_message;

    // Add welcome message
    await conversation.addMessage('assistant', welcomeMessage);

    res.json({
      success: true,
      data: {
        session_id: sessionId,
        welcome_message: welcomeMessage,
        quick_replies: settings.quick_replies
          .filter(reply => reply.is_active)
          .map(reply => ({
            text: language === 'en' ? reply.text_en : reply.text
          }))
      }
    });

  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi bắt đầu cuộc trò chuyện'
    });
  }
});

// @desc    Send message
// @route   POST /api/chatbot/conversation/message
// @access  Public
router.post('/conversation/message', chatRateLimit, async (req, res) => {
  try {
    const { session_id, message, language = 'vi' } = req.body;

    if (!session_id || !message) {
      return res.status(400).json({
        success: false,
        message: 'Session ID và tin nhắn là bắt buộc'
      });
    }

    // Find conversation
    const conversation = await ChatConversation.findBySessionId(session_id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cuộc trò chuyện'
      });
    }

    // Check conversation length limit
    const settings = await ChatbotSettings.getSettings();
    if (conversation.messages.length >= settings.max_conversation_length * 2) {
      return res.status(429).json({
        success: false,
        message: language === 'en' 
          ? 'Conversation limit reached. Please start a new conversation.'
          : 'Đã đạt giới hạn cuộc trò chuyện. Vui lòng bắt đầu cuộc trò chuyện mới.'
      });
    }

    // Moderate user message
    const moderation = await openaiService.moderateContent(message);
    if (moderation.flagged) {
      return res.status(400).json({
        success: false,
        message: language === 'en'
          ? 'Your message contains inappropriate content.'
          : 'Tin nhắn của bạn chứa nội dung không phù hợp.'
      });
    }

    // Add user message
    await conversation.addMessage('user', message);

    // Get recent messages for context
    const recentMessages = conversation.getRecentMessages(10);

    // Generate AI response
    const aiResponse = await openaiService.generateResponse(recentMessages, language);

    if (!aiResponse.success) {
      return res.status(500).json({
        success: false,
        message: aiResponse.response
      });
    }

    // Add AI response
    await conversation.addMessage('assistant', aiResponse.response, aiResponse.tokensUsed);

    // Simulate typing delay
    const delay = settings.response_delay || 1000;
    await new Promise(resolve => setTimeout(resolve, Math.min(delay, 3000)));

    res.json({
      success: true,
      data: {
        message: aiResponse.response,
        tokens_used: aiResponse.tokensUsed,
        model: aiResponse.model
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi tin nhắn'
    });
  }
});

// @desc    End conversation
// @route   POST /api/chatbot/conversation/end
// @access  Public
router.post('/conversation/end', async (req, res) => {
  try {
    const { session_id, rating, feedback } = req.body;

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: 'Session ID là bắt buộc'
      });
    }

    const conversation = await ChatConversation.findBySessionId(session_id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cuộc trò chuyện'
      });
    }

    await conversation.endConversation(rating, feedback);

    res.json({
      success: true,
      message: 'Đã kết thúc cuộc trò chuyện'
    });

  } catch (error) {
    console.error('End conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kết thúc cuộc trò chuyện'
    });
  }
});

// @desc    Get conversation history
// @route   GET /api/chatbot/conversation/:sessionId
// @access  Public
router.get('/conversation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await ChatConversation.findOne({ session_id: sessionId });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cuộc trò chuyện'
      });
    }

    res.json({
      success: true,
      data: {
        session_id: conversation.session_id,
        messages: conversation.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        })),
        status: conversation.status,
        total_messages: conversation.total_messages,
        duration: conversation.duration,
        rating: conversation.rating
      }
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch sử trò chuyện'
    });
  }
});

// Admin routes

// @desc    Get chatbot settings (admin)
// @route   GET /api/chatbot/admin/settings
// @access  Private/Admin
router.get('/admin/settings', protect, admin, async (req, res) => {
  try {
    const settings = await ChatbotSettings.getSettings();
    
    // Hide sensitive data
    const adminSettings = { ...settings.toObject() };
    if (adminSettings.openai_api_key) {
      adminSettings.openai_api_key = '***' + adminSettings.openai_api_key.slice(-4);
    }

    res.json({
      success: true,
      data: adminSettings
    });
  } catch (error) {
    console.error('Get admin chatbot settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy cài đặt chatbot'
    });
  }
});

// @desc    Update chatbot settings
// @route   PUT /api/chatbot/admin/settings
// @access  Private/Admin
router.put('/admin/settings', protect, admin, async (req, res) => {
  try {
    const settings = await ChatbotSettings.updateSettings(req.body);
    
    // Refresh OpenAI service
    await openaiService.refreshSettings();

    res.json({
      success: true,
      data: settings,
      message: 'Cập nhật cài đặt chatbot thành công'
    });
  } catch (error) {
    console.error('Update chatbot settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật cài đặt chatbot'
    });
  }
});

// @desc    Get conversation analytics
// @route   GET /api/chatbot/admin/analytics
// @access  Private/Admin
router.get('/admin/analytics', protect, admin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const stats = await ChatConversation.getConversationStats(start, end);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê'
    });
  }
});

// @desc    Test OpenAI connection
// @route   POST /api/chatbot/admin/test
// @access  Private/Admin
router.post('/admin/test', protect, admin, async (req, res) => {
  try {
    const healthCheck = await openaiService.healthCheck();
    
    res.json({
      success: healthCheck.healthy,
      data: healthCheck
    });
  } catch (error) {
    console.error('Test OpenAI error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra kết nối OpenAI'
    });
  }
});

module.exports = router;
