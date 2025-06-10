#!/bin/bash

echo "🚀 Thiết lập cấu trúc thư mục HN FOOD..."

# Tạo cấu trúc thư mục backend
echo "📁 Tạo cấu trúc backend..."
mkdir -p backend/{config,controllers,middleware,models,routes,services,utils,uploads}

# Tạo cấu trúc thư mục frontend
echo "📁 Tạo cấu trúc frontend..."
mkdir -p frontend/src/{components/{common,layout,product,cart,checkout,admin},pages,hooks,services,store,utils,styles}
mkdir -p frontend/public

# Tạo cấu trúc thư mục admin
echo "📁 Tạo cấu trúc admin..."
mkdir -p admin/src/{components,pages,services,store}
mkdir -p admin/public

# Tạo thư mục docs
echo "📁 Tạo thư mục docs..."
mkdir -p docs

# Tạo các file .gitkeep để giữ thư mục trống
echo "📄 Tạo file .gitkeep..."
find . -type d -empty -exec touch {}/.gitkeep \;

# Tạo file .gitignore
echo "📄 Tạo file .gitignore..."
cat > .gitignore << EOL
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/backend/dist
/frontend/build
/admin/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Uploads
/backend/uploads/*
!/backend/uploads/.gitkeep

# Temporary files
tmp/
temp/
EOL

echo "✅ Cấu trúc thư mục đã được tạo thành công!"
echo ""
echo "📋 Các bước tiếp theo:"
echo "1. cd backend && npm install"
echo "2. cp .env.example .env && cập nhật thông tin trong .env"
echo "3. npm run dev (chạy backend)"
echo "4. Mở terminal mới: cd frontend && npm install && npm start"
echo "5. Mở terminal mới: cd admin && npm install && npm start"
echo ""
echo "📖 Xem file INSTALLATION.md để biết hướng dẫn chi tiết"
