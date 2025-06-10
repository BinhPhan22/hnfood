const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errorMessages
    });
  }
  
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên phải có từ 2-50 ký tự'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),
  
  body('phone')
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống'),
  
  handleValidationErrors
];

// Product validation
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Tên sản phẩm phải có từ 2-200 ký tự'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Giá phải là số dương'),
  
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Mô tả phải có ít nhất 10 ký tự'),
  
  body('category')
    .isIn(['thuc-pham-huu-co', 'cham-soc-ca-nhan', 'thuc-pham-chuc-nang'])
    .withMessage('Danh mục không hợp lệ'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Số lượng tồn kho phải là số nguyên không âm'),
  
  handleValidationErrors
];

// Order validation
const validateOrder = [
  body('products')
    .isArray({ min: 1 })
    .withMessage('Đơn hàng phải có ít nhất 1 sản phẩm'),
  
  body('products.*.product')
    .isMongoId()
    .withMessage('ID sản phẩm không hợp lệ'),
  
  body('products.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Số lượng phải là số nguyên dương'),
  
  body('shipping_info.name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên người nhận phải có từ 2-50 ký tự'),
  
  body('shipping_info.address')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Địa chỉ phải có ít nhất 10 ký tự'),
  
  body('shipping_info.phone')
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
  
  body('payment_method')
    .isIn(['vietqr', 'bank_transfer', 'cod'])
    .withMessage('Phương thức thanh toán không hợp lệ'),
  
  handleValidationErrors
];

// Promotion validation
const validatePromotion = [
  body('code')
    .trim()
    .isLength({ min: 3, max: 20 })
    .isAlphanumeric()
    .withMessage('Mã khuyến mãi phải có từ 3-20 ký tự và chỉ chứa chữ cái, số'),
  
  body('discount_type')
    .isIn(['percentage', 'fixed'])
    .withMessage('Loại giảm giá không hợp lệ'),
  
  body('discount_value')
    .isFloat({ min: 0 })
    .withMessage('Giá trị giảm giá phải là số dương'),
  
  body('start_date')
    .isISO8601()
    .withMessage('Ngày bắt đầu không hợp lệ'),
  
  body('end_date')
    .isISO8601()
    .withMessage('Ngày kết thúc không hợp lệ'),
  
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProduct,
  validateOrder,
  validatePromotion,
  handleValidationErrors
};
