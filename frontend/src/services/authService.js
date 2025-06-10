import api from './api';

const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    return response.data;
  },

  // Login user
  login: async (userData) => {
    const response = await api.post('/users/login', userData);
    
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingInfo');
    localStorage.removeItem('paymentMethod');
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    
    if (response.data.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...user, ...response.data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  },

  // Get wallet transactions
  getWalletTransactions: async (page = 1, limit = 10) => {
    const response = await api.get(`/users/wallet/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },
};

export default authService;
