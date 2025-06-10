const Promotion = require('../models/Promotion');

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Private/Admin
exports.getPromotions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const promotions = await Promotion.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Promotion.countDocuments();
    
    res.json({
      success: true,
      data: {
        promotions,
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Get promotion by code
// @route   GET /api/promotions/:code
// @access  Private/Admin
exports.getPromotionByCode = async (req, res) => {
  try {
    const promotion = await Promotion.findOne({ 
      code: req.params.code.toUpperCase() 
    });
    
    if (promotion) {
      res.json({
        success: true,
        data: promotion
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy mã khuyến mãi'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Create promotion
// @route   POST /api/promotions
// @access  Private/Admin
exports.createPromotion = async (req, res) => {
  try {
    const {
      code,
      discount_type,
      discount_value,
      min_order_value,
      start_date,
      end_date,
      max_uses
    } = req.body;
    
    // Check if code already exists
    const existingPromotion = await Promotion.findOne({ 
      code: code.toUpperCase() 
    });
    
    if (existingPromotion) {
      return res.status(400).json({
        success: false,
        message: 'Mã khuyến mãi đã tồn tại'
      });
    }
    
    const promotion = await Promotion.create({
      code: code.toUpperCase(),
      discount_type,
      discount_value,
      min_order_value,
      start_date,
      end_date,
      max_uses
    });
    
    res.status(201).json({
      success: true,
      data: promotion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Update promotion
// @route   PUT /api/promotions/:id
// @access  Private/Admin
exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy mã khuyến mãi'
      });
    }
    
    // If updating code, check for duplicates
    if (req.body.code && req.body.code.toUpperCase() !== promotion.code) {
      const existingPromotion = await Promotion.findOne({ 
        code: req.body.code.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      
      if (existingPromotion) {
        return res.status(400).json({
          success: false,
          message: 'Mã khuyến mãi đã tồn tại'
        });
      }
      
      req.body.code = req.body.code.toUpperCase();
    }
    
    const updatedPromotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedPromotion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Delete promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy mã khuyến mãi'
      });
    }
    
    await promotion.deleteOne();
    
    res.json({
      success: true,
      message: 'Mã khuyến mãi đã được xóa'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Validate promotion code
// @route   POST /api/promotions/validate
// @access  Public
exports.validatePromotionCode = async (req, res) => {
  try {
    const { code, order_amount } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập mã khuyến mãi'
      });
    }
    
    const promotion = await Promotion.findOne({ 
      code: code.toUpperCase() 
    });
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Mã khuyến mãi không tồn tại'
      });
    }
    
    if (!promotion.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Mã khuyến mãi đã hết hạn hoặc đã hết lượt sử dụng'
      });
    }
    
    if (order_amount && order_amount < promotion.min_order_value) {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng tối thiểu ${promotion.min_order_value.toLocaleString('vi-VN')} VND để sử dụng mã này`
      });
    }
    
    const discount_amount = order_amount ? promotion.calculateDiscount(order_amount) : 0;
    
    res.json({
      success: true,
      data: {
        code: promotion.code,
        discount_type: promotion.discount_type,
        discount_value: promotion.discount_value,
        discount_amount,
        min_order_value: promotion.min_order_value,
        message: `Áp dụng thành công! Giảm ${discount_amount.toLocaleString('vi-VN')} VND`
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};
