const express = require('express');
const router = express.Router();
const { 
  generateQR,
  topUpWallet,
  checkTransactionStatus
} = require('../controllers/vietqrController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Generate QR code for order (public)
router.post('/generate', generateQR);

// Top up wallet (protected)
router.post('/topup', protect, topUpWallet);

// Check transaction status
router.get('/status/:transactionId', checkTransactionStatus);

module.exports = router;
