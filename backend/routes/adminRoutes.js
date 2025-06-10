const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

// Import controllers
const {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  getAllProducts,
  updateOrderStatus,
  updateUserRole
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

// Orders management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Products management (already handled in productRoutes with admin middleware)
router.get('/products', getAllProducts);

module.exports = router;
