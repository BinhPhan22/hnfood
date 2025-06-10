#!/bin/bash

echo "🚀 Cài đặt Node.js cho dự án HN FOOD..."

# Kiểm tra xem Node.js đã được cài đặt chưa
if command -v node &> /dev/null; then
    echo "✅ Node.js đã được cài đặt: $(node --version)"
    echo "✅ npm đã được cài đặt: $(npm --version)"
    exit 0
fi

# Kiểm tra hệ điều hành
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGw;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo "🖥️  Hệ điều hành: $MACHINE"

if [[ "$MACHINE" == "Mac" ]]; then
    echo "📦 Cài đặt trên macOS..."
    
    # Kiểm tra xem Homebrew đã được cài đặt chưa
    if ! command -v brew &> /dev/null; then
        echo "🍺 Cài đặt Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Thêm Homebrew vào PATH cho Apple Silicon
        if [[ $(uname -m) == 'arm64' ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/opt/homebrew/bin/brew shellenv)"
        else
            echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/usr/local/bin/brew shellenv)"
        fi
    else
        echo "✅ Homebrew đã được cài đặt"
    fi
    
    # Cài đặt Node.js
    echo "📦 Cài đặt Node.js..."
    brew install node
    
elif [[ "$MACHINE" == "Linux" ]]; then
    echo "🐧 Cài đặt trên Linux..."
    
    # Kiểm tra distro
    if command -v apt-get &> /dev/null; then
        # Ubuntu/Debian
        echo "📦 Cài đặt trên Ubuntu/Debian..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        echo "📦 Cài đặt trên CentOS/RHEL..."
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo yum install -y nodejs
    else
        echo "❌ Không thể xác định package manager"
        echo "Vui lòng cài đặt Node.js thủ công từ: https://nodejs.org/"
        exit 1
    fi
    
else
    echo "❌ Hệ điều hành không được hỗ trợ: $MACHINE"
    echo ""
    echo "📖 Hướng dẫn cài đặt thủ công:"
    echo "1. Truy cập: https://nodejs.org/"
    echo "2. Tải phiên bản LTS (khuyến nghị)"
    echo "3. Cài đặt theo hướng dẫn"
    echo "4. Khởi động lại terminal"
    echo "5. Chạy lại script này để kiểm tra"
    exit 1
fi

# Kiểm tra cài đặt
echo ""
echo "🔍 Kiểm tra cài đặt..."
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
    echo "✅ npm: $(npm --version)"
    echo ""
    echo "🎉 Cài đặt thành công!"
    echo ""
    echo "📋 Các bước tiếp theo:"
    echo "1. cd backend"
    echo "2. npm install"
    echo "3. cp .env.example .env"
    echo "4. Cập nhật thông tin trong file .env"
    echo "5. npm run dev"
else
    echo "❌ Cài đặt thất bại"
    echo "Vui lòng cài đặt Node.js thủ công từ: https://nodejs.org/"
    exit 1
fi
