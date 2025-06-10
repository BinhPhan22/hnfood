import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  StarIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const Chatbot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [settings, setSettings] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load chatbot settings
  useEffect(() => {
    fetchSettings();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/chatbot/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching chatbot settings:', error);
    }
  };

  const startConversation = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/chatbot/conversation/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          language: i18n.language
        })
      });

      const data = await response.json();
      if (data.success) {
        setSessionId(data.data.session_id);
        setMessages([{
          id: uuidv4(),
          role: 'assistant',
          content: data.data.welcome_message,
          timestamp: new Date()
        }]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error(t('errors.network'));
    }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || !sessionId || isLoading) return;

    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/chatbot/conversation/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: messageText.trim(),
          language: i18n.language
        })
      });

      const data = await response.json();
      if (data.success) {
        const assistantMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: data.data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('errors.network'));
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = async () => {
    if (!sessionId) return;

    try {
      await fetch('http://localhost:5001/api/chatbot/conversation/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          rating: rating || undefined,
          feedback: feedback || undefined
        })
      });
    } catch (error) {
      console.error('Error ending conversation:', error);
    }

    // Reset state
    setSessionId(null);
    setMessages([]);
    setRating(0);
    setFeedback('');
    setShowRating(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (!sessionId) {
      startConversation();
    }
  };

  const handleClose = () => {
    if (messages.length > 1) {
      setShowRating(true);
    } else {
      setIsOpen(false);
      endConversation();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleRatingSubmit = () => {
    endConversation();
    setIsOpen(false);
    toast.success(t('common.success'));
  };

  const handleQuickReply = (text) => {
    sendMessage(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Don't render if chatbot is disabled
  if (!settings?.is_enabled) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 animate-pulse"
          aria-label="Open chat"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-primary-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{settings?.bot_avatar || '🤖'}</span>
              <div>
                <h3 className="font-semibold text-sm">{settings?.bot_name || 'AI Assistant'}</h3>
                <p className="text-xs opacity-90">
                  {isLoading ? (i18n.language === 'en' ? 'Typing...' : 'Đang nhập...') : (i18n.language === 'en' ? 'Online' : 'Trực tuyến')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleMinimize}
                className="p-1 hover:bg-primary-700 rounded transition-colors"
                aria-label="Minimize"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-primary-700 rounded transition-colors"
                aria-label="Close"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {messages.length === 1 && settings?.quick_replies?.length > 0 && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-1">
                    {settings.quick_replies.slice(0, 3).map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply.text)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                      >
                        {reply.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={i18n.language === 'en' ? 'Type your message...' : 'Nhập tin nhắn...'}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {i18n.language === 'en' ? 'Rate your experience' : 'Đánh giá trải nghiệm'}
            </h3>
            
            <div className="flex justify-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  {star <= rating ? (
                    <StarIconSolid className="h-6 w-6 text-yellow-400" />
                  ) : (
                    <StarIcon className="h-6 w-6 text-gray-300" />
                  )}
                </button>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={i18n.language === 'en' ? 'Optional feedback...' : 'Góp ý (tùy chọn)...'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm mb-4"
              rows={3}
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRating(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {i18n.language === 'en' ? 'Skip' : 'Bỏ qua'}
              </button>
              <button
                onClick={handleRatingSubmit}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {i18n.language === 'en' ? 'Submit' : 'Gửi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
