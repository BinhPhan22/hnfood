const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const PointsService = require('../services/pointsService');
const SystemSettings = require('../models/SystemSettings');
const WalletTransaction = require('../models/WalletTransaction');

// @desc    Get user wallet balance and points
// @route   GET /api/wallet/balance
// @access  Private
router.get('/balance', protect, async (req, res) => {
  try {
    const result = await PointsService.getUserBalance(req.user._id);
    
    if (result.success) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await PointsService.getTransactionHistory(req.user._id, page, limit);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.transactions,
        pagination: result.pagination
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Error getting transaction history:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @desc    Deposit money to wallet
// @route   POST /api/wallet/deposit
// @access  Private
router.post('/deposit', protect, async (req, res) => {
  try {
    const { amount, payment_method = 'vietqr', transaction_id } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền nạp phải lớn hơn 0'
      });
    }
    
    if (amount < 10000) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền nạp tối thiểu là 10,000 VND'
      });
    }
    
    const result = await PointsService.addPointsFromDeposit(
      req.user._id, 
      amount, 
      payment_method, 
      transaction_id
    );
    
    if (result.success) {
      res.json({
        success: true,
        data: {
          pointsEarned: result.pointsEarned,
          bonusAmount: result.bonusAmount,
          newBalance: result.newBalance,
          newPoints: result.newPoints,
          transaction: result.transaction
        },
        message: `Nạp tiền thành công! Bạn nhận được ${result.pointsEarned} điểm`
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Error depositing to wallet:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @desc    Calculate points for amount
// @route   POST /api/wallet/calculate-points
// @access  Private
router.post('/calculate-points', protect, async (req, res) => {
  try {
    const { amount, type = 'deposit' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền phải lớn hơn 0'
      });
    }
    
    let result;
    if (type === 'deposit') {
      result = await PointsService.calculatePointsFromDeposit(amount);
    } else if (type === 'purchase') {
      const points = await PointsService.calculatePointsForPurchase(amount);
      result = { points };
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error calculating points:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @desc    Check if user can afford purchase with points
// @route   POST /api/wallet/check-affordability
// @access  Private
router.post('/check-affordability', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền phải lớn hơn 0'
      });
    }
    
    const result = await PointsService.canAffordWithPoints(req.user._id, amount);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error checking affordability:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @desc    Get system settings for points and shipping
// @route   GET /api/wallet/settings
// @access  Public
router.get('/settings', async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    
    res.json({
      success: true,
      data: {
        shipping_fee: settings.shipping_fee,
        free_shipping_threshold: settings.free_shipping_threshold,
        points_bonus_percentage: settings.points_bonus_percentage,
        points_to_vnd_rate: settings.points_to_vnd_rate,
        payment_methods: {
          vietqr_enabled: settings.vietqr_enabled,
          cod_enabled: settings.cod_enabled,
          points_payment_enabled: settings.points_payment_enabled,
          wallet_payment_enabled: settings.wallet_payment_enabled
        }
      }
    });
  } catch (error) {
    console.error('Error getting wallet settings:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// ADMIN ROUTES

// @desc    Get all transactions (Admin)
// @route   GET /api/wallet/admin/transactions
// @access  Private/Admin
router.get('/admin/transactions', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { type, status, user_id } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (user_id) filter.user = user_id;
    
    const transactions = await WalletTransaction.find(filter)
      .populate('user', 'name email phone')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await WalletTransaction.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting admin transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @desc    Update system settings (Admin)
// @route   PUT /api/wallet/admin/settings
// @access  Private/Admin
router.put('/admin/settings', protect, admin, async (req, res) => {
  try {
    const updates = req.body;
    const settings = await SystemSettings.updateSettings(updates, req.user._id);
    
    res.json({
      success: true,
      data: settings,
      message: 'Cập nhật cài đặt thành công'
    });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// @desc    Get system statistics (Admin)
// @route   GET /api/wallet/admin/stats
// @access  Private/Admin
router.get('/admin/stats', protect, admin, async (req, res) => {
  try {
    const totalDeposits = await WalletTransaction.aggregate([
      { $match: { type: 'deposit', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    
    const totalPurchases = await WalletTransaction.aggregate([
      { $match: { type: 'points_purchase', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$points_used' }, count: { $sum: 1 } } }
    ]);
    
    const totalPointsEarned = await WalletTransaction.aggregate([
      { $match: { points_earned: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: '$points_earned' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        deposits: {
          total_amount: totalDeposits[0]?.total || 0,
          count: totalDeposits[0]?.count || 0
        },
        purchases: {
          total_points: totalPurchases[0]?.total || 0,
          count: totalPurchases[0]?.count || 0
        },
        points_earned: totalPointsEarned[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error getting wallet stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

module.exports = router;
