import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import { 
  CogIcon,
  PhotoIcon,
  PaintBrushIcon,
  PhoneIcon,
  GlobeAltIcon,
  StarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const WebsiteSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'general', name: 'Cài đặt chung', icon: CogIcon },
    { id: 'branding', name: 'Logo & Màu sắc', icon: PaintBrushIcon },
    { id: 'banners', name: 'Banner Slides', icon: PhotoIcon },
    { id: 'advantages', name: 'Ưu điểm công ty', icon: StarIcon },
    { id: 'reviews', name: 'Đánh giá KH', icon: StarIcon },
    { id: 'contact', name: 'Thông tin liên hệ', icon: PhoneIcon },
    { id: 'social', name: 'Mạng xã hội', icon: GlobeAltIcon }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/website-settings');
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
      } else {
        // Initialize default settings if none exist
        await initializeSettings();
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Lỗi khi tải cài đặt website');
    } finally {
      setLoading(false);
    }
  };

  const initializeSettings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/website-settings/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
        toast.success('Khởi tạo cài đặt mặc định thành công');
      }
    } catch (error) {
      console.error('Error initializing settings:', error);
      toast.error('Lỗi khi khởi tạo cài đặt');
    }
  };

  const updateSettings = async (updates) => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:5001/api/website-settings', {
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
        toast.success('Cập nhật cài đặt thành công');
      } else {
        toast.error(data.message || 'Lỗi khi cập nhật cài đặt');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Lỗi khi cập nhật cài đặt');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
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
          Chưa có cài đặt website
        </h3>
        <button
          onClick={initializeSettings}
          className="btn-primary"
        >
          Khởi tạo cài đặt mặc định
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Cài đặt Website - HN FOOD Admin</title>
      </Helmet>

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt Website</h1>
          <p className="text-gray-600">Quản lý nội dung và giao diện website</p>
        </div>
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
                    Tên website
                  </label>
                  <input
                    type="text"
                    value={settings.site_name || ''}
                    onChange={(e) => handleInputChange('site_name', e.target.value)}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slogan
                  </label>
                  <input
                    type="text"
                    value={settings.site_tagline || ''}
                    onChange={(e) => handleInputChange('site_tagline', e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả website
                </label>
                <textarea
                  rows={3}
                  value={settings.site_description || ''}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề trang chủ
                  </label>
                  <input
                    type="text"
                    value={settings.hero_title || ''}
                    onChange={(e) => handleInputChange('hero_title', e.target.value)}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phụ đề trang chủ
                  </label>
                  <textarea
                    rows={2}
                    value={settings.hero_subtitle || ''}
                    onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tổng khách hàng
                  </label>
                  <input
                    type="text"
                    value={settings.total_customers || ''}
                    onChange={(e) => handleInputChange('total_customers', e.target.value)}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quốc gia xuất khẩu
                  </label>
                  <input
                    type="text"
                    value={settings.countries_exported || ''}
                    onChange={(e) => handleInputChange('countries_exported', e.target.value)}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỷ lệ hài lòng
                  </label>
                  <input
                    type="text"
                    value={settings.satisfaction_rate || ''}
                    onChange={(e) => handleInputChange('satisfaction_rate', e.target.value)}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ hỗ trợ
                  </label>
                  <input
                    type="text"
                    value={settings.support_hours || ''}
                    onChange={(e) => handleInputChange('support_hours', e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Branding Settings */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Logo & Màu sắc</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Logo
                  </label>
                  <input
                    type="text"
                    value={settings.logo_url || ''}
                    onChange={(e) => handleInputChange('logo_url', e.target.value)}
                    className="input"
                    placeholder="/logo.png"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Favicon
                  </label>
                  <input
                    type="text"
                    value={settings.favicon_url || ''}
                    onChange={(e) => handleInputChange('favicon_url', e.target.value)}
                    className="input"
                    placeholder="/favicon.ico"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      value={settings.primary_color || ''}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      className="input flex-1"
                      placeholder="#0ea5e9"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu phụ
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={settings.secondary_color || '#06b6d4'}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={settings.secondary_color || ''}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      className="input flex-1"
                      placeholder="#06b6d4"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu nhấn
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={settings.accent_color || '#f59e0b'}
                      onChange={(e) => handleInputChange('accent_color', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={settings.accent_color || ''}
                      onChange={(e) => handleInputChange('accent_color', e.target.value)}
                      className="input flex-1"
                      placeholder="#f59e0b"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Settings */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Thông tin liên hệ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={settings.contact_phone || ''}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  rows={2}
                  value={settings.contact_address || ''}
                  onChange={(e) => handleInputChange('contact_address', e.target.value)}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ làm việc (T2-T6)
                  </label>
                  <input
                    type="text"
                    value={settings.business_hours?.weekdays || ''}
                    onChange={(e) => handleNestedInputChange('business_hours', 'weekdays', e.target.value)}
                    className="input"
                    placeholder="8:00 - 18:00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ làm việc (T7-CN)
                  </label>
                  <input
                    type="text"
                    value={settings.business_hours?.weekend || ''}
                    onChange={(e) => handleNestedInputChange('business_hours', 'weekend', e.target.value)}
                    className="input"
                    placeholder="9:00 - 17:00"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Media Settings */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Mạng xã hội</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={settings.facebook_url || ''}
                    onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                    className="input"
                    placeholder="https://facebook.com/hnfood"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={settings.instagram_url || ''}
                    onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                    className="input"
                    placeholder="https://instagram.com/hnfood"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={settings.youtube_url || ''}
                    onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                    className="input"
                    placeholder="https://youtube.com/hnfood"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Banner Slides - Will be implemented in next part */}
          {activeTab === 'banners' && (
            <div className="text-center py-12">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Quản lý Banner Slides
              </h3>
              <p className="text-gray-500">Tính năng đang được phát triển...</p>
            </div>
          )}

          {/* Company Advantages - Will be implemented in next part */}
          {activeTab === 'advantages' && (
            <div className="text-center py-12">
              <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Quản lý Ưu điểm công ty
              </h3>
              <p className="text-gray-500">Tính năng đang được phát triển...</p>
            </div>
          )}

          {/* Customer Reviews - Will be implemented in next part */}
          {activeTab === 'reviews' && (
            <div className="text-center py-12">
              <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Quản lý Đánh giá khách hàng
              </h3>
              <p className="text-gray-500">Tính năng đang được phát triển...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteSettings;
