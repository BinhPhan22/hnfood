const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');
const PointsService = require('../services/pointsService');
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

// ADMIN FUNCTIONS

// @desc    Get all users (Admin)
// @route   GET /api/users/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { search, role } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
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

// @desc    Get user by ID (Admin)
// @route   GET /api/users/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Get recent transactions
    const recentTransactions = await WalletTransaction.find({ user: user._id })
      .sort({ created_at: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        user,
        recentTransactions
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

// @desc    Update user points (Admin)
// @route   PUT /api/users/admin/users/:id/points
// @access  Private/Admin
exports.updateUserPoints = async (req, res) => {
  try {
    const { points, reason } = req.body;

    if (!points || typeof points !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Số điểm phải là một số hợp lệ'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    const oldPoints = user.loyalty_points;
    const pointsDifference = points - oldPoints;

    // Update user points
    user.loyalty_points = points;
    await user.save();

    // Create transaction record
    await WalletTransaction.create({
      user: user._id,
      type: pointsDifference > 0 ? 'bonus' : 'purchase',
      amount: 0,
      points_earned: pointsDifference > 0 ? pointsDifference : 0,
      points_used: pointsDifference < 0 ? Math.abs(pointsDifference) : 0,
      status: 'completed',
      description: reason || `Admin ${pointsDifference > 0 ? 'cộng' : 'trừ'} ${Math.abs(pointsDifference)} điểm`
    });

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          loyalty_points: user.loyalty_points
        },
        pointsChanged: pointsDifference
      },
      message: `Đã cập nhật điểm thành công. ${pointsDifference > 0 ? 'Cộng' : 'Trừ'} ${Math.abs(pointsDifference)} điểm`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Update user wallet balance (Admin)
// @route   PUT /api/users/admin/users/:id/wallet
// @access  Private/Admin
exports.updateUserWallet = async (req, res) => {
  try {
    const { amount, reason } = req.body;

    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Số tiền phải là một số hợp lệ'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    const oldBalance = user.wallet_balance;
    const balanceDifference = amount - oldBalance;

    // Update user wallet
    user.wallet_balance = amount;
    await user.save();

    // Create transaction record
    await WalletTransaction.create({
      user: user._id,
      type: balanceDifference > 0 ? 'deposit' : 'purchase',
      amount: balanceDifference,
      status: 'completed',
      description: reason || `Admin ${balanceDifference > 0 ? 'cộng' : 'trừ'} ${Math.abs(balanceDifference).toLocaleString('vi-VN')} VND`
    });

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          wallet_balance: user.wallet_balance
        },
        balanceChanged: balanceDifference
      },
      message: `Đã cập nhật số dư ví thành công`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Create test user (Admin)
// @route   POST /api/users/admin/create-test-user
// @access  Private/Admin
exports.createTestUser = async (req, res) => {
  try {
    const { name, email, password, points, walletBalance } = req.body;

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
      password: password || '123456',
      phone: '0123456789',
      loyalty_points: points || 0,
      wallet_balance: walletBalance || 0,
      role: 'customer'
    });

    // Create initial transaction if points or wallet balance provided
    if (points > 0) {
      await WalletTransaction.create({
        user: user._id,
        type: 'bonus',
        amount: 0,
        points_earned: points,
        status: 'completed',
        description: `Điểm khởi tạo: ${points} điểm`
      });
    }

    if (walletBalance > 0) {
      await WalletTransaction.create({
        user: user._id,
        type: 'deposit',
        amount: walletBalance,
        status: 'completed',
        description: `Số dư khởi tạo: ${walletBalance.toLocaleString('vi-VN')} VND`
      });
    }

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        loyalty_points: user.loyalty_points,
        wallet_balance: user.wallet_balance
      },
      message: 'Tạo tài khoản test thành công'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};
