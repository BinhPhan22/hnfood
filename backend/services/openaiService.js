const OpenAI = require('openai');
const ChatbotSettings = require('../models/ChatbotSettings');

class OpenAIService {
  constructor() {
    this.openai = null;
    this.settings = null;
  }

  async initialize() {
    try {
      this.settings = await ChatbotSettings.getSettings();
      
      if (!this.settings.openai_api_key) {
        throw new Error('OpenAI API key not configured');
      }

      this.openai = new OpenAI({
        apiKey: this.settings.openai_api_key
      });

      console.log('✅ OpenAI service initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize OpenAI service:', error.message);
      return false;
    }
  }

  async generateResponse(messages, language = 'vi') {
    try {
      if (!this.openai) {
        await this.initialize();
      }

      if (!this.openai) {
        throw new Error('OpenAI service not available');
      }

      // Get system prompt based on language
      const systemPrompt = language === 'en' 
        ? this.settings.system_prompt_en 
        : this.settings.system_prompt;

      // Prepare messages for OpenAI
      const openaiMessages = [
        {
          role: 'system',
          content: systemPrompt
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      // Call OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: this.settings.model || 'gpt-3.5-turbo',
        messages: openaiMessages,
        max_tokens: this.settings.max_tokens || 500,
        temperature: this.settings.temperature || 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const response = completion.choices[0]?.message?.content;
      const tokensUsed = completion.usage?.total_tokens || 0;

      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return {
        success: true,
        response: response.trim(),
        tokensUsed,
        model: this.settings.model
      };

    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Return fallback message based on language
      const fallbackMessage = language === 'en' 
        ? this.settings?.error_message_en || 'An error occurred. Please try again later or contact hotline 0123 456 789.'
        : this.settings?.error_message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hotline 0123 456 789.';

      return {
        success: false,
        response: fallbackMessage,
        tokensUsed: 0,
        error: error.message
      };
    }
  }

  async moderateContent(text) {
    try {
      if (!this.openai) {
        await this.initialize();
      }

      if (!this.openai) {
        return { flagged: false };
      }

      const moderation = await this.openai.moderations.create({
        input: text
      });

      return {
        flagged: moderation.results[0]?.flagged || false,
        categories: moderation.results[0]?.categories || {},
        category_scores: moderation.results[0]?.category_scores || {}
      };

    } catch (error) {
      console.error('Moderation Error:', error);
      return { flagged: false, error: error.message };
    }
  }

  async translateText(text, targetLanguage = 'en') {
    try {
      if (!this.openai) {
        await this.initialize();
      }

      if (!this.openai) {
        throw new Error('OpenAI service not available');
      }

      const prompt = targetLanguage === 'en' 
        ? `Translate the following Vietnamese text to English. Only return the translation, no explanations:\n\n${text}`
        : `Translate the following English text to Vietnamese. Only return the translation, no explanations:\n\n${text}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator. Translate accurately and naturally.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      });

      const translation = completion.choices[0]?.message?.content?.trim();

      return {
        success: true,
        translation,
        tokensUsed: completion.usage?.total_tokens || 0
      };

    } catch (error) {
      console.error('Translation Error:', error);
      return {
        success: false,
        translation: text, // Return original text if translation fails
        error: error.message
      };
    }
  }

  async refreshSettings() {
    try {
      this.settings = await ChatbotSettings.getSettings();
      
      // Reinitialize OpenAI if API key changed
      if (this.settings.openai_api_key) {
        this.openai = new OpenAI({
          apiKey: this.settings.openai_api_key
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to refresh settings:', error);
      return false;
    }
  }

  getSettings() {
    return this.settings;
  }

  isAvailable() {
    return this.openai !== null && this.settings?.openai_api_key;
  }

  // Health check
  async healthCheck() {
    try {
      if (!this.isAvailable()) {
        return { healthy: false, error: 'Service not initialized' };
      }

      // Simple test call
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        max_tokens: 5
      });

      return {
        healthy: true,
        model: this.settings.model,
        tokensUsed: completion.usage?.total_tokens || 0
      };

    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
const openaiService = new OpenAIService();

module.exports = openaiService;
