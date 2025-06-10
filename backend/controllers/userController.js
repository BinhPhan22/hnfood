const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, birthday } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Email đã được sử dụng' 
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      birthday
    });
    
    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          wallet_balance: user.wallet_balance,
          loyalty_points: user.loyalty_points,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: 'Dữ liệu người dùng không hợp lệ' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }
    
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        wallet_balance: user.wallet_balance,
        loyalty_points: user.loyalty_points,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          birthday: user.birthday,
          wallet_balance: user.wallet_balance,
          loyalty_points: user.loyalty_points,
          role: user.role
        }
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy người dùng' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.birthday = req.body.birthday || user.birthday;
      
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          birthday: updatedUser.birthday,
          wallet_balance: updatedUser.wallet_balance,
          loyalty_points: updatedUser.loyalty_points,
          role: updatedUser.role
        }
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy người dùng' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
};

// @desc    Get wallet transactions
// @route   GET /api/users/wallet/transactions
// @access  Private
exports.getWalletTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const transactions = await WalletTransaction.find({ user: req.user.id })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await WalletTransaction.countDocuments({ user: req.user.id });
    
    res.json({
      success: true,
      data: {
        transactions,
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server' 
    });
  }
};
