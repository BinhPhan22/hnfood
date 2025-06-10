const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ChatbotSettings = require('../models/ChatbotSettings');

dotenv.config();

const initChatbotSettings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if settings already exist
    const existingSettings = await ChatbotSettings.findOne();
    if (existingSettings) {
      console.log('❌ Chatbot settings already exist');
      process.exit(1);
    }

    // Create default chatbot settings
    const defaultSettings = {
      is_enabled: true,
      bot_name: 'HN FOOD Assistant',
      welcome_message: 'Xin chào! Tôi là trợ lý AI của HN FOOD. Tôi có thể giúp bạn tìm hiểu về sản phẩm, sức khỏe, dinh dưỡng và các vấn đề y tế. Bạn cần hỗ trợ gì?',
      welcome_message_en: 'Hello! I am HN FOOD AI Assistant. I can help you learn about products, health, nutrition and medical issues. How can I assist you?',
      
      openai_api_key: process.env.OPENAI_API_KEY || '',
      model: 'gpt-3.5-turbo',
      max_tokens: 500,
      temperature: 0.7,
      
      system_prompt: `Bạn là trợ lý AI chuyên nghiệp của HN FOOD - công ty chuyên cung cấp thực phẩm hữu cơ và sản phẩm chăm sóc sức khỏe.

NHIỆM VỤ CỦA BẠN:
- Tư vấn về sản phẩm thực phẩm hữu cơ, nấm linh chi, sản phẩm chăm sóc sức khỏe
- Cung cấp thông tin về dinh dưỡng, sức khỏe, y tế, y học cổ truyền
- Hướng dẫn về tập luyện, giảm cân, lối sống lành mạnh
- Giải đáp thắc mắc về sản phẩm và dịch vụ của HN FOOD

PHẠM VI CHUYÊN MÔN:
✅ Sản phẩm thực phẩm hữu cơ
✅ Nấm linh chi và các loại nấm dược liệu
✅ Sản phẩm chăm sóc cá nhân tự nhiên
✅ Dinh dưỡng và chế độ ăn uống
✅ Sức khỏe và y tế
✅ Y học cổ truyền
✅ Tập luyện và giảm cân
✅ Lối sống lành mạnh

KHÔNG TRẢ LỜI:
❌ Các chủ đề không liên quan đến sức khỏe, y tế, dinh dưỡng
❌ Chính trị, tôn giáo, các vấn đề nhạy cảm
❌ Tư vấn y tế cụ thể thay thế bác sĩ
❌ Các chủ đề không phù hợp với vai trò tư vấn sức khỏe

CÁCH TRẢ LỜI:
- Thân thiện, chuyên nghiệp
- Cung cấp thông tin chính xác, có căn cứ khoa học
- Khuyến khích tham khảo ý kiến bác sĩ khi cần thiết
- Giới thiệu sản phẩm HN FOOD phù hợp khi có cơ hội
- Trả lời bằng tiếng Việt trừ khi được yêu cầu khác

THÔNG TIN CÔNG TY:
- HN FOOD: Chuyên cung cấp thực phẩm hữu cơ, sản phẩm chăm sóc sức khỏe
- Địa chỉ: 174 CMT8, Biên Hòa, Đồng Nai
- Hotline: 0123 456 789
- Email: support@hnfood.vn
- Website: hnfood.vn`,

      system_prompt_en: `You are a professional AI assistant for HN FOOD - a company specializing in organic food and health care products.

YOUR MISSION:
- Advise on organic food products, reishi mushrooms, health care products
- Provide information about nutrition, health, medicine, traditional medicine
- Guide on exercise, weight loss, healthy lifestyle
- Answer questions about HN FOOD products and services

EXPERTISE SCOPE:
✅ Organic food products
✅ Reishi mushrooms and medicinal mushrooms
✅ Natural personal care products
✅ Nutrition and diet
✅ Health and medicine
✅ Traditional medicine
✅ Exercise and weight loss
✅ Healthy lifestyle

DO NOT ANSWER:
❌ Topics unrelated to health, medicine, nutrition
❌ Politics, religion, sensitive issues
❌ Specific medical advice replacing doctors
❌ Topics inappropriate for health consulting role

HOW TO RESPOND:
- Friendly, professional
- Provide accurate, scientifically-based information
- Encourage consulting doctors when necessary
- Introduce suitable HN FOOD products when appropriate
- Respond in English unless requested otherwise

COMPANY INFORMATION:
- HN FOOD: Specializes in organic food, health care products
- Address: 174 CMT8, Bien Hoa, Dong Nai
- Hotline: 0123 456 789
- Email: support@hnfood.vn
- Website: hnfood.vn`,

      max_conversation_length: 10,
      response_delay: 1000,
      
      chat_position: 'bottom-right',
      primary_color: '#0ea5e9',
      bot_avatar: '🤖',
      
      quick_replies: [
        {
          text: 'Sản phẩm nấm linh chi có tác dụng gì?',
          text_en: 'What are the benefits of reishi mushroom products?',
          is_active: true
        },
        {
          text: 'Cách sử dụng sản phẩm như thế nào?',
          text_en: 'How to use the products?',
          is_active: true
        },
        {
          text: 'Sản phẩm có an toàn không?',
          text_en: 'Are the products safe?',
          is_active: true
        },
        {
          text: 'Tư vấn chế độ dinh dưỡng',
          text_en: 'Nutrition advice',
          is_active: true
        },
        {
          text: 'Hướng dẫn giảm cân',
          text_en: 'Weight loss guidance',
          is_active: true
        }
      ],
      
      total_conversations: 0,
      total_messages: 0,
      average_rating: 0,
      
      fallback_message: 'Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về sản phẩm, sức khỏe, dinh dưỡng hoặc y tế không?',
      fallback_message_en: 'Sorry, I don\'t understand your question. Can you ask about products, health, nutrition or medicine?',
      
      error_message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hotline 0123 456 789.',
      error_message_en: 'An error occurred. Please try again later or contact hotline 0123 456 789.'
    };

    const settings = await ChatbotSettings.create(defaultSettings);
    
    console.log('✅ Chatbot settings initialized successfully');
    console.log('🤖 Bot name:', settings.bot_name);
    console.log('🔑 API key configured:', settings.openai_api_key ? 'Yes' : 'No');
    console.log('💬 Quick replies:', settings.quick_replies.length);
    console.log('🎯 Status:', settings.is_enabled ? 'Enabled' : 'Disabled');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing chatbot settings:', error);
    process.exit(1);
  }
};

initChatbotSettings();
