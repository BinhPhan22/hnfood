const express = require('express');
const router = express.Router();
const WebsiteSettings = require('../models/WebsiteSettings');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get website settings
// @route   GET /api/website-settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get website settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy cài đặt website'
    });
  }
});

// @desc    Update website settings
// @route   PUT /api/website-settings
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
  try {
    const settings = await WebsiteSettings.updateSettings(req.body);
    res.json({
      success: true,
      data: settings,
      message: 'Cập nhật cài đặt website thành công'
    });
  } catch (error) {
    console.error('Update website settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật cài đặt website'
    });
  }
});

// @desc    Add banner slide
// @route   POST /api/website-settings/banner-slides
// @access  Private/Admin
router.post('/banner-slides', protect, admin, async (req, res) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    settings.banner_slides.push(req.body);
    await settings.save();
    
    res.json({
      success: true,
      data: settings.banner_slides,
      message: 'Thêm banner slide thành công'
    });
  } catch (error) {
    console.error('Add banner slide error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm banner slide'
    });
  }
});

// @desc    Update banner slide
// @route   PUT /api/website-settings/banner-slides/:id
// @access  Private/Admin
router.put('/banner-slides/:id', protect, admin, async (req, res) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    const slide = settings.banner_slides.id(req.params.id);
    
    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy banner slide'
      });
    }
    
    Object.assign(slide, req.body);
    await settings.save();
    
    res.json({
      success: true,
      data: slide,
      message: 'Cập nhật banner slide thành công'
    });
  } catch (error) {
    console.error('Update banner slide error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật banner slide'
    });
  }
});

// @desc    Delete banner slide
// @route   DELETE /api/website-settings/banner-slides/:id
// @access  Private/Admin
router.delete('/banner-slides/:id', protect, admin, async (req, res) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    settings.banner_slides.id(req.params.id).remove();
    await settings.save();
    
    res.json({
      success: true,
      message: 'Xóa banner slide thành công'
    });
  } catch (error) {
    console.error('Delete banner slide error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa banner slide'
    });
  }
});

// @desc    Add company advantage
// @route   POST /api/website-settings/company-advantages
// @access  Private/Admin
router.post('/company-advantages', protect, admin, async (req, res) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    settings.company_advantages.push(req.body);
    await settings.save();
    
    res.json({
      success: true,
      data: settings.company_advantages,
      message: 'Thêm ưu điểm công ty thành công'
    });
  } catch (error) {
    console.error('Add company advantage error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm ưu điểm công ty'
    });
  }
});

// @desc    Update company advantage
// @route   PUT /api/website-settings/company-advantages/:id
// @access  Private/Admin
router.put('/company-advantages/:id', protect, admin, async (req, res) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    const advantage = settings.company_advantages.id(req.params.id);
    
    if (!advantage) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ưu điểm công ty'
      });
    }
    
    Object.assign(advantage, req.body);
    await settings.save();
    
    res.json({
      success: true,
      data: advantage,
      message: 'Cập nhật ưu điểm công ty thành công'
    });
  } catch (error) {
    console.error('Update company advantage error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật ưu điểm công ty'
    });
  }
});

// @desc    Delete company advantage
// @route   DELETE /api/website-settings/company-advantages/:id
// @access  Private/Admin
router.delete('/company-advantages/:id', protect, admin, async (req, res) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    settings.company_advantages.id(req.params.id).remove();
    await settings.save();
    
    res.json({
      success: true,
      message: 'Xóa ưu điểm công ty thành công'
    });
  } catch (error) {
    console.error('Delete company advantage error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa ưu điểm công ty'
    });
  }
});

// @desc    Add customer review
// @route   POST /api/website-settings/customer-reviews
// @access  Private/Admin
router.post('/customer-reviews', protect, admin, async (req, res) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    settings.customer_reviews.push(req.body);
    await settings.save();
    
    res.json({
      success: true,
      data: settings.customer_reviews,
      message: 'Thêm đánh giá khách hàng thành công'
    });
  } catch (error) {
    console.error('Add customer review error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm đánh giá khách hàng'
    });
  }
});

// @desc    Update customer review
// @route   PUT /api/website-settings/customer-reviews/:id
// @access  Private/Admin
router.put('/customer-reviews/:id', protect, admin, async (req, res) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    const review = settings.customer_reviews.id(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá khách hàng'
      });
    }
    
    Object.assign(review, req.body);
    await settings.save();
    
    res.json({
      success: true,
      data: review,
      message: 'Cập nhật đánh giá khách hàng thành công'
    });
  } catch (error) {
    console.error('Update customer review error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật đánh giá khách hàng'
    });
  }
});

// @desc    Delete customer review
// @route   DELETE /api/website-settings/customer-reviews/:id
// @access  Private/Admin
router.delete('/customer-reviews/:id', protect, admin, async (req, res) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    settings.customer_reviews.id(req.params.id).remove();
    await settings.save();
    
    res.json({
      success: true,
      message: 'Xóa đánh giá khách hàng thành công'
    });
  } catch (error) {
    console.error('Delete customer review error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa đánh giá khách hàng'
    });
  }
});

