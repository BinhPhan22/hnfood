const express = require('express');
const router = express.Router();
const {
  getPromotions,
  getPromotionByCode,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotionCode
} = require('../controllers/promotionController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validatePromotion } = require('../middleware/validation');

// Public routes
router.post('/validate', validatePromotionCode);

// Protected routes
router.get('/', protect, admin, getPromotions);
router.get('/:code', protect, admin, getPromotionByCode);
router.post('/', protect, admin, validatePromotion, createPromotion);
router.put('/:id', protect, admin, validatePromotion, updatePromotion);
router.delete('/:id', protect, admin, deletePromotion);

module.exports = router;
