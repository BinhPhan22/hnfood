const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Promotion = require('../models/Promotion');
const SystemSettings = require('../models/SystemSettings');
const PointsService = require('../services/pointsService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const {
      products,
      shipping_info,
      payment_method,
      promotion_code,
      use_points = false
    } = req.body;
    
    // Get system settings
    const settings = await SystemSettings.getSettings();

    // Validate products and calculate subtotal
    let subtotal = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product || !product.is_active) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${item.product} không tồn tại hoặc đã ngừng bán`
        });
      }

      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${product.name} không đủ số lượng trong kho`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    // Apply promotion if provided
    let discount_amount = 0;
    if (promotion_code) {
      const promotion = await Promotion.findOne({ code: promotion_code.toUpperCase() });

      if (promotion && promotion.isValid()) {
        discount_amount = promotion.calculateDiscount(subtotal);

        if (discount_amount > 0) {
          // Update promotion usage
          promotion.current_uses += 1;
          await promotion.save();
        }
      }
    }

    // Calculate shipping fee
    const discounted_subtotal = subtotal - discount_amount;
    let shipping_fee = 0;

    if (discounted_subtotal < settings.free_shipping_threshold) {
      shipping_fee = settings.shipping_fee;
    }

    const total_amount = discounted_subtotal + shipping_fee;

    // Handle points payment
    let points_used = 0;
    let points_value = 0;

    if (use_points && payment_method === 'points') {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Cần đăng nhập để thanh toán bằng điểm'
        });
      }

      const affordability = await PointsService.canAffordWithPoints(req.user._id, total_amount);

      if (!affordability.canAfford) {
        return res.status(400).json({
          success: false,
          message: `Không đủ điểm. Cần ${affordability.pointsNeeded} điểm, có ${affordability.pointsAvailable} điểm`
        });
      }

      points_used = affordability.pointsNeeded;
      points_value = total_amount;
    }
    
    // Create order
    const orderData = {
      products: orderProducts,
      shipping_info,
      subtotal,
      shipping_fee,
      total_amount,
      payment_method,
      promotion_code: promotion_code || null,
      discount_amount,
      points_used,
      points_value
    };
    
    // Add user if authenticated
    if (req.user) {
      orderData.user = req.user.id;
    }
    
    const order = await Order.create(orderData);

    // Deduct points if using points payment
    if (use_points && payment_method === 'points') {
      const pointsResult = await PointsService.deductPointsForPurchase(
        req.user._id,
        total_amount,
        order._id
      );

      if (!pointsResult.success) {
        // Rollback order creation
        await Order.findByIdAndDelete(order._id);
        return res.status(400).json({
          success: false,
          message: pointsResult.error
        });
      }
    }

    // Update product stock
    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock_quantity: -item.quantity } }
      );
    }
    
    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('products.product', 'name price images')
      .populate('user', 'name email phone');
    
    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product', 'name price images')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments({ user: req.user.id });
    
    res.json({
      success: true,
      data: {
        orders,
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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.product', 'name price images')
      .populate('user', 'name email phone');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    // Check if user owns this order (unless admin)
    if (req.user.role !== 'admin' && order.user && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập đơn hàng này'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_status, payment_status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    if (order_status) {
      order.order_status = order_status;
    }
    
    if (payment_status) {
      order.payment_status = payment_status;
      
      // If payment is confirmed and user exists, add loyalty points
      if (payment_status === 'paid' && order.user) {
        const user = await User.findById(order.user);
        if (user) {
          const pointsToAdd = Math.floor(order.total_amount / 1000);
          user.loyalty_points += pointsToAdd;
          await user.save();
        }
      }
    }
    
    await order.save();
    
    const updatedOrder = await Order.findById(order._id)
      .populate('products.product', 'name price images')
      .populate('user', 'name email phone');
    
    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    // Check if user owns this order
    if (order.user && order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền hủy đơn hàng này'
      });
    }
    
    // Can only cancel pending orders
    if (order.order_status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể hủy đơn hàng đang chờ xử lý'
      });
    }
    
    order.order_status = 'cancelled';
    await order.save();
    
    // Restore product stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }
    
    res.json({
      success: true,
      message: 'Đơn hàng đã được hủy thành công'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};
