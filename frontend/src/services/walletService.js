import api from './api';

const walletService = {
  // Get user wallet balance and points
  getBalance: async () => {
    const response = await api.get('/wallet/balance');
    return response.data;
  },

  // Get transaction history
  getTransactions: async (page = 1, limit = 10) => {
    const response = await api.get(`/wallet/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Deposit money to wallet
  deposit: async (amount, paymentMethod = 'vietqr', transactionId = null) => {
    const response = await api.post('/wallet/deposit', {
      amount,
      payment_method: paymentMethod,
      transaction_id: transactionId
    });
    return response.data;
  },

  // Calculate points for amount
  calculatePoints: async (amount, type = 'deposit') => {
    const response = await api.post('/wallet/calculate-points', {
      amount,
      type
    });
    return response.data;
  },

  // Check if user can afford purchase with points
  checkAffordability: async (amount) => {
    const response = await api.post('/wallet/check-affordability', {
      amount
    });
    return response.data;
  },

  // Get wallet settings (public)
  getSettings: async () => {
    const response = await api.get('/wallet/settings');
    return response.data;
  }
};

export default walletService;
