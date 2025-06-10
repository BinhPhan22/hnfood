const mongoose = require('mongoose');

const SystemSettingsSchema = new mongoose.Schema({
  // Shipping Configuration
  shipping_fee: {
    type: Number,
    default: 30000, // 30,000 VND
    min: 0
  },
  free_shipping_threshold: {
    type: Number,
    default: 500000, // 500,000 VND
    min: 0
  },
  
  // Points System Configuration
  points_bonus_percentage: {
    type: Number,
    default: 20, // 20% bonus
    min: 0,
    max: 100
  },
  points_to_vnd_rate: {
    type: Number,
    default: 1000, // 1 point = 1000 VND
    min: 1
  },
  
  // Payment Configuration
  vietqr_enabled: {
    type: Boolean,
    default: true
  },
  cod_enabled: {
    type: Boolean,
    default: true
  },
  points_payment_enabled: {
    type: Boolean,
    default: true
  },
  wallet_payment_enabled: {
    type: Boolean,
    default: true
  },
  
  // Order Configuration
  auto_confirm_orders: {
    type: Boolean,
    default: false
  },
  order_cancellation_time: {
    type: Number,
    default: 24, // hours
    min: 1
  },
  
  // Notification Configuration
  email_notifications: {
    type: Boolean,
    default: true
  },
  sms_notifications: {
    type: Boolean,
    default: false
  },
  
  // Business Information
  business_name: {
    type: String,
    default: 'HN FOOD'
  },
  business_address: {
    type: String,
    default: '174 CMT8, Biên Hòa, Đồng Nai'
  },
  business_phone: {
    type: String,
    default: '0123 456 789'
  },
  business_email: {
    type: String,
    default: 'support@hnfood.vn'
  },
  
  // Tax Configuration
  tax_rate: {
    type: Number,
    default: 0, // 0% VAT
    min: 0,
    max: 100
  },
  
  // Maintenance Mode
  maintenance_mode: {
    type: Boolean,
    default: false
  },
  maintenance_message: {
    type: String,
    default: 'Website đang bảo trì. Vui lòng quay lại sau.'
  },
  
  updated_at: {
    type: Date,
    default: Date.now
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Update timestamp on save
SystemSettingsSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Ensure only one settings document exists
SystemSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

SystemSettingsSchema.statics.updateSettings = async function(updates, updatedBy) {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this(updates);
  } else {
    Object.assign(settings, updates);
  }
  settings.updated_by = updatedBy;
  return await settings.save();
};

module.exports = mongoose.model('SystemSettings', SystemSettingsSchema);
