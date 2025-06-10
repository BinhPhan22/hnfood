import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  TruckIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState({});

  const categories = [
    { id: 'all', name: 'Tất cả', icon: QuestionMarkCircleIcon },
    { id: 'order', name: 'Đặt hàng', icon: ShoppingCartIcon },
    { id: 'payment', name: 'Thanh toán', icon: CreditCardIcon },
    { id: 'shipping', name: 'Vận chuyển', icon: TruckIcon },
    { id: 'account', name: 'Tài khoản', icon: UserIcon }
  ];

  const faqData = [
    {
      id: 1,
      category: 'order',
      question: 'Làm thế nào để đặt hàng trên HN FOOD?',
      answer: 'Bạn có thể đặt hàng bằng cách: 1) Chọn sản phẩm và thêm vào giỏ hàng, 2) Kiểm tra giỏ hàng và nhấn "Thanh toán", 3) Điền thông tin giao hàng, 4) Chọn phương thức thanh toán, 5) Xác nhận đơn hàng.'
    },
    {
      id: 2,
      category: 'order',
      question: 'Tôi có thể thay đổi hoặc hủy đơn hàng không?',
      answer: 'Bạn có thể hủy đơn hàng trong vòng 30 phút sau khi đặt hàng. Sau thời gian này, vui lòng liên hệ hotline 0123 456 789 để được hỗ trợ.'
    },
    {
      id: 3,
      category: 'order',
      question: 'Tại sao đơn hàng của tôi bị hủy?',
      answer: 'Đơn hàng có thể bị hủy do: sản phẩm hết hàng, thông tin giao hàng không chính xác, thanh toán không thành công, hoặc không liên lạc được với khách hàng.'
    },
    {
      id: 4,
      category: 'payment',
      question: 'HN FOOD hỗ trợ những phương thức thanh toán nào?',
      answer: 'Chúng tôi hỗ trợ: VietQR (quét mã QR), Ví điện tử HN FOOD, và COD (thanh toán khi nhận hàng). Tất cả đều an toàn và tiện lợi.'
    },
    {
      id: 5,
      category: 'payment',
      question: 'Làm thế nào để nạp tiền vào ví điện tử?',
      answer: 'Vào trang "Ví điện tử", nhấn "Nạp tiền", nhập số tiền và thanh toán qua VietQR. Bạn sẽ nhận thêm 20% thưởng khi nạp tiền.'
    },
    {
      id: 6,
      category: 'payment',
      question: 'Tôi có thể rút tiền từ ví điện tử không?',
      answer: 'Không, số tiền trong ví HN FOOD chỉ dùng để mua sản phẩm, không thể rút tiền mặt. Điều này đảm bảo an toàn và tuân thủ quy định pháp luật.'
    },
    {
      id: 7,
      category: 'payment',
      question: 'Thanh toán VietQR có an toàn không?',
      answer: 'Hoàn toàn an toàn. VietQR được Ngân hàng Nhà nước Việt Nam chứng nhận, sử dụng mã hóa 256-bit và không lưu trữ thông tin thẻ của bạn.'
    },
    {
      id: 8,
      category: 'shipping',
      question: 'Thời gian giao hàng là bao lâu?',
      answer: 'Thời gian giao hàng: Nội thành TP.HCM 1-2 ngày, các tỉnh thành khác 2-5 ngày làm việc. Sản phẩm tươi sống sẽ được ưu tiên giao nhanh nhất.'
    },
    {
      id: 9,
      category: 'shipping',
      question: 'Phí vận chuyển được tính như thế nào?',
      answer: 'Miễn phí vận chuyển cho đơn hàng từ 200,000 VND. Đơn hàng dưới 200,000 VND tính phí 25,000 VND nội thành, 35,000 VND ngoại thành.'
    },
    {
      id: 10,
      category: 'shipping',
      question: 'Tôi có thể thay đổi địa chỉ giao hàng không?',
      answer: 'Bạn có thể thay đổi địa chỉ giao hàng trước khi đơn hàng được xử lý (trong vòng 2 giờ). Sau đó vui lòng liên hệ hotline để được hỗ trợ.'
    },
    {
      id: 11,
      category: 'account',
      question: 'Làm thế nào để tạo tài khoản HN FOOD?',
      answer: 'Nhấn "Đăng ký" ở góc phải màn hình, điền thông tin cá nhân, xác nhận email và bạn đã có tài khoản HN FOOD với nhiều ưu đãi.'
    },
    {
      id: 12,
      category: 'account',
      question: 'Tôi quên mật khẩu, phải làm sao?',
      answer: 'Tại trang đăng nhập, nhấn "Quên mật khẩu", nhập email đăng ký và làm theo hướng dẫn trong email để đặt lại mật khẩu.'
    },
    {
      id: 13,
      category: 'account',
      question: 'Làm thế nào để cập nhật thông tin cá nhân?',
      answer: 'Đăng nhập vào tài khoản, vào "Thông tin cá nhân", chỉnh sửa thông tin cần thiết và nhấn "Lưu thay đổi".'
    },
    {
      id: 14,
      category: 'order',
      question: 'Tôi có thể đặt lại đơn hàng cũ không?',
      answer: 'Có, vào "Đơn hàng của tôi", chọn đơn hàng đã hoàn thành và nhấn "Đặt lại". Bạn có thể chỉnh sửa số lượng và thêm sản phẩm khác.'
    },
    {
      id: 15,
      category: 'payment',
      question: 'Chương trình thưởng 20% khi nạp ví hoạt động như thế nào?',
      answer: 'Khi nạp tiền vào ví, bạn nhận ngay 20% thưởng. Ví dụ: nạp 100,000 VND → nhận 120,000 VND trong ví. Áp dụng cho mọi lần nạp tiền.'
    }
  ];

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Câu hỏi thường gặp - HN FOOD</title>
        <meta name="description" content="Tìm câu trả lời cho các câu hỏi thường gặp về HN FOOD - Đặt hàng, thanh toán, vận chuyển" />
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Câu hỏi thường gặp</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tìm câu trả lời nhanh chóng cho các thắc mắc về dịch vụ của HN FOOD
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-3 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Danh mục</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  activeCategory === category.id
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <category.icon className={`h-8 w-8 mb-2 ${
                  activeCategory === category.id ? 'text-primary-600' : 'text-gray-500'
                }`} />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQ.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                {openItems[item.id] ? (
                  <ChevronUpIcon className="h-6 w-6 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openItems[item.id] && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed pt-4">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQ.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy câu hỏi phù hợp
            </h3>
            <p className="text-gray-600 mb-6">
              Hãy thử tìm kiếm với từ khóa khác hoặc liên hệ với chúng tôi
            </p>
          </div>
        )}

        {/* Contact support */}
        <div className="bg-primary-50 rounded-lg p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy câu trả lời?
          </h2>
          <p className="text-gray-600 mb-6">
            Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giúp đỡ bạn
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                📞
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Hotline</h4>
              <p className="text-primary-600 font-medium">0123 456 789</p>
              <p className="text-sm text-gray-500">24/7 - Miễn phí</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                ✉️
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
              <p className="text-primary-600 font-medium">support@hnfood.vn</p>
              <p className="text-sm text-gray-500">Phản hồi trong 2 giờ</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                💬
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Live Chat</h4>
              <p className="text-primary-600 font-medium">Trên website</p>
              <p className="text-sm text-gray-500">8:00 - 22:00 hàng ngày</p>
            </div>
          </div>
        </div>

        {/* Popular topics */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Chủ đề phổ biến</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Đặt hàng & Thanh toán</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => {
                      setActiveCategory('payment');
                      setSearchTerm('VietQR');
                    }}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    → Hướng dẫn thanh toán VietQR
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveCategory('payment');
                      setSearchTerm('ví điện tử');
                    }}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    → Cách sử dụng ví điện tử
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveCategory('order');
                      setSearchTerm('hủy đơn');
                    }}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    → Hủy và thay đổi đơn hàng
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Vận chuyển & Đổi trả</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => {
                      setActiveCategory('shipping');
                      setSearchTerm('thời gian giao hàng');
                    }}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    → Thời gian giao hàng
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveCategory('shipping');
                      setSearchTerm('phí vận chuyển');
                    }}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    → Phí vận chuyển
                  </button>
                </li>
                <li>
                  <a 
                    href="/return-policy"
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    → Chính sách đổi trả
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
