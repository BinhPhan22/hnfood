const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SystemSettings = require('../models/SystemSettings');

dotenv.config();

const initSystemSettings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if settings already exist
    const existingSettings = await SystemSettings.findOne();
    if (existingSettings) {
      console.log('❌ System settings already exist');
      console.log('Current settings:');
      console.log(`   - Shipping fee: ${existingSettings.shipping_fee.toLocaleString('vi-VN')} VND`);
      console.log(`   - Free shipping threshold: ${existingSettings.free_shipping_threshold.toLocaleString('vi-VN')} VND`);
      console.log(`   - Points bonus: ${existingSettings.points_bonus_percentage}%`);
      console.log(`   - Points rate: 1 point = ${existingSettings.points_to_vnd_rate.toLocaleString('vi-VN')} VND`);
      process.exit(1);
    }

    // Create default system settings
    const defaultSettings = {
      // Shipping Configuration
      shipping_fee: 30000, // 30,000 VND
      free_shipping_threshold: 500000, // 500,000 VND
      
      // Points System Configuration
      points_bonus_percentage: 20, // 20% bonus
      points_to_vnd_rate: 1000, // 1 point = 1000 VND
      
      // Payment Configuration
      vietqr_enabled: true,
      cod_enabled: true,
      points_payment_enabled: true,
      wallet_payment_enabled: true,
      
      // Order Configuration
      auto_confirm_orders: false,
      order_cancellation_time: 24, // hours
      
      // Notification Configuration
      email_notifications: true,
      sms_notifications: false,
      
      // Business Information
      business_name: 'HN FOOD',
      business_address: '174 CMT8, Biên Hòa, Đồng Nai',
      business_phone: '0123 456 789',
      business_email: 'support@hnfood.vn',
      
      // Tax Configuration
      tax_rate: 0, // 0% VAT
      
      // Maintenance Mode
      maintenance_mode: false,
      maintenance_message: 'Website đang bảo trì. Vui lòng quay lại sau.'
    };

    const settings = await SystemSettings.create(defaultSettings);
    
    console.log('✅ System settings initialized successfully');
    console.log('📦 Shipping Configuration:');
    console.log(`   - Shipping fee: ${settings.shipping_fee.toLocaleString('vi-VN')} VND`);
    console.log(`   - Free shipping threshold: ${settings.free_shipping_threshold.toLocaleString('vi-VN')} VND`);
    
    console.log('🎯 Points System:');
    console.log(`   - Bonus percentage: ${settings.points_bonus_percentage}%`);
    console.log(`   - Points rate: 1 point = ${settings.points_to_vnd_rate.toLocaleString('vi-VN')} VND`);
    console.log(`   - Example: Nạp 1,000,000 VND → Nhận ${Math.floor((1000000 + 1000000 * 0.2) / 1000)} điểm`);
    
    console.log('💳 Payment Methods:');
    console.log(`   - VietQR: ${settings.vietqr_enabled ? 'Enabled' : 'Disabled'}`);
    console.log(`   - COD: ${settings.cod_enabled ? 'Enabled' : 'Disabled'}`);
    console.log(`   - Points: ${settings.points_payment_enabled ? 'Enabled' : 'Disabled'}`);
    console.log(`   - Wallet: ${settings.wallet_payment_enabled ? 'Enabled' : 'Disabled'}`);
    
    console.log('🏢 Business Info:');
    console.log(`   - Name: ${settings.business_name}`);
    console.log(`   - Address: ${settings.business_address}`);
    console.log(`   - Phone: ${settings.business_phone}`);
    console.log(`   - Email: ${settings.business_email}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing system settings:', error);
    process.exit(1);
  }
};

// Example calculations
const showExamples = () => {
  console.log('\n📊 EXAMPLES:');
  console.log('💰 Deposit Examples (20% bonus):');
  console.log('   - Nạp 100,000 VND → Nhận 120 điểm');
  console.log('   - Nạp 500,000 VND → Nhận 600 điểm');
  console.log('   - Nạp 1,000,000 VND → Nhận 1,200 điểm');
  
  console.log('\n🛒 Purchase Examples:');
  console.log('   - Sản phẩm 50,000 VND → Cần 50 điểm');
  console.log('   - Sản phẩm 200,000 VND → Cần 200 điểm');
  console.log('   - Sản phẩm 500,000 VND → Cần 500 điểm');
  
  console.log('\n🚚 Shipping Examples:');
  console.log('   - Đơn hàng < 500,000 VND → Phí ship 30,000 VND');
  console.log('   - Đơn hàng ≥ 500,000 VND → Miễn phí ship');
};

// Check command line arguments
const command = process.argv[2];

if (command === 'examples') {
  showExamples();
} else {
  initSystemSettings();
}
