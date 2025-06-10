const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');

dotenv.config();

const createTestUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const testUsers = [
      {
        name: 'Nguyễn Văn Test 1',
        email: 'test1@hnfood.vn',
        password: '123456',
        phone: '0901234567',
        address: 'Hà Nội',
        loyalty_points: 1000,
        wallet_balance: 500000,
        role: 'user'
      },
      {
        name: 'Trần Thị Test 2',
        email: 'test2@hnfood.vn',
        password: '123456',
        phone: '0901234568',
        address: 'TP.HCM',
        loyalty_points: 2000,
        wallet_balance: 1000000,
        role: 'user'
      },
      {
        name: 'Lê Văn Test 3',
        email: 'test3@hnfood.vn',
        password: '123456',
        phone: '0901234569',
        address: 'Đà Nẵng',
        loyalty_points: 5000,
        wallet_balance: 2000000,
        role: 'user'
      }
    ];

    console.log('🔄 Creating test users...');

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, updating...`);
        
        // Update existing user
        existingUser.loyalty_points = userData.loyalty_points;
        existingUser.wallet_balance = userData.wallet_balance;
        await existingUser.save();
        
        console.log(`✅ Updated ${userData.name}:`);
        console.log(`   - Email: ${userData.email}`);
        console.log(`   - Points: ${userData.loyalty_points.toLocaleString('vi-VN')}`);
        console.log(`   - Wallet: ${userData.wallet_balance.toLocaleString('vi-VN')} VND`);
        
      } else {
        // Create new user
        const user = await User.create(userData);
        
        // Create initial transactions
        if (userData.loyalty_points > 0) {
          await WalletTransaction.create({
            user: user._id,
            type: 'bonus',
            amount: 0,
            points_earned: userData.loyalty_points,
            status: 'completed',
            description: `Điểm khởi tạo tài khoản test: ${userData.loyalty_points} điểm`
          });
        }
        
        if (userData.wallet_balance > 0) {
          await WalletTransaction.create({
            user: user._id,
            type: 'deposit',
            amount: userData.wallet_balance,
            status: 'completed',
            description: `Số dư khởi tạo tài khoản test: ${userData.wallet_balance.toLocaleString('vi-VN')} VND`
          });
        }
        
        console.log(`✅ Created ${userData.name}:`);
        console.log(`   - Email: ${userData.email}`);
        console.log(`   - Password: ${userData.password}`);
        console.log(`   - Points: ${userData.loyalty_points.toLocaleString('vi-VN')}`);
        console.log(`   - Wallet: ${userData.wallet_balance.toLocaleString('vi-VN')} VND`);
      }
      
      console.log('');
    }

    console.log('🎉 Test users created/updated successfully!');
    console.log('');
    console.log('📋 LOGIN CREDENTIALS:');
    console.log('');
    
    testUsers.forEach((user, index) => {
      console.log(`👤 Test User ${index + 1}:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Points: ${user.loyalty_points.toLocaleString('vi-VN')} điểm`);
      console.log(`   Wallet: ${user.wallet_balance.toLocaleString('vi-VN')} VND`);
      console.log('');
    });
    
    console.log('💡 TESTING SCENARIOS:');
    console.log('');
    console.log('🛒 Test User 1 (1,000 điểm):');
    console.log('   - Có thể mua sản phẩm ≤ 1,000,000 VND bằng điểm');
    console.log('   - Ví dụ: Sản phẩm 500,000 VND = 500 điểm');
    console.log('');
    console.log('🛒 Test User 2 (2,000 điểm):');
    console.log('   - Có thể mua sản phẩm ≤ 2,000,000 VND bằng điểm');
    console.log('   - Ví dụ: Sản phẩm 1,500,000 VND = 1,500 điểm');
    console.log('');
    console.log('🛒 Test User 3 (5,000 điểm):');
    console.log('   - Có thể mua sản phẩm ≤ 5,000,000 VND bằng điểm');
    console.log('   - Ví dụ: Sản phẩm 3,000,000 VND = 3,000 điểm');
    console.log('');
    console.log('💰 DEPOSIT TESTING:');
    console.log('   - Nạp 1,000,000 VND với 20% thưởng = 1,200 điểm');
    console.log('   - Nạp 500,000 VND với 20% thưởng = 600 điểm');
    console.log('');
    console.log('🚚 SHIPPING TESTING:');
    console.log('   - Đơn hàng < 500,000 VND: Phí ship 30,000 VND');
    console.log('   - Đơn hàng ≥ 500,000 VND: Miễn phí ship');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  }
};

createTestUsers();
