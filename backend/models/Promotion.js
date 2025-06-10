const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  discount_type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discount_value: {
    type: Number,
    required: true
  },
  min_order_value: {
    type: Number,
    default: 0
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  max_uses: {
    type: Number,
    default: null
  },
  current_uses: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Check if promotion is valid
PromotionSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.is_active &&
    now >= this.start_date &&
    now <= this.end_date &&
    (this.max_uses === null || this.current_uses < this.max_uses)
  );
};

// Calculate discount amount
PromotionSchema.methods.calculateDiscount = function(orderAmount) {
  if (!this.isValid() || orderAmount < this.min_order_value) {
    return 0;
  }
  
  if (this.discount_type === 'percentage') {
    return Math.round(orderAmount * (this.discount_value / 100));
  } else {
    return Math.min(this.discount_value, orderAmount);
  }
};

module.exports = mongoose.model('Promotion', PromotionSchema);
