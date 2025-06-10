const mongoose = require('mongoose');

const BannerSlideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  cta_text: {
    type: String,
    default: 'Mua ngay'
  },
  cta_link: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: ''
  },
  is_active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const CompanyAdvantageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'text-blue-600'
  },
  bg_color: {
    type: String,
    default: 'bg-blue-100'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const CustomerReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  is_active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const WebsiteSettingsSchema = new mongoose.Schema({
  // General Settings
  site_name: {
    type: String,
    default: 'HN FOOD'
  },
  site_tagline: {
    type: String,
    default: 'Thực phẩm sạch cho sức khỏe'
  },
  site_description: {
    type: String,
    default: 'Cung cấp thực phẩm hữu cơ, sản phẩm chăm sóc sức khỏe chất lượng cao'
  },
  
  // Logo & Branding
  logo_url: {
    type: String,
    default: '/logo.png'
  },
  favicon_url: {
    type: String,
    default: '/favicon.ico'
  },
  
  // Colors & Theme
  primary_color: {
    type: String,
    default: '#0ea5e9'
  },
  secondary_color: {
    type: String,
    default: '#06b6d4'
  },
  accent_color: {
    type: String,
    default: '#f59e0b'
  },
  
  // Contact Information
  contact_phone: {
    type: String,
    default: '0123 456 789'
  },
  contact_email: {
    type: String,
    default: 'support@hnfood.vn'
  },
  contact_address: {
    type: String,
    default: '174 CMT8, Biên Hòa, Đồng Nai'
  },
  
  // Social Media
  facebook_url: {
    type: String,
    default: ''
  },
  instagram_url: {
    type: String,
    default: ''
  },
  youtube_url: {
    type: String,
    default: ''
  },
  
  // Homepage Content
  hero_title: {
    type: String,
    default: 'Thực phẩm sạch cho sức khỏe'
  },
  hero_subtitle: {
    type: String,
    default: 'Cung cấp thực phẩm hữu cơ, sản phẩm chăm sóc sức khỏe chất lượng cao với thanh toán VietQR tiện lợi'
  },
  
  // Banner Slides
  banner_slides: [BannerSlideSchema],
  
  // Company Advantages
  company_advantages: [CompanyAdvantageSchema],
  
  // Customer Reviews
  customer_reviews: [CustomerReviewSchema],
  
  // Trust Indicators
  total_customers: {
    type: String,
    default: '10,000+'
  },
  countries_exported: {
    type: String,
    default: '15+'
  },
  satisfaction_rate: {
    type: String,
    default: '99.8%'
  },
  support_hours: {
    type: String,
    default: '24/7'
  },
  
  // SEO Settings
  meta_title: {
    type: String,
    default: 'HN FOOD - Thực phẩm sạch cho sức khỏe'
  },
  meta_description: {
    type: String,
    default: 'Cung cấp thực phẩm hữu cơ, sản phẩm chăm sóc sức khỏe chất lượng cao với thanh toán VietQR tiện lợi'
  },
  meta_keywords: {
    type: String,
    default: 'thực phẩm hữu cơ, nấm linh chi, sản phẩm sạch, VietQR'
  },
  
  // Footer Content
  footer_about: {
    type: String,
    default: 'HN FOOD cam kết mang đến những sản phẩm thực phẩm sạch, an toàn và chất lượng cao nhất cho sức khỏe của bạn và gia đình.'
  },
  
  // Business Hours
  business_hours: {
    weekdays: {
      type: String,
      default: '8:00 - 18:00'
    },
    weekend: {
      type: String,
      default: '9:00 - 17:00'
    }
  },
  
  // Shipping Settings
  free_shipping_threshold: {
    type: Number,
    default: 200000
  },
  shipping_fee: {
    type: Number,
    default: 25000
  },
  
  // Wallet Settings
  wallet_bonus_percentage: {
    type: Number,
    default: 20
  },
  
  // Maintenance Mode
  maintenance_mode: {
    type: Boolean,
    default: false
  },
  maintenance_message: {
    type: String,
    default: 'Website đang bảo trì, vui lòng quay lại sau.'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
WebsiteSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

WebsiteSettingsSchema.statics.updateSettings = async function(updates) {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(updates);
  } else {
    Object.assign(settings, updates);
    await settings.save();
  }
  return settings;
};

module.exports = mongoose.model('WebsiteSettings', WebsiteSettingsSchema);
