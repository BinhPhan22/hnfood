const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên sản phẩm'],
    trim: true
  },
  name_en: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá sản phẩm'],
    min: [0, 'Giá không thể âm']
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả sản phẩm']
  },
  description_en: {
    type: String
  },
  images: {
    type: [String],
    required: [true, 'Vui lòng thêm ít nhất một hình ảnh']
  },
  category: {
    type: String,
    required: [true, 'Vui lòng chọn danh mục'],
    enum: ['thuc-pham-huu-co', 'cham-soc-ca-nhan', 'thuc-pham-chuc-nang']
  },
  stock: {
    type: Number,
    required: [true, 'Vui lòng nhập số lượng tồn kho'],
    min: [0, 'Số lượng không thể âm'],
    default: 0
  },
  seo_keywords: {
    type: [String],
    default: []
  },
  slug: {
    type: String,
    unique: true
  },
  is_featured: {
    type: Boolean,
    default: false
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

// Create slug from name
ProductSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      locale: 'vi'
    });
  }

  next();
});

// Virtual for product URL
ProductSchema.virtual('url').get(function() {
  return `/products/${this.slug}`;
});

// Ensure virtual fields are serialised
ProductSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
