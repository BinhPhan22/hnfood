import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>Không tìm thấy trang - HN FOOD</title>
        <meta name="description" content="Trang bạn tìm kiếm không tồn tại" />
      </Helmet>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
            <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.886-6.172-2.343M15 11.25l5.25-5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Không tìm thấy trang
          </h1>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
          </p>

          <div className="space-y-4">
            <Link
              to="/"
              className="btn-primary inline-flex items-center"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Về trang chủ
            </Link>
            
            <div className="text-center">
              <button
                onClick={() => window.history.back()}
                className="btn-outline inline-flex items-center"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Quay lại trang trước
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Có thể bạn đang tìm:
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/products"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sản phẩm
              </Link>
              <Link
                to="/about"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Về chúng tôi
              </Link>
              <Link
                to="/contact"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Liên hệ
              </Link>
              <Link
                to="/cart"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Giỏ hàng
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(e.target.value.trim())}`;
                  }
                }}
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-12 p-6 bg-primary-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cần hỗ trợ?
            </h3>
            <p className="text-gray-600 mb-4">
              Nếu bạn gặp khó khăn, đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="btn-primary text-sm"
              >
                Liên hệ hỗ trợ
              </Link>
              <a
                href="tel:0123456789"
                className="btn-outline text-sm"
              >
                Gọi: 0123 456 789
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
