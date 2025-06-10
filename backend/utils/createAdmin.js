const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@hnfood.vn' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists');
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123456', salt);

    // Create admin user
    const admin = await User.create({
      name: 'Admin HN FOOD',
      email: 'admin@hnfood.vn',
      password: hashedPassword,
      phone: '0123456789',
      address: '174 CMT8, Biên Hòa, Đồng Nai',
      role: 'admin',
      is_verified: true
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@hnfood.vn');
    console.log('🔑 Password: admin123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
