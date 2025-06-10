const axios = require('axios');
const Order = require('../models/Order');
const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');

// @desc    Generate VietQR code for an order
// @route   POST /api/vietqr/generate
// @access  Public
exports.generateQR = async (req, res) => {
  try {
    const { order_id } = req.body;
    
    // Find the order
    const order = await Order.findById(order_id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy đơn hàng' 
      });
    }
    
    // Generate QR code via VietQR API
    const qrData = {
      accountNo: process.env.BANK_ACCOUNT_NUMBER,
      accountName: process.env.ACCOUNT_HOLDER || 'CONG TY HN FOOD',
      acqId: process.env.BANK_CODE || '970415', // Vietinbank
      amount: order.total_amount,
      addInfo: `Thanh toan don hang #${order._id.toString().slice(-6)}`,
      format: 'text',
      template: 'compact'
    };
    
    const response = await axios.post('https://api.vietqr.io/v2/generate', qrData, {
      headers: { 
        'x-client-id': process.env.VIETQR_CLIENT_ID,
        'x-api-key': process.env.VIETQR_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.code === '00') {
      // Update order with QR info
      order.vietqr_transaction_id = `VQR_${order._id}_${Date.now()}`;
      await order.save();
      
      res.json({
        success: true,
        data: {
          qr_code: response.data.data.qrCode,
          qr_data_url: response.data.data.qrDataURL,
          transaction_id: order.vietqr_transaction_id,
          amount: order.total_amount,
          account_info: {
            account_no: qrData.accountNo,
            account_name: qrData.accountName,
            bank_name: process.env.BANK_NAME || 'Vietinbank'
          }
        }
      });
    } else {
      throw new Error(response.data.desc || 'VietQR API error');
    }
  } catch (error) {
    console.error('VietQR generation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi tạo mã QR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Handle VietQR webhook
// @route   POST /webhook/vietqr
// @access  Public
exports.handleWebhook = async (req, res) => {
  try {
    const { 
      id, 
      gateway, 
      transactionDate, 
      accountNumber, 
      subAccount, 
      amountIn, 
      amountOut, 
      accumulated, 
      code, 
      content, 
      description 
    } = req.body;
    
    console.log('VietQR Webhook received:', req.body);
    
    // Extract order ID from content
    const orderIdMatch = content.match(/don hang #(\w+)/i);
    if (!orderIdMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Không tìm thấy mã đơn hàng trong nội dung' 
      });
    }
    
    const orderIdSuffix = orderIdMatch[1];
    
    // Find order by suffix
    const order = await Order.findOne({
      _id: { $regex: orderIdSuffix + '$' }
    });
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy đơn hàng' 
      });
    }
    
    // Verify amount
    if (amountIn !== order.total_amount) {
      return res.status(400).json({ 
        success: false,
        message: 'Số tiền không khớp' 
      });
    }
    
    // Update order status
    order.payment_status = 'paid';
    order.order_status = 'processing';
    order.vietqr_transaction_id = id;
    await order.save();
    
    // If user is registered, update loyalty points
    if (order.user) {
      const user = await User.findById(order.user);
      
      if (user) {
        // Add loyalty points (1000 VND = 1 point)
        const pointsToAdd = Math.floor(order.total_amount / 1000);
        user.loyalty_points += pointsToAdd;
        await user.save();
      }
    }
    
    // TODO: Send confirmation email
    
    res.json({ 
      success: true,
      message: 'Webhook processed successfully' 
    });
  } catch (error) {
    console.error('VietQR webhook error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi xử lý webhook' 
    });
  }
};

// @desc    Top up wallet
// @route   POST /api/vietqr/topup
// @access  Private
exports.topUpWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;
    
    // Validate amount
    if (!amount || amount < 10000) {
      return res.status(400).json({ 
        success: false,
        message: 'Số tiền nạp tối thiểu là 10,000 VND' 
      });
    }
    
    // Calculate bonus (20% for deposits >= 1,000,000 VND)
    let bonus = 0;
    const bonusThreshold = parseInt(process.env.WALLET_BONUS_THRESHOLD) || 1000000;
    const bonusPercentage = parseFloat(process.env.WALLET_BONUS_PERCENTAGE) || 0.2;
    
    if (amount >= bonusThreshold) {
      bonus = Math.round(amount * bonusPercentage);
    }
    
    // Generate QR code via VietQR API
    const qrData = {
      accountNo: process.env.BANK_ACCOUNT_NUMBER,
      accountName: process.env.ACCOUNT_HOLDER || 'CONG TY HN FOOD',
      acqId: process.env.BANK_CODE || '970415',
      amount: amount,
      addInfo: `Nap tien vi HN FOOD ${userId}`,
      format: 'text',
      template: 'compact'
    };
    
    const response = await axios.post('https://api.vietqr.io/v2/generate', qrData, {
      headers: { 
        'x-client-id': process.env.VIETQR_CLIENT_ID,
        'x-api-key': process.env.VIETQR_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.code === '00') {
      // Create wallet transaction record
      const transactionId = `TOPUP_${userId}_${Date.now()}`;
      
      const transaction = await WalletTransaction.create({
        user: userId,
        amount: amount,
        bonus: bonus,
        type: 'deposit',
        reference: transactionId,
        status: 'pending',
        vietqr_transaction_id: transactionId,
        description: `Nạp tiền vào ví qua VietQR`
      });
      
      res.json({
        success: true,
        data: {
          qr_code: response.data.data.qrCode,
          qr_data_url: response.data.data.qrDataURL,
          transaction_id: transactionId,
          amount: amount,
          bonus: bonus,
          total: amount + bonus,
          account_info: {
            account_no: qrData.accountNo,
            account_name: qrData.accountName,
            bank_name: process.env.BANK_NAME || 'Vietinbank'
          }
        }
      });
    } else {
      throw new Error(response.data.desc || 'VietQR API error');
    }
  } catch (error) {
    console.error('Wallet top-up error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi nạp tiền vào ví',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Check transaction status
// @route   GET /api/vietqr/status/:transactionId
// @access  Public
exports.checkTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // Check if it's an order transaction
    const order = await Order.findOne({ vietqr_transaction_id: transactionId });
    
    if (order) {
      return res.json({
        success: true,
        data: {
          type: 'order',
          status: order.payment_status,
          order_status: order.order_status,
          amount: order.total_amount
        }
      });
    }
    
    // Check if it's a wallet transaction
    const walletTransaction = await WalletTransaction.findOne({ 
      vietqr_transaction_id: transactionId 
    });
    
    if (walletTransaction) {
      return res.json({
        success: true,
        data: {
          type: 'wallet',
          status: walletTransaction.status,
          amount: walletTransaction.amount,
          bonus: walletTransaction.bonus
        }
      });
    }
    
    res.status(404).json({
      success: false,
      message: 'Không tìm thấy giao dịch'
    });
  } catch (error) {
    console.error('Check transaction status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi kiểm tra trạng thái giao dịch'
    });
  }
};
