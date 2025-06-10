const mongoose = require('mongoose');

const ChatbotSettingsSchema = new mongoose.Schema({
  // Basic Settings
  is_enabled: {
    type: Boolean,
    default: true
  },
  bot_name: {
    type: String,
    default: 'HN FOOD Assistant'
  },
  welcome_message: {
    type: String,
    default: 'Xin chào! Tôi là trợ lý AI của HN FOOD. Tôi có thể giúp bạn tìm hiểu về sản phẩm, sức khỏe, dinh dưỡng và các vấn đề y tế. Bạn cần hỗ trợ gì?'
  },
  welcome_message_en: {
    type: String,
    default: 'Hello! I am HN FOOD AI Assistant. I can help you learn about products, health, nutrition and medical issues. How can I assist you?'
  },
  
  // AI Configuration
  openai_api_key: {
    type: String,
    required: true
  },
  model: {
    type: String,
    default: 'gpt-3.5-turbo',
    enum: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo']
  },
  max_tokens: {
    type: Number,
    default: 500,
    min: 100,
    max: 2000
  },
  temperature: {
    type: Number,
    default: 0.7,
    min: 0,
    max: 1
  },
  
  // System Prompt (Vietnamese)
  system_prompt: {
    type: String,
    default: `Bạn là trợ lý AI chuyên nghiệp của HN FOOD - công ty chuyên cung cấp thực phẩm hữu cơ và sản phẩm chăm sóc sức khỏe.

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
- Website: hnfood.vn`
  },
  
  // System Prompt (English)
  system_prompt_en: {
    type: String,
    default: `You are a professional AI assistant for HN FOOD - a company specializing in organic food and health care products.

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
- Website: hnfood.vn`
  },
  
  // Conversation Settings
  max_conversation_length: {
    type: Number,
    default: 10,
    min: 5,
    max: 50
  },
  response_delay: {
    type: Number,
    default: 1000,
    min: 500,
    max: 5000
  },
  
  // UI Settings
  chat_position: {
    type: String,
    default: 'bottom-right',
    enum: ['bottom-right', 'bottom-left', 'top-right', 'top-left']
  },
  primary_color: {
    type: String,
    default: '#0ea5e9'
  },
  bot_avatar: {
    type: String,
    default: '🤖'
  },
  
  // Quick Replies
  quick_replies: [{
    text: {
      type: String,
      required: true
    },
    text_en: {
      type: String,
      required: true
    },
    is_active: {
      type: Boolean,
      default: true
    }
  }],
  
  // Analytics
  total_conversations: {
    type: Number,
    default: 0
  },
  total_messages: {
    type: Number,
    default: 0
  },
  average_rating: {
    type: Number,
    default: 0
  },
  
  // Auto Responses
  fallback_message: {
    type: String,
    default: 'Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về sản phẩm, sức khỏe, dinh dưỡng hoặc y tế không?'
  },
  fallback_message_en: {
    type: String,
    default: 'Sorry, I don\'t understand your question. Can you ask about products, health, nutrition or medicine?'
  },
  
  error_message: {
    type: String,
    default: 'Đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hotline 0123 456 789.'
  },
  error_message_en: {
    type: String,
    default: 'An error occurred. Please try again later or contact hotline 0123 456 789.'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
ChatbotSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      openai_api_key: process.env.OPENAI_API_KEY || '',
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
      ]
    });
  }
  return settings;
};

ChatbotSettingsSchema.statics.updateSettings = async function(updates) {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(updates);
  } else {
    Object.assign(settings, updates);
    await settings.save();
  }
  return settings;
};

module.exports = mongoose.model('ChatbotSettings', ChatbotSettingsSchema);
