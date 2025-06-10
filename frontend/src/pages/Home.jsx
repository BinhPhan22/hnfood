import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getFeaturedProducts } from '../store/slices/productSlice';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  TruckIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, isLoading } = useSelector((state) => state.products);
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerSlides = [
    {
      id: 1,
      title: 'Thực phẩm hữu cơ cao cấp',
      subtitle: 'Nấm linh chi đỏ nguyên tai - Tăng cường miễn dịch',
      description: 'Sản phẩm được chứng nhận hữu cơ quốc tế, an toàn cho sức khỏe',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1200',
      cta: 'Mua ngay',
      link: '/products/nam-linh-chi-do-nguyen-tai',
      badge: 'Giảm 20%'
    },
    {
      id: 2,
      title: 'Sản phẩm chăm sóc sức khỏe',
      subtitle: 'Gel rửa tay khô tinh dầu tràm trà',
      description: 'Diệt khuẩn 99.9%, dưỡng ẩm tự nhiên từ tinh dầu tràm trà',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200',
      cta: 'Khám phá',
      link: '/products/gel-rua-tay-kho-tinh-dau-tram-tra',
      badge: 'Bán chạy #1'
    },
    {
      id: 3,
      title: 'Sản phẩm lau dọn nhà',
      subtitle: 'Nước lau sàn hữu cơ Lavender',
      description: 'An toàn cho trẻ em và thú cưng, hương thơm dễ chịu',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200',
      cta: 'Xem thêm',
      link: '/products/nuoc-lau-san-huu-co-lavender',
      badge: 'Mới'
    }
  ];

  const companyAdvantages = [
    {
      icon: CheckBadgeIcon,
      title: 'Chứng nhận chất lượng',
      description: 'ISO 22000, HACCP, FDA - Đảm bảo an toàn thực phẩm',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: GlobeAltIcon,
      title: 'Lưu hành đa quốc gia',
      description: 'Xuất khẩu sang 15+ quốc gia trên thế giới',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Sản phẩm chất lượng cao',
      description: '100% nguyên liệu tự nhiên, không chất bảo quản',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: TruckIcon,
      title: 'Giao hàng toàn quốc',
      description: 'Miễn phí vận chuyển đơn hàng từ 200,000 VND',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const customerReviews = [
    {
      id: 1,
      name: 'Nguyễn Thị Mai',
      location: 'TP. Hồ Chí Minh',
      rating: 5,
      comment: 'Sản phẩm nấm linh chi rất chất lượng, tôi đã sử dụng được 3 tháng và cảm thấy sức khỏe tốt hơn rất nhiều. Giao hàng nhanh, đóng gói cẩn thận.',
      product: 'Nấm linh chi đỏ nguyên tai',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Thi+Mai&background=0ea5e9&color=fff'
    },
    {
      id: 2,
      name: 'Trần Văn Hùng',
      location: 'Hà Nội',
      rating: 5,
      comment: 'Gel rửa tay khô rất thơm và không làm khô da. Cả gia đình tôi đều sử dụng, đặc biệt an tâm cho các bé. Sẽ tiếp tục ủng hộ HN FOOD.',
      product: 'Gel rửa tay khô tinh dầu tràm trà',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Van+Hung&background=10b981&color=fff'
    },
    {
      id: 3,
      name: 'Lê Thị Hoa',
      location: 'Đà Nẵng',
      rating: 5,
      comment: 'Nước lau sàn Lavender có mùi hương rất dễ chịu, lau sạch và không để lại vệt. Quan trọng là an toàn cho con tôi. Chất lượng tuyệt vời!',
      product: 'Nước lau sàn hữu cơ Lavender',
      avatar: 'https://ui-avatars.com/api/?name=Le+Thi+Hoa&background=f59e0b&color=fff'
    },
    {
      id: 4,
      name: 'Phạm Minh Tuấn',
      location: 'Cần Thơ',
      rating: 5,
      comment: 'Dịch vụ chăm sóc khách hàng rất tốt, sản phẩm chất lượng cao. Tôi đã giới thiệu cho nhiều bạn bè và họ đều hài lòng. Cảm ơn HN FOOD!',
      product: 'Viên nang linh chi cô đặc',
      avatar: 'https://ui-avatars.com/api/?name=Pham+Minh+Tuan&background=8b5cf6&color=fff'
    }
  ];

  useEffect(() => {
    dispatch(getFeaturedProducts(8));
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIconSolid
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div>
      <Helmet>
        <title>HN FOOD - Trang chủ</title>
        <meta name="description" content="Thực phẩm sạch, sản phẩm chăm sóc sức khỏe chất lượng cao với thanh toán VietQR tiện lợi" />
      </Helmet>

      {/* Hero Banner Slider */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl text-white">
                      {slide.badge && (
                        <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                          {slide.badge}
                        </span>
                      )}
                      <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        {slide.title}
                      </h1>
                      <h2 className="text-xl md:text-2xl mb-4 text-yellow-300">
                        {slide.subtitle}
                      </h2>
                      <p className="text-lg md:text-xl mb-8 opacity-90">
                        {slide.description}
                      </p>
                      <Link
                        to={slide.link}
                        className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-lg"
                      >
                        {slide.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Company Advantages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ưu điểm vượt trội của HN FOOD
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi tự hào là đơn vị tiên phong trong lĩnh vực thực phẩm sạch và chăm sóc sức khỏe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyAdvantages.map((advantage, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className={`w-20 h-20 ${advantage.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all`}>
                  <advantage.icon className={`w-10 h-10 ${advantage.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{advantage.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Chứng nhận chất lượng</h3>
              <p className="text-gray-600">Được công nhận bởi các tổ chức uy tín trong và ngoài nước</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['ISO 22000', 'HACCP', 'FDA', 'ORGANIC'].map((cert, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-2">
                    <CheckBadgeIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="font-semibold text-gray-900">{cert}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-gray-600">
              Những sản phẩm được yêu thích nhất tại HN FOOD
            </p>
          </div>

          {isLoading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-primary-600 font-bold text-lg">
                      {product.price.toLocaleString('vi-VN')} VND
                    </p>
                    <Link
                      to={`/products/${product.slug}`}
                      className="mt-3 block w-full bg-primary-600 text-white text-center py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hơn 10,000+ khách hàng tin tưởng và hài lòng với sản phẩm của HN FOOD
            </p>
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center">
                {renderStars(5)}
                <span className="ml-2 text-lg font-semibold text-gray-900">4.9/5</span>
                <span className="ml-2 text-gray-600">(2,847 đánh giá)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  {renderStars(review.rating)}
                </div>

                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  "{review.comment}"
                </p>

                <div className="border-t pt-3">
                  <p className="text-xs text-gray-500">Sản phẩm: {review.product}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">10,000+</div>
                <p className="text-gray-600">Khách hàng tin tưởng</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">15+</div>
                <p className="text-gray-600">Quốc gia xuất khẩu</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">99.8%</div>
                <p className="text-gray-600">Khách hàng hài lòng</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                <p className="text-gray-600">Hỗ trợ khách hàng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bắt đầu mua sắm cùng HN FOOD
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Đăng ký ngay để nhận ưu đãi đặc biệt và tích lũy điểm thưởng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Đăng ký ngay
            </Link>
            <Link
              to="/products"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