// @desc    Initialize default settings
// @route   POST /api/website-settings/initialize
// @access  Private/Admin
router.post('/initialize', protect, admin, async (req, res) => {
  try {
    const defaultSettings = {
      banner_slides: [
        {
          title: 'Thực phẩm hữu cơ cao cấp',
          subtitle: 'Nấm linh chi đỏ nguyên tai - Tăng cường miễn dịch',
          description: 'Sản phẩm được chứng nhận hữu cơ quốc tế, an toàn cho sức khỏe',
          image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1200',
          cta_text: 'Mua ngay',
          cta_link: '/products/nam-linh-chi-do-nguyen-tai',
          badge: 'Giảm 20%',
          is_active: true,
          order: 1
        },
        {
          title: 'Sản phẩm chăm sóc sức khỏe',
          subtitle: 'Gel rửa tay khô tinh dầu tràm trà',
          description: 'Diệt khuẩn 99.9%, dưỡng ẩm tự nhiên từ tinh dầu tràm trà',
          image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200',
          cta_text: 'Khám phá',
          cta_link: '/products/gel-rua-tay-kho-tinh-dau-tram-tra',
          badge: 'Bán chạy #1',
          is_active: true,
          order: 2
        },
        {
          title: 'Sản phẩm lau dọn nhà',
          subtitle: 'Nước lau sàn hữu cơ Lavender',
          description: 'An toàn cho trẻ em và thú cưng, hương thơm dễ chịu',
          image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200',
          cta_text: 'Xem thêm',
          cta_link: '/products/nuoc-lau-san-huu-co-lavender',
          badge: 'Mới',
          is_active: true,
          order: 3
        }
      ],
      company_advantages: [
        {
          title: 'Chứng nhận chất lượng',
          description: 'ISO 22000, HACCP, FDA - Đảm bảo an toàn thực phẩm',
          icon: 'CheckBadgeIcon',
          color: 'text-green-600',
          bg_color: 'bg-green-100',
          is_active: true,
          order: 1
        },
        {
          title: 'Lưu hành đa quốc gia',
          description: 'Xuất khẩu sang 15+ quốc gia trên thế giới',
          icon: 'GlobeAltIcon',
          color: 'text-blue-600',
          bg_color: 'bg-blue-100',
          is_active: true,
          order: 2
        },
        {
          title: 'Sản phẩm chất lượng cao',
          description: '100% nguyên liệu tự nhiên, không chất bảo quản',
          icon: 'ShieldCheckIcon',
          color: 'text-purple-600',
          bg_color: 'bg-purple-100',
          is_active: true,
          order: 3
        },
        {
          title: 'Giao hàng toàn quốc',
          description: 'Miễn phí vận chuyển đơn hàng từ 200,000 VND',
          icon: 'TruckIcon',
          color: 'text-orange-600',
          bg_color: 'bg-orange-100',
          is_active: true,
          order: 4
        }
      ],
      customer_reviews: [
        {
          name: 'Nguyễn Thị Mai',
          location: 'TP. Hồ Chí Minh',
          rating: 5,
          comment: 'Sản phẩm nấm linh chi rất chất lượng, tôi đã sử dụng được 3 tháng và cảm thấy sức khỏe tốt hơn rất nhiều. Giao hàng nhanh, đóng gói cẩn thận.',
          product: 'Nấm linh chi đỏ nguyên tai',
          avatar: 'https://ui-avatars.com/api/?name=Nguyen+Thi+Mai&background=0ea5e9&color=fff',
          is_active: true,
          order: 1
        },
        {
          name: 'Trần Văn Hùng',
          location: 'Hà Nội',
          rating: 5,
          comment: 'Gel rửa tay khô rất thơm và không làm khô da. Cả gia đình tôi đều sử dụng, đặc biệt an tâm cho các bé. Sẽ tiếp tục ủng hộ HN FOOD.',
          product: 'Gel rửa tay khô tinh dầu tràm trà',
          avatar: 'https://ui-avatars.com/api/?name=Tran+Van+Hung&background=10b981&color=fff',
          is_active: true,
          order: 2
        },
        {
          name: 'Lê Thị Hoa',
          location: 'Đà Nẵng',
          rating: 5,
          comment: 'Nước lau sàn Lavender có mùi hương rất dễ chịu, lau sạch và không để lại vệt. Quan trọng là an toàn cho con tôi. Chất lượng tuyệt vời!',
          product: 'Nước lau sàn hữu cơ Lavender',
          avatar: 'https://ui-avatars.com/api/?name=Le+Thi+Hoa&background=f59e0b&color=fff',
          is_active: true,
          order: 3
        },
        {
          name: 'Phạm Minh Tuấn',
          location: 'Cần Thơ',
          rating: 5,
          comment: 'Dịch vụ chăm sóc khách hàng rất tốt, sản phẩm chất lượng cao. Tôi đã giới thiệu cho nhiều bạn bè và họ đều hài lòng. Cảm ơn HN FOOD!',
          product: 'Viên nang linh chi cô đặc',
          avatar: 'https://ui-avatars.com/api/?name=Pham+Minh+Tuan&background=8b5cf6&color=fff',
          is_active: true,
          order: 4
        }
      ]
    };

    const settings = await WebsiteSettings.updateSettings(defaultSettings);
    
    res.json({
      success: true,
      data: settings,
      message: 'Khởi tạo cài đặt mặc định thành công'
    });
  } catch (error) {
    console.error('Initialize settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi khởi tạo cài đặt'
    });
  }
});

module.exports = router;
