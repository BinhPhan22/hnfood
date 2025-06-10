const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const sampleProducts = [
  // Sản phẩm lau dọn nhà
  {
    name: 'Nước lau sàn hữu cơ Lavender',
    price: 85000,
    description: 'Nước lau sàn từ tinh dầu lavender tự nhiên, an toàn cho trẻ em và thú cưng. Khử mùi hiệu quả, để lại hương thơm dễ chịu.',
    images: [
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800'
    ],
    category: 'cham-soc-ca-nhan',
    stock: 50,
    seo_keywords: ['nước lau sàn', 'lavender', 'hữu cơ', 'an toàn'],
    is_featured: true,
    is_active: true
  },
  {
    name: 'Bộ khăn lau đa năng tre bamboo',
    price: 120000,
    description: 'Bộ 5 khăn lau từ sợi tre bamboo tự nhiên, kháng khuẩn, thấm hút tốt. Có thể giặt máy và tái sử dụng nhiều lần.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800'
    ],
    category: 'cham-soc-ca-nhan',
    stock: 30,
    seo_keywords: ['khăn lau', 'bamboo', 'tre', 'kháng khuẩn'],
    is_featured: false,
    is_active: true
  },
  {
    name: 'Nước tẩy rửa cửa kính sinh học',
    price: 65000,
    description: 'Nước tẩy rửa cửa kính từ enzyme sinh học, không chứa hóa chất độc hại. Làm sạch vết bẩn cứng đầu, không để lại vệt.',
    images: [
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800',
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800'
    ],
    category: 'cham-soc-ca-nhan',
    stock: 40,
    seo_keywords: ['tẩy rửa cửa', 'sinh học', 'enzyme', 'không độc hại'],
    is_featured: true,
    is_active: true
  },

  // Sản phẩm sát khuẩn tay
  {
    name: 'Gel rửa tay khô tinh dầu tràm trà',
    price: 45000,
    description: 'Gel rửa tay khô với 70% cồn y tế và tinh dầu tràm trà. Diệt khuẩn 99.9%, dưỡng ẩm cho da tay.',
    images: [
      'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
      'https://images.unsplash.com/photo-1585435557343-3b092031d4cc?w=800'
    ],
    category: 'cham-soc-ca-nhan',
    stock: 100,
    seo_keywords: ['gel rửa tay', 'tràm trà', 'sát khuẩn', 'dưỡng ẩm'],
    is_featured: true,
    is_active: true
  },
  {
    name: 'Xịt sát khuẩn tay hương bạc hà',
    price: 35000,
    description: 'Xịt sát khuẩn tay dạng phun sương với hương bạc hà tự nhiên. Khô nhanh, không dính tay, tiện lợi mang theo.',
    images: [
      'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
      'https://images.unsplash.com/photo-1585435557343-3b092031d4cc?w=800'
    ],
    category: 'cham-soc-ca-nhan',
    stock: 80,
    seo_keywords: ['xịt sát khuẩn', 'bạc hà', 'phun sương', 'tiện lợi'],
    is_featured: false,
    is_active: true
  },

  // Nấm rơm
  {
    name: 'Nấm rơm tươi hữu cơ',
    price: 25000,
    description: 'Nấm rơm tươi được trồng theo phương pháp hữu cơ, không sử dụng thuốc trừ sâu. Giàu protein và vitamin.',
    images: [
      'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800'
    ],
    category: 'thuc-pham-huu-co',
    stock: 20,
    seo_keywords: ['nấm rơm', 'hữu cơ', 'tươi', 'protein'],
    is_featured: true,
    is_active: true
  },
  {
    name: 'Nấm rơm khô cao cấp',
    price: 180000,
    description: 'Nấm rơm khô được sấy bằng công nghệ hiện đại, giữ nguyên dinh dưỡng. Bảo quản lâu dài, tiện lợi sử dụng.',
    images: [
      'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800'
    ],
    category: 'thuc-pham-huu-co',
    stock: 15,
    seo_keywords: ['nấm rơm khô', 'cao cấp', 'bảo quản lâu', 'dinh dưỡng'],
    is_featured: false,
    is_active: true
  },

  // Nấm mối đen
  {
    name: 'Nấm mối đen tươi Đà Lạt',
    price: 120000,
    description: 'Nấm mối đen tươi từ Đà Lạt, có vị ngọt tự nhiên và giàu chất chống oxy hóa. Tốt cho sức khỏe tim mạch.',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',
      'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800'
    ],
    category: 'thuc-pham-huu-co',
    stock: 25,
    seo_keywords: ['nấm mối đen', 'Đà Lạt', 'chống oxy hóa', 'tim mạch'],
    is_featured: true,
    is_active: true
  },
  {
    name: 'Nấm mối đen sấy khô nguyên chất',
    price: 350000,
    description: 'Nấm mối đen sấy khô 100% nguyên chất, không pha trộn. Giữ nguyên hương vị và dưỡng chất quý giá.',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',
      'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800'
    ],
    category: 'thuc-pham-huu-co',
    stock: 10,
    seo_keywords: ['nấm mối đen khô', 'nguyên chất', 'dưỡng chất', 'cao cấp'],
    is_featured: false,
    is_active: true
  },

  // Nấm linh chi
  {
    name: 'Nấm linh chi đỏ nguyên tai',
    price: 450000,
    description: 'Nấm linh chi đỏ nguyên tai cao cấp, được trồng trong môi trường sạch. Tăng cường miễn dịch, chống lão hóa.',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',
      'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800'
    ],
    category: 'thuc-pham-chuc-nang',
    stock: 8,
    seo_keywords: ['nấm linh chi', 'đỏ', 'miễn dịch', 'chống lão hóa'],
    is_featured: true,
    is_active: true
  },
  {
    name: 'Bột nấm linh chi hữu cơ',
    price: 280000,
    description: 'Bột nấm linh chi được nghiền từ nấm linh chi hữu cơ 100%. Dễ hấp thụ, tiện lợi pha uống hàng ngày.',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',
      'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800'
    ],
    category: 'thuc-pham-chuc-nang',
    stock: 12,
    seo_keywords: ['bột linh chi', 'hữu cơ', 'dễ hấp thụ', 'pha uống'],
    is_featured: false,
    is_active: true
  },
  {
    name: 'Viên nang linh chi cô đặc',
    price: 520000,
    description: 'Viên nang linh chi cô đặc với hàm lượng hoạt chất cao. Hỗ trợ giấc ngủ, giảm stress, tăng cường sức khỏe.',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',
      'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800'
    ],
    category: 'thuc-pham-chuc-nang',
    stock: 15,
    seo_keywords: ['viên nang linh chi', 'cô đặc', 'giấc ngủ', 'giảm stress'],
    is_featured: true,
    is_active: true
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany();
    console.log('🗑️  Cleared existing products');

    // Add slug to each product
    const productsWithSlug = sampleProducts.map(product => ({
      ...product,
      slug: slugify(product.name, {
        lower: true,
        strict: true,
        locale: 'vi'
      })
    }));

    // Insert sample products
    const createdProducts = await Product.insertMany(productsWithSlug);
    console.log(`✅ ${createdProducts.length} sample products imported`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@hnfood.vn' });
    
    if (!adminExists) {
      const adminUser = await User.create({
        name: 'Admin HN FOOD',
        email: 'admin@hnfood.vn',
        password: 'admin123456',
        phone: '0123456789',
        role: 'admin',
        address: '174 CMT8, Biên Hòa, Đồng Nai'
      });
      console.log('✅ Admin user created:', adminUser.email);
    } else {
      console.log('✅ Admin user already exists');
    }

    console.log('🎉 Data import completed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️  Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
