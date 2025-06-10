// MongoDB Schemas

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String], // Cloudinary URLs
  description: String,
  category: String,
  stock: Number,
  seo_keywords: [String],
  created_at: { type: Date, default: Date.now }
});

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String, // Hashed with bcrypt
  address: String,
  phone: String,
  birthday: Date,
  wallet_balance: { type: Number, default: 0 },
  loyalty_points: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

// Order Schema
const OrderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{ 
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
    quantity: Number 
  }],
  total_amount: Number,
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  payment_method: { type: String, enum: ['vietqr', 'bank_transfer', 'cod'] },
  shipping_info: { 
    name: String, 
    address: String, 
    phone: String 
  },
  vietqr_transaction_id: String,
  created_at: { type: Date, default: Date.now }
});