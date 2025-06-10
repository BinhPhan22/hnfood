# Hướng dẫn cài đặt HN FOOD

## Yêu cầu hệ thống

- Node.js >= 16.0.0
- npm >= 8.0.0 hoặc yarn >= 1.22.0
- MongoDB (local hoặc MongoDB Atlas)
- Git

## Bước 1: Clone repository

```bash
git clone <repository-url>
cd HNFOOD
```

## Bước 2: Cài đặt Backend

### 2.1 Di chuyển vào thư mục backend
```bash
cd backend
```

### 2.2 Cài đặt dependencies
```bash
npm install
```

### 2.3 Tạo file environment
```bash
cp .env.example .env
```

### 2.4 Cập nhật thông tin trong file .env
Mở file `.env` và cập nhật các thông tin sau:

```env
# Database
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/hnfood

# JWT Secret (tạo một chuỗi ngẫu nhiên dài)
JWT_SECRET=your_super_secret_jwt_key_here

# VietQR (đăng ký tại https://vietqr.io)
VIETQR_API_KEY=your_vietqr_api_key
BANK_ACCOUNT_NUMBER=your_bank_account_number

# Cloudinary (đăng ký tại https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (sử dụng Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 2.5 Chạy server backend
```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:5000

## Bước 3: Cài đặt Frontend

### 3.1 Mở terminal mới và di chuyển vào thư mục frontend
```bash
cd frontend
```

### 3.2 Cài đặt dependencies
```bash
npm install
```

### 3.3 Chạy frontend
```bash
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## Bước 4: Cài đặt Admin Dashboard

### 4.1 Mở terminal mới và di chuyển vào thư mục admin
```bash
cd admin
```

### 4.2 Cài đặt dependencies
```bash
npm install
```

### 4.3 Chạy admin dashboard
```bash
npm start
```

Admin dashboard sẽ chạy tại: http://localhost:3001

## Bước 5: Thiết lập Database

### 5.1 Tạo tài khoản admin đầu tiên
Gửi POST request đến `/api/users/register` với dữ liệu:

```json
{
  "name": "Admin",
  "email": "admin@hnfood.vn",
  "password": "admin123",
  "phone": "0123456789",
  "role": "admin"
}
```

### 5.2 Thêm dữ liệu mẫu (optional)
```bash
cd backend
npm run seed
```

## Bước 6: Cấu hình VietQR

### 6.1 Đăng ký tài khoản VietQR
1. Truy cập https://vietqr.io
2. Đăng ký tài khoản doanh nghiệp
3. Lấy API key và cập nhật vào file .env

### 6.2 Cấu hình ngân hàng
1. Liên hệ ngân hàng để kích hoạt VietQR
2. Cập nhật số tài khoản vào file .env

## Bước 7: Cấu hình Dialogflow (AI Chatbot)

### 7.1 Tạo project Dialogflow
1. Truy cập https://dialogflow.cloud.google.com
2. Tạo project mới
3. Tạo agent với ngôn ngữ tiếng Việt

### 7.2 Cập nhật agent ID
Cập nhật `agent-id` trong file `frontend/public/index.html`

## Bước 8: Cấu hình Email

### 8.1 Tạo App Password cho Gmail
1. Bật 2-Factor Authentication cho Gmail
2. Tạo App Password tại: https://myaccount.google.com/apppasswords
3. Cập nhật vào file .env

## Kiểm tra cài đặt

### Backend API
```bash
curl http://localhost:5000/health
```

### Frontend
Truy cập: http://localhost:3000

### Admin Dashboard
Truy cập: http://localhost:3001

## Troubleshooting

### Lỗi MongoDB connection
- Kiểm tra MONGODB_URI trong file .env
- Đảm bảo IP được whitelist trong MongoDB Atlas

### Lỗi CORS
- Kiểm tra FRONTEND_URL và ADMIN_URL trong file .env
- Đảm bảo ports không bị conflict

### Lỗi VietQR
- Kiểm tra API key và account number
- Đảm bảo tài khoản ngân hàng đã kích hoạt VietQR

### Lỗi Email
- Kiểm tra Gmail App Password
- Đảm bảo 2FA đã được bật

## Scripts hữu ích

### Backend
```bash
npm run dev          # Chạy development server
npm start           # Chạy production server
npm run seed        # Thêm dữ liệu mẫu
npm test           # Chạy tests
```

### Frontend
```bash
npm start          # Chạy development server
npm run build      # Build production
npm test          # Chạy tests
```

### Admin
```bash
npm start          # Chạy development server
npm run build      # Build production
```

## Triển khai Production

### Backend (Heroku/Railway)
1. Tạo app trên Heroku/Railway
2. Cấu hình environment variables
3. Deploy code

### Frontend (Vercel/Netlify)
1. Connect repository
2. Cấu hình build settings
3. Deploy

### Database (MongoDB Atlas)
1. Tạo cluster
2. Cấu hình network access
3. Cập nhật connection string

## Liên hệ hỗ trợ

- Email: support@hnfood.vn
- Phone: 0123456789
- Documentation: https://docs.hnfood.vn
