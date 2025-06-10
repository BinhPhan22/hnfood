const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const QRCode = require('qrcode');
const Order = require('../models/Order');
const WalletTransaction = require('../models/WalletTransaction');
const { protect } = require('../middleware/authMiddleware');

// VietQR Configuration
const VIETQR_CONFIG = {
  bankId: '970422', // MB Bank
  accountNo: '0123456789',
  accountName: 'HN FOOD COMPANY',
  template: 'compact2'
};

// Generate VietQR payment
router.post('/vietqr/generate', protect, async (req, res) => {
  try {
    const { orderId, amount, description } = req.body;

    // Validate order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập đơn hàng này'
      });
    }

    // Generate unique transaction reference
    const transactionRef = `HN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Create VietQR URL
    const vietqrUrl = `https://img.vietqr.io/image/${VIETQR_CONFIG.bankId}-${VIETQR_CONFIG.accountNo}-${VIETQR_CONFIG.template}.png?amount=${amount}&addInfo=${encodeURIComponent(transactionRef + ' ' + description)}&accountName=${encodeURIComponent(VIETQR_CONFIG.accountName)}`;

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(vietqrUrl);

    // Update order with payment info
    order.payment_reference = transactionRef;
    order.payment_qr_code = qrCodeDataUrl;
    order.payment_expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await order.save();

    res.json({
      success: true,
      data: {
        transactionRef,
        qrCodeUrl: vietqrUrl,
        qrCodeDataUrl,
        bankInfo: {
          bankName: 'MB Bank',
          accountNo: VIETQR_CONFIG.accountNo,
          accountName: VIETQR_CONFIG.accountName
        },
        amount,
        description: transactionRef + ' ' + description,
        expiresAt: order.payment_expires_at
      }
    });

  } catch (error) {
    console.error('VietQR generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo mã QR thanh toán'
    });
  }
});

// Check payment status
router.get('/vietqr/status/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập đơn hàng này'
      });
    }

    // Check if payment has expired
    if (order.payment_expires_at && new Date() > order.payment_expires_at && order.payment_status === 'pending') {
      order.payment_status = 'expired';
      await order.save();
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        paymentReference: order.payment_reference,
        expiresAt: order.payment_expires_at
      }
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi kiểm tra trạng thái thanh toán'
    });
  }
});

// Simulate payment confirmation (for demo purposes)
router.post('/vietqr/confirm', protect, async (req, res) => {
  try {
    const { orderId, transactionRef } = req.body;

    const order = await Order.findById(orderId).populate('user');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    if (order.payment_reference !== transactionRef) {
      return res.status(400).json({
        success: false,
        message: 'Mã giao dịch không hợp lệ'
      });
    }

    if (order.payment_status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Đơn hàng đã được thanh toán'
      });
    }

    // Update order status
    order.payment_status = 'paid';
    order.order_status = 'processing';
    order.paid_at = new Date();
    await order.save();

    // Create wallet transaction record
    await WalletTransaction.create({
      user: order.user._id,
      type: 'payment',
      amount: order.total_amount,
      description: `Thanh toán đơn hàng ${order.order_number}`,
      reference: transactionRef,
      status: 'completed'
    });

    res.json({
      success: true,
      message: 'Thanh toán thành công',
      data: {
        orderId: order._id,
        orderNumber: order.order_number,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        paidAt: order.paid_at
      }
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xác nhận thanh toán'
    });
  }
});

// Wallet top-up with VietQR
router.post('/wallet/topup', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 10000) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền nạp tối thiểu là 10,000 VND'
      });
    }

    if (amount > 10000000) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền nạp tối đa là 10,000,000 VND'
      });
    }

    // Generate unique transaction reference
    const transactionRef = `TOPUP${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Create VietQR URL
    const description = `Nap tien vi ${req.user.name}`;
    const vietqrUrl = `https://img.vietqr.io/image/${VIETQR_CONFIG.bankId}-${VIETQR_CONFIG.accountNo}-${VIETQR_CONFIG.template}.png?amount=${amount}&addInfo=${encodeURIComponent(transactionRef + ' ' + description)}&accountName=${encodeURIComponent(VIETQR_CONFIG.accountName)}`;

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(vietqrUrl);

    // Create pending wallet transaction
    const transaction = await WalletTransaction.create({
      user: req.user._id,
      type: 'topup',
      amount: amount,
      description: `Nạp tiền vào ví`,
      reference: transactionRef,
      status: 'pending',
      expires_at: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    });

    res.json({
      success: true,
      data: {
        transactionId: transaction._id,
        transactionRef,
        qrCodeUrl: vietqrUrl,
        qrCodeDataUrl,
        bankInfo: {
          bankName: 'MB Bank',
          accountNo: VIETQR_CONFIG.accountNo,
          accountName: VIETQR_CONFIG.accountName
        },
        amount,
        description: transactionRef + ' ' + description,
        expiresAt: transaction.expires_at
      }
    });

  } catch (error) {
    console.error('Wallet topup error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo giao dịch nạp tiền'
    });
  }
});

// Confirm wallet top-up (for demo purposes)
router.post('/wallet/topup/confirm', protect, async (req, res) => {
  try {
    const { transactionId, transactionRef } = req.body;

    const transaction = await WalletTransaction.findById(transactionId).populate('user');
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giao dịch'
      });
    }

    if (transaction.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập giao dịch này'
      });
    }

    if (transaction.reference !== transactionRef) {
      return res.status(400).json({
        success: false,
        message: 'Mã giao dịch không hợp lệ'
      });
    }

    if (transaction.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Giao dịch đã được xử lý'
      });
    }

    // Update transaction status
    transaction.status = 'completed';
    transaction.completed_at = new Date();
    await transaction.save();

    // Update user wallet balance
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { wallet_balance: transaction.amount }
    });

    res.json({
      success: true,
      message: 'Nạp tiền thành công',
      data: {
        transactionId: transaction._id,
        amount: transaction.amount,
        newBalance: req.user.wallet_balance + transaction.amount,
        completedAt: transaction.completed_at
      }
    });

  } catch (error) {
    console.error('Wallet topup confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xác nhận nạp tiền'
    });
  }
});

// Get wallet transactions
router.get('/wallet/transactions', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await WalletTransaction.find({ user: req.user._id })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await WalletTransaction.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get wallet transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy lịch sử giao dịch'
    });
  }
});

module.exports = router;
