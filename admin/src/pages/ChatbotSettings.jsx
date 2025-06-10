import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import { 
  ChatBubbleLeftRightIcon,
  CogIcon,
  EyeIcon,
  EyeSlashIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/outline';

const ChatbotSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const tabs = [
    { id: 'general', name: 'Cài đặt chung', icon: CogIcon },
    { id: 'ai', name: 'Cấu hình AI', icon: ChatBubbleLeftRightIcon },
    { id: 'prompts', name: 'System Prompts', icon: ChatBubbleLeftRightIcon },
    { id: 'ui', name: 'Giao diện', icon: EyeIcon },
    { id: 'analytics', name: 'Thống kê', icon: ChatBubbleLeftRightIcon }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/chatbot/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
      } else {
        toast.error(data.message || 'Lỗi khi tải cài đặt');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates) => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:5001/api/chatbot/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
        toast.success('Cập nhật thành công');
      } else {
        toast.error(data.message || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Lỗi kết nối');
    } finally {
      setSaving(false);
    }
  };

  const testOpenAI = async () => {
    setTesting(true);
    try {
      const response = await fetch('http://localhost:5001/api/chatbot/admin/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Kết nối OpenAI thành công!');
      } else {
        toast.error(`Lỗi kết nối: ${data.data?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error testing OpenAI:', error);
      toast.error('Lỗi khi kiểm tra kết nối');
    } finally {
      setTesting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    updateSettings(settings);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Không thể tải cài đặt chatbot
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Cài đặt Chatbot - HN FOOD Admin</title>
      </Helmet>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt Chatbot AI</h1>
          <p className="text-gray-600">Quản lý trợ lý AI với ChatGPT</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={testOpenAI}
            disabled={testing}
            className="btn-secondary flex items-center"
          >
            {testing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Đang kiểm tra...
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4 mr-2" />
                Test OpenAI
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </button>
        </div>
      </div>

      {/* Status indicator */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${settings.is_enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">
              Chatbot {settings.is_enabled ? 'Đang hoạt động' : 'Tạm dừng'}
            </span>
          </div>
          <button
            onClick={() => handleInputChange('is_enabled', !settings.is_enabled)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              settings.is_enabled 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {settings.is_enabled ? (
              <>
                <StopIcon className="h-4 w-4 inline mr-1" />
                Tạm dừng
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4 inline mr-1" />
                Kích hoạt
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Cài đặt chung</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Bot
                  </label>
                  <input
                    type="text"
                    value={settings.bot_name || ''}
                    onChange={(e) => handleInputChange('bot_name', e.target.value)}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar Bot
                  </label>
                  <input
                    type="text"
                    value={settings.bot_avatar || ''}
                    onChange={(e) => handleInputChange('bot_avatar', e.target.value)}
                    className="input"
                    placeholder="🤖"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tin nhắn chào mừng (Tiếng Việt)
                </label>
                <textarea
                  rows={3}
                  value={settings.welcome_message || ''}
                  onChange={(e) => handleInputChange('welcome_message', e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tin nhắn chào mừng (English)
                </label>
                <textarea
                  rows={3}
                  value={settings.welcome_message_en || ''}
                  onChange={(e) => handleInputChange('welcome_message_en', e.target.value)}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Độ dài cuộc trò chuyện tối đa
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={settings.max_conversation_length || 10}
                    onChange={(e) => handleInputChange('max_conversation_length', parseInt(e.target.value))}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Độ trễ phản hồi (ms)
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="5000"
                    value={settings.response_delay || 1000}
                    onChange={(e) => handleInputChange('response_delay', parseInt(e.target.value))}
                    className="input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI Configuration */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Cấu hình AI</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenAI API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.openai_api_key || ''}
                    onChange={(e) => handleInputChange('openai_api_key', e.target.value)}
                    className="input pr-10"
                    placeholder="sk-..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showApiKey ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Lấy API key từ <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">OpenAI Platform</a>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <select
                    value={settings.model || 'gpt-3.5-turbo'}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="input"
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    value={settings.max_tokens || 500}
                    onChange={(e) => handleInputChange('max_tokens', parseInt(e.target.value))}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.temperature || 0.7}
                    onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                    className="input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* System Prompts */}
          {activeTab === 'prompts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">System Prompts</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Prompt (Tiếng Việt)
                </label>
                <textarea
                  rows={15}
                  value={settings.system_prompt || ''}
                  onChange={(e) => handleInputChange('system_prompt', e.target.value)}
                  className="input font-mono text-sm"
                  placeholder="Nhập system prompt cho tiếng Việt..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Hướng dẫn AI cách trả lời và phạm vi chuyên môn
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Prompt (English)
                </label>
                <textarea
                  rows={15}
                  value={settings.system_prompt_en || ''}
                  onChange={(e) => handleInputChange('system_prompt_en', e.target.value)}
                  className="input font-mono text-sm"
                  placeholder="Enter system prompt for English..."
                />
              </div>
            </div>
          )}

          {/* UI Settings */}
          {activeTab === 'ui' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Giao diện</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vị trí chat
                  </label>
                  <select
                    value={settings.chat_position || 'bottom-right'}
                    onChange={(e) => handleInputChange('chat_position', e.target.value)}
                    className="input"
                  >
                    <option value="bottom-right">Dưới phải</option>
                    <option value="bottom-left">Dưới trái</option>
                    <option value="top-right">Trên phải</option>
                    <option value="top-left">Trên trái</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu chính
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={settings.primary_color || '#0ea5e9'}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={settings.primary_color || '#0ea5e9'}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      className="input flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Thống kê</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{settings.total_conversations || 0}</div>
                  <div className="text-sm text-gray-600">Tổng cuộc trò chuyện</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{settings.total_messages || 0}</div>
                  <div className="text-sm text-gray-600">Tổng tin nhắn</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{settings.average_rating || 0}/5</div>
                  <div className="text-sm text-gray-600">Đánh giá trung bình</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {settings.is_enabled ? 'Hoạt động' : 'Tạm dừng'}
                  </div>
                  <div className="text-sm text-gray-600">Trạng thái</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotSettings;
