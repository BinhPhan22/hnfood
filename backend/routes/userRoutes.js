const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getWalletTransactions,
  getAllUsers,
  getUserById,
  updateUserPoints,
  updateUserWallet,
  createTestUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  validateUserRegistration, 
  validateUserLogin 
} = require('../middleware/validation');

// Public routes
router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/wallet/transactions', protect, getWalletTransactions);

// Admin routes
router.get('/admin/users', protect, admin, getAllUsers);
router.get('/admin/users/:id', protect, admin, getUserById);
router.put('/admin/users/:id/points', protect, admin, updateUserPoints);
router.put('/admin/users/:id/wallet', protect, admin, updateUserWallet);
router.post('/admin/create-test-user', protect, admin, createTestUser);

module.exports = router;
