const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');
const SystemSettings = require('../models/SystemSettings');

class PointsService {
  
  /**
   * Calculate points earned from deposit
   * Formula: (amount + (amount * bonus_percentage / 100)) / points_to_vnd_rate
   * Example: 1,000,000 VND with 20% bonus = 1,200 points
   */
  static async calculatePointsFromDeposit(amount) {
    const settings = await SystemSettings.getSettings();
    const bonusPercentage = settings.points_bonus_percentage;
    const pointsRate = settings.points_to_vnd_rate;
    
    const totalAmount = amount + (amount * bonusPercentage / 100);
    const points = Math.floor(totalAmount / pointsRate);
    
    return {
      points,
      bonusPercentage,
      bonusAmount: amount * bonusPercentage / 100,
      totalAmount
    };
  }
  
  /**
   * Calculate points needed for purchase
   * Formula: amount / points_to_vnd_rate
   * Example: 200,000 VND = 200 points
   */
  static async calculatePointsForPurchase(amount) {
    const settings = await SystemSettings.getSettings();
    const pointsRate = settings.points_to_vnd_rate;
    
    return Math.ceil(amount / pointsRate);
  }
  
  /**
   * Add points to user account from deposit
   */
  static async addPointsFromDeposit(userId, amount, paymentMethod = 'vietqr', transactionId = null) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      const pointsData = await this.calculatePointsFromDeposit(amount);
      
      // Update user points
      user.loyalty_points += pointsData.points;
      user.wallet_balance += amount;
      await user.save();
      
      // Create transaction record
      const transaction = await WalletTransaction.create({
        user: userId,
        type: 'deposit',
        amount: amount,
        bonus: pointsData.bonusAmount,
        points_earned: pointsData.points,
        bonus_percentage: pointsData.bonusPercentage,
        payment_method: paymentMethod,
        vietqr_transaction_id: transactionId,
        status: 'completed',
        description: `Nạp tiền ${amount.toLocaleString('vi-VN')} VND, nhận ${pointsData.points} điểm (bao gồm ${pointsData.bonusPercentage}% thưởng)`
      });
      
      return {
        success: true,
        transaction,
        pointsEarned: pointsData.points,
        bonusAmount: pointsData.bonusAmount,
        newBalance: user.wallet_balance,
        newPoints: user.loyalty_points
      };
      
    } catch (error) {
      console.error('Error adding points from deposit:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Deduct points for purchase
   */
  static async deductPointsForPurchase(userId, amount, orderId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      const pointsNeeded = await this.calculatePointsForPurchase(amount);
      
      if (user.loyalty_points < pointsNeeded) {
        throw new Error(`Insufficient points. Need ${pointsNeeded}, have ${user.loyalty_points}`);
      }
      
      // Deduct points
      user.loyalty_points -= pointsNeeded;
      await user.save();
      
      // Create transaction record
      const transaction = await WalletTransaction.create({
        user: userId,
        type: 'points_purchase',
        amount: -amount,
        points_used: pointsNeeded,
        payment_method: 'points',
        reference: orderId,
        status: 'completed',
        description: `Thanh toán đơn hàng ${amount.toLocaleString('vi-VN')} VND bằng ${pointsNeeded} điểm`
      });
      
      return {
        success: true,
        transaction,
        pointsUsed: pointsNeeded,
        remainingPoints: user.loyalty_points
      };
      
    } catch (error) {
      console.error('Error deducting points for purchase:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Check if user has enough points for purchase
   */
  static async canAffordWithPoints(userId, amount) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { canAfford: false, error: 'User not found' };
      }
      
      const pointsNeeded = await this.calculatePointsForPurchase(amount);
      
      return {
        canAfford: user.loyalty_points >= pointsNeeded,
        pointsNeeded,
        pointsAvailable: user.loyalty_points,
        pointsShortfall: Math.max(0, pointsNeeded - user.loyalty_points)
      };
      
    } catch (error) {
      console.error('Error checking points affordability:', error);
      return {
        canAfford: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get user's points and wallet balance
   */
  static async getUserBalance(userId) {
    try {
      const user = await User.findById(userId).select('loyalty_points wallet_balance');
      if (!user) {
        throw new Error('User not found');
      }
      
      const settings = await SystemSettings.getSettings();
      const pointsValue = user.loyalty_points * settings.points_to_vnd_rate;
      
      return {
        success: true,
        points: user.loyalty_points,
        walletBalance: user.wallet_balance,
        pointsValue,
        totalValue: user.wallet_balance + pointsValue
      };
      
    } catch (error) {
      console.error('Error getting user balance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get user's transaction history
   */
  static async getTransactionHistory(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const transactions = await WalletTransaction.find({ user: userId })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email');
      
      const total = await WalletTransaction.countDocuments({ user: userId });
      
      return {
        success: true,
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
      
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Refund points for cancelled order
   */
  static async refundPointsForOrder(userId, amount, orderId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      const pointsToRefund = await this.calculatePointsForPurchase(amount);
      
      // Add points back
      user.loyalty_points += pointsToRefund;
      await user.save();
      
      // Create refund transaction
      const transaction = await WalletTransaction.create({
        user: userId,
        type: 'refund',
        amount: amount,
        points_earned: pointsToRefund,
        reference: orderId,
        status: 'completed',
        description: `Hoàn ${pointsToRefund} điểm cho đơn hàng bị hủy`
      });
      
      return {
        success: true,
        transaction,
        pointsRefunded: pointsToRefund,
        newPoints: user.loyalty_points
      };
      
    } catch (error) {
      console.error('Error refunding points:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = PointsService;
