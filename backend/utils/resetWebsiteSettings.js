const mongoose = require('mongoose');
const dotenv = require('dotenv');
const WebsiteSettings = require('../models/WebsiteSettings');

dotenv.config();

const resetWebsiteSettings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing settings
    await WebsiteSettings.deleteMany({});
    console.log('🗑️ Deleted existing settings');

    // Create new default website settings
    const defaultSettings = {
      site_name: 'HN FOOD',
      site_tagline: 'Thực phẩm sạch cho sức khỏe',
      site_description: 'Cung cấp thực phẩm hữu cơ, sản phẩm chăm sóc sức khỏe chất lượng cao với thanh toán VietQR tiện lợi',
      
      logo_url: '/logo.png',
      favicon_url: '/favicon.ico',
      
      primary_color: '#0ea5e9',
      secondary_color: '#06b6d4',
      accent_color: '#f59e0b',
      
      contact_phone: '0123 456 789',
      contact_email: 'support@hnfood.vn',
      contact_address: '174 CMT8, Biên Hòa, Đồng Nai',
      
      facebook_url: 'https://facebook.com/hnfood',
      instagram_url: 'https://instagram.com/hnfood',
      youtube_url: 'https://youtube.com/hnfood',
      
      hero_title: 'Thực phẩm sạch cho sức khỏe',
      hero_subtitle: 'Cung cấp thực phẩm hữu cơ, sản phẩm chăm sóc sức khỏe chất lượng cao với thanh toán VietQR tiện lợi',
      
      banner_slides: [
        {
          title: 'Thực phẩm hữu cơ cao cấp',
          subtitle: 'Nấm linh chi đỏ nguyên tai - Tăng cường miễn dịch',
          description: 'Sản phẩm được chứng nhận hữu cơ quốc tế, an toàn cho sức khỏe',
          image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1200',
          cta_text: 'Mua ngay',
          cta_link: '/products',
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
          cta_link: '/products',
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
          cta_link: '/products',
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
      ],
      
      total_customers: '10,000+',
      countries_exported: '15+',
      satisfaction_rate: '99.8%',
      support_hours: '24/7',
      
      meta_title: 'HN FOOD - Thực phẩm sạch cho sức khỏe',
      meta_description: 'Cung cấp thực phẩm hữu cơ, sản phẩm chăm sóc sức khỏe chất lượng cao với thanh toán VietQR tiện lợi',
      meta_keywords: 'thực phẩm hữu cơ, nấm linh chi, sản phẩm sạch, VietQR',
      
      footer_about: 'HN FOOD cam kết mang đến những sản phẩm thực phẩm sạch, an toàn và chất lượng cao nhất cho sức khỏe của bạn và gia đình.',
      
      business_hours: {
        weekdays: '8:00 - 18:00',
        weekend: '9:00 - 17:00'
      },
      
      free_shipping_threshold: 200000,
      shipping_fee: 25000,
      wallet_bonus_percentage: 20,
      
      maintenance_mode: false,
      maintenance_message: 'Website đang bảo trì, vui lòng quay lại sau.'
    };

    const settings = await WebsiteSettings.create(defaultSettings);
    
    console.log('✅ Website settings reset successfully');
    console.log('🎨 Banner slides:', settings.banner_slides.length);
    console.log('⭐ Company advantages:', settings.company_advantages.length);
    console.log('💬 Customer reviews:', settings.customer_reviews.length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting website settings:', error);
    process.exit(1);
  }
};

resetWebsiteSettings();
