import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, email, phone, subject, message } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Địa chỉ',
      content: '174 CMT8, Biên Hòa, Đồng Nai',
      link: 'https://maps.google.com/?q=174+CMT8+Bien+Hoa+Dong+Nai'
    },
    {
      icon: PhoneIcon,
      title: 'Điện thoại',
      content: '0123 456 789',
      link: 'tel:0123456789'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'support@hnfood.vn',
      link: 'mailto:support@hnfood.vn'
    },
    {
      icon: ClockIcon,
      title: 'Giờ làm việc',
      content: 'T2-T6: 8:00-18:00, T7-CN: 9:00-17:00',
      link: null
    }
  ];

  const faqs = [
    {
      question: 'Làm thế nào để thanh toán bằng VietQR?',
      answer: 'Chọn phương thức thanh toán VietQR tại trang thanh toán, quét mã QR bằng ứng dụng ngân hàng và xác nhận giao dịch.'
    },
    {
      question: 'Chính sách đổi trả như thế nào?',
      answer: 'Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất. Khách hàng vui lòng gửi sản phẩm về địa chỉ của chúng tôi.'
    },
    {
      question: 'Thời gian giao hàng bao lâu?',
      answer: 'Thời gian giao hàng từ 1-3 ngày làm việc tùy theo khu vực. Chúng tôi sẽ thông báo cụ thể khi xác nhận đơn hàng.'
    },
    {
      question: 'Có được kiểm tra hàng trước khi thanh toán không?',
      answer: 'Với phương thức COD, bạn có thể kiểm tra bao bì bên ngoài trước khi thanh toán. Tuy nhiên, không được mở sản phẩm để thử.'
    }
  ];

  return (
    <div>
      <Helmet>
        <title>Liên hệ - HN FOOD</title>
        <meta name="description" content="Liên hệ với HN FOOD để được hỗ trợ tư vấn sản phẩm và dịch vụ" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                    target={info.link.startsWith('http') ? '_blank' : '_self'}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-600">{info.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={onChange}
                      required
                      className="input"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      required
                      className="input"
                      placeholder="Nhập email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={onChange}
                      className="input"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Chủ đề
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={subject}
                      onChange={onChange}
                      className="input"
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="product">Tư vấn sản phẩm</option>
                      <option value="order">Hỗ trợ đơn hàng</option>
                      <option value="payment">Thanh toán VietQR</option>
                      <option value="return">Đổi trả sản phẩm</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Tin nhắn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={message}
                    onChange={onChange}
                    required
                    className="input"
                    placeholder="Nhập tin nhắn của bạn..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner w-4 h-4 mr-2"></div>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                      Gửi tin nhắn
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Vị trí của chúng tôi
              </h2>
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Bản đồ Google Maps</p>
                  <p className="text-sm text-gray-500">174 CMT8, Biên Hòa, Đồng Nai</p>
                </div>
              </div>
              
              <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Hướng dẫn đến cửa hàng
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Từ TP.HCM: Đi theo QL1A hướng Biên Hòa</li>
                  <li>• Từ sân bay Long Thành: Khoảng 15km</li>
                  <li>• Gần chợ Tân Mai, dễ dàng tìm thấy</li>
                  <li>• Có bãi đỗ xe rộng rãi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những câu hỏi được khách hàng quan tâm nhất
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Không tìm thấy câu trả lời bạn cần?
            </p>
            <a
              href="#contact-form"
              className="btn-primary inline-flex items-center"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
              Liên hệ trực tiếp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
