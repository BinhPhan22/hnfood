const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const vietQRService = require('../services/vietqrService');

// Product Routes
router.get('/products', productController.getAll);
router.get('/products/:id', productController.getById);
router.post('/products', authMiddleware.isAdmin, productController.create);
router.put('/products/:id', authMiddleware.isAdmin, productController.update);
router.delete('/products/:id', authMiddleware.isAdmin, productController.delete);

// User Routes
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.get('/users/profile', authMiddleware.isAuthenticated, userController.getProfile);
router.put('/users/profile', authMiddleware.isAuthenticated, userController.updateProfile);

// Order Routes
router.post('/orders', orderController.create);
router.get('/orders', authMiddleware.isAuthenticated, orderController.getUserOrders);
router.get('/orders/:id', authMiddleware.isAuthenticated, orderController.getById);

// VietQR Routes
router.post('/vietqr/generate', async (req, res) => {
  try {
    const orderId = req.body.order_id;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const qrData = await vietQRService.generateQR(order);
    res.json(qrData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VietQR Webhook
router.post('/webhook/vietqr', async (req, res) => {
  try {
    const result = await vietQRService.verifyTransaction(req.body);
    res.json({ success: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;