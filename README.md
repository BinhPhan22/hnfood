# HN FOOD - Website Bán Hàng với VietQR

## Cấu trúc dự án

```
HNFOOD/
├── backend/                    # Server Node.js + Express
│   ├── config/                # Cấu hình database, cloudinary
│   ├── controllers/           # Logic xử lý API
│   ├── middleware/            # Middleware xác thực, validation
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── services/             # Business logic services
│   ├── utils/                # Utility functions
│   ├── uploads/              # Thư mục upload tạm
│   ├── .env                  # Environment variables
│   ├── package.json          # Dependencies
│   └── server.js             # Entry point
│
├── frontend/                  # React.js application
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── common/       # Shared components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── product/      # Product components
│   │   │   ├── cart/         # Cart components
│   │   │   ├── checkout/     # Checkout components
│   │   │   └── admin/        # Admin components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API services
│   │   ├── store/            # Redux store
│   │   ├── utils/            # Utility functions
│   │   ├── styles/           # CSS/Tailwind styles
│   │   ├── App.js            # Main App component
│   │   └── index.js          # Entry point
│   ├── package.json          # Dependencies
│   └── tailwind.config.js    # Tailwind configuration
│
├── admin/                     # Admin dashboard (React)
│   ├── src/
│   │   ├── components/       # Admin components
│   │   ├── pages/            # Admin pages
│   │   ├── services/         # API services
│   │   └── store/            # Redux store
│   └── package.json
│
├── docs/                      # Documentation
│   ├── api.md               # API documentation
│   ├── deployment.md        # Deployment guide
│   └── features.md          # Features documentation
│
└── README.md                 # Project overview
```

## Công nghệ sử dụng

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- VietQR API Integration
- Cloudinary (Image storage)
- Nodemailer (Email service)

### Frontend
- React.js 18
- Redux Toolkit
- React Router v6
- Tailwind CSS
- Axios
- React Helmet (SEO)

### Thanh toán
- VietQR (QR Code banking)
- COD (Cash on Delivery)
- Bank Transfer

## Tính năng chính

### Website bán hàng
- ✅ Hiển thị sản phẩm với tìm kiếm, lọc
- ✅ Giỏ hàng và thanh toán
- ✅ Đăng ký/đăng nhập thành viên
- ✅ Ví điện tử và điểm tích lũy
- ✅ Thanh toán VietQR
- ✅ AI Chatbot hỗ trợ
- ✅ Responsive design

### Trang quản trị
- ✅ Quản lý sản phẩm
- ✅ Quản lý đơn hàng
- ✅ Quản lý khách hàng
- ✅ Quản lý khuyến mãi
- ✅ Báo cáo doanh thu
- ✅ Cấu hình VietQR

## Hướng dẫn cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd HNFOOD
```

### 2. Cài đặt Backend
```bash
cd backend
npm install
cp .env.example .env
# Cập nhật thông tin trong .env
npm run dev
```

### 3. Cài đặt Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Cài đặt Admin Dashboard
```bash
cd admin
npm install
npm start
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hnfood
JWT_SECRET=your_jwt_secret_key
VIETQR_API_KEY=your_vietqr_api_key
BANK_ACCOUNT_NUMBER=your_bank_account
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## API Endpoints

### Authentication
- POST `/api/users/register` - Đăng ký
- POST `/api/users/login` - Đăng nhập
- GET `/api/users/profile` - Thông tin user

### Products
- GET `/api/products` - Danh sách sản phẩm
- GET `/api/products/:id` - Chi tiết sản phẩm
- POST `/api/products` - Tạo sản phẩm (Admin)

### Orders
- POST `/api/orders` - Tạo đơn hàng
- GET `/api/orders` - Danh sách đơn hàng
- GET `/api/orders/:id` - Chi tiết đơn hàng

### VietQR
- POST `/api/vietqr/generate` - Tạo mã QR
- POST `/api/vietqr/topup` - Nạp tiền ví
- POST `/webhook/vietqr` - Webhook xác nhận

## Triển khai

### Production
- Backend: Heroku/Railway
- Frontend: Vercel/Netlify
- Database: MongoDB Atlas
- Images: Cloudinary

### Development
```bash
# Chạy backend
cd backend && npm run dev

# Chạy frontend
cd frontend && npm start

# Chạy admin
cd admin && npm start
```

## Liên hệ

- Email: support@hnfood.vn
- Phone: 0123456789
- Address: 174 CMT8, Biên Hòa, Đồng Nai
