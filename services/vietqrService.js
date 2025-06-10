const axios = require('axios');
const Order = require('../models/Order');

// VietQR Service
const vietQRService = {
  // Tạo mã QR động
  generateQR: async (orderData) => {
    try {
      const response = await axios.post('https://api.vietqr.io/v1/generate', {
        account_number: process.env.BANK_ACCOUNT_NUMBER,
        amount: orderData.total_amount,
        order_id: orderData._id,
        description: `Thanh toan don hang #${orderData._id}`
      }, {
        headers: { 
          'Authorization': `Bearer ${process.env.VIETQR_API_KEY}` 
        }
      });
      
      return {
        qr_code_url: response.data.qr_code_url,
        transaction_id: response.data.transaction_id
      };
    } catch (error) {
      console.error('VietQR generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  },
  
  // Xác nhận giao dịch từ webhook
  verifyTransaction: async (webhookData) => {
    const { transaction_id, status, amount, order_id } = webhookData;
    
    if (status === 'success') {
      await Order.findByIdAndUpdate(order_id, {
        status: 'processing',
        vietqr_transaction_id: transaction_id
      });
      
      return true;
    }
    
    return false;
  }
};

module.exports = vietQRService;