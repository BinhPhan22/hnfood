const mongoose = require('mongoose');

const WalletTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  bonus: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['deposit', 'purchase', 'refund', 'bonus'],
    required: true
  },
  reference: {
    type: String // Order ID or other reference
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  vietqr_transaction_id: {
    type: String
  },
  description: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
WalletTransactionSchema.index({ user: 1, created_at: -1 });
WalletTransactionSchema.index({ vietqr_transaction_id: 1 });

module.exports = mongoose.model('WalletTransaction', WalletTransactionSchema);
