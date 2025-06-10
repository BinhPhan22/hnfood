import api from './api';

const vietqrService = {
  // Generate QR code for order
  generateQR: async (orderId) => {
    const response = await api.post('/vietqr/generate', { order_id: orderId });
    return response.data;
  },

  // Top up wallet
  topUpWallet: async (amount) => {
    const response = await api.post('/vietqr/topup', { amount });
    return response.data;
  },

  // Check transaction status
  checkTransactionStatus: async (transactionId) => {
    const response = await api.get(`/vietqr/status/${transactionId}`);
    return response.data;
  },

  // Validate promotion code
  validatePromotionCode: async (code, orderAmount) => {
    const response = await api.post('/promotions/validate', {
      code,
      order_amount: orderAmount,
    });
    return response.data;
  },
};

export default vietqrService;
