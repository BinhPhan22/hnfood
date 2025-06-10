const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for non-registered users
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Số lượng phải lớn hơn 0']
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  shipping_info: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  subtotal: {
    type: Number,
    required: true
  },
  shipping_fee: {
    type: Number,
    default: 0
  },
  total_amount: {
    type: Number,
    required: true
  },
  payment_method: {
    type: String,
    enum: ['vietqr', 'bank_transfer', 'cod', 'points', 'wallet'],
    required: true
  },
  points_used: {
    type: Number,
    default: 0
  },
  points_value: {
    type: Number,
    default: 0
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  order_status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  vietqr_transaction_id: {
    type: String
  },
  promotion_code: {
    type: String
  },
  discount_amount: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);