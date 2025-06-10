import React from 'react';
import { Helmet } from 'react-helmet';
import { 
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const TermsOfService = () => {
  const sections = [
    {
      id: 'general',
      title: '1. Điều khoản chung',
      icon: DocumentTextIcon,
      content: [
        'Website HN FOOD (hnfood.vn) được vận hành bởi Công ty TNHH HN FOOD.',
        'Bằng việc truy cập và sử dụng website, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định.',
        'Chúng tôi có quyền thay đổi, cập nhật các điều khoản này bất cứ lúc nào mà không cần thông báo trước.',
        'Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.'
      ]
    },
    {
      id: 'account',
      title: '2. Tài khoản người dùng',
      icon: ShieldCheckIcon,
      content: [
        'Bạn phải đăng ký tài khoản để sử dụng đầy đủ các tính năng của website.',
        'Thông tin đăng ký phải chính xác, đầy đủ và được cập nhật thường xuyên.',
        'Bạn có trách nhiệm bảo mật thông tin đăng nhập và chịu trách nhiệm cho mọi hoạt động dưới tài khoản của mình.',
        'Nghiêm cấm việc tạo nhiều tài khoản để lạm dụng các chương trình khuyến mãi.',
        'HN FOOD có quyền khóa tài khoản nếu phát hiện hành vi vi phạm.'
      ]
    },
    {
      id: 'products',
      title: '3. Sản phẩm và dịch vụ',
      icon: InformationCircleIcon,
      content: [
        'Tất cả sản phẩm trên website đều có nguồn gốc xuất xứ rõ ràng và đảm bảo chất lượng.',
        'Hình ảnh sản phẩm chỉ mang tính chất minh họa, sản phẩm thực tế có thể có sự khác biệt nhỏ.',
        'Giá cả sản phẩm có thể thay đổi mà không cần thông báo trước.',
        'HN FOOD có quyền từ chối phục vụ hoặc hủy đơn hàng trong các trường hợp đặc biệt.',
        'Sản phẩm tươi sống có thời hạn sử dụng ngắn, khách hàng cần sử dụng ngay sau khi nhận hàng.'
      ]
    },
    {
      id: 'orders',
      title: '4. Đặt hàng và thanh toán',
      icon: DocumentTextIcon,
      content: [
        'Đơn hàng chỉ được xác nhận sau khi thanh toán thành công.',
        'Khách hàng có thể hủy đơn hàng trong vòng 30 phút sau khi đặt hàng.',
        'Sau 30 phút, việc hủy đơn hàng phải được sự đồng ý của HN FOOD.',
        'Các phương thức thanh toán được chấp nhận: VietQR, Ví điện tử HN FOOD, COD.',
        'Đối với thanh toán COD, khách hàng phải thanh toán đầy đủ khi nhận hàng.'
      ]
    },
    {
      id: 'wallet',
      title: '5. Ví điện tử HN FOOD',
      icon: ShieldCheckIcon,
      content: [
        'Ví điện tử HN FOOD chỉ dùng để mua sản phẩm trên website, không thể rút tiền mặt.',
        'Khi nạp tiền vào ví, khách hàng sẽ nhận thêm 20% thưởng (ví dụ: nạp 100,000 VND → nhận 120,000 VND).',
        'Số tiền thưởng có cùng giá trị và quyền sử dụng như số tiền nạp.',
        'HN FOOD có quyền điều chỉnh tỷ lệ thưởng hoặc tạm dừng chương trình mà không cần thông báo trước.',
        'Trong trường hợp ngừng hoạt động, số dư ví sẽ được hoàn trả theo quy định pháp luật.'
      ]
    },
    {
      id: 'shipping',
      title: '6. Vận chuyển và giao hàng',
      icon: InformationCircleIcon,
      content: [
        'Thời gian giao hàng: 1-2 ngày nội thành TP.HCM, 2-5 ngày các tỉnh thành khác.',
        'Phí vận chuyển: Miễn phí cho đơn hàng từ 200,000 VND, phí 25,000-35,000 VND cho đơn hàng nhỏ hơn.',
        'Khách hàng có trách nhiệm cung cấp địa chỉ giao hàng chính xác.',
        'Nếu giao hàng không thành công do lỗi thông tin từ khách hàng, phí giao hàng lần 2 sẽ do khách hàng chịu.',
        'Sản phẩm tươi sống sẽ được ưu tiên giao hàng trong khung giờ sớm nhất.'
      ]
    },
    {
      id: 'returns',
      title: '7. Đổi trả và hoàn tiền',
      icon: ExclamationTriangleIcon,
      content: [
        'Khách hàng có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng.',
        'Sản phẩm đổi trả phải còn nguyên vẹn, chưa sử dụng, còn tem mác.',
        'Chi phí vận chuyển đổi trả do HN FOOD chịu nếu lỗi từ nhà cung cấp.',
        'Một số sản phẩm không được đổi trả: thực phẩm tươi sống đã sử dụng, sản phẩm đã mở niêm phong.',
        'Thời gian xử lý đổi trả: 3-5 ngày làm việc kể từ khi nhận được sản phẩm.'
      ]
    },
    {
      id: 'privacy',
      title: '8. Bảo mật thông tin',
      icon: ShieldCheckIcon,
      content: [
        'HN FOOD cam kết bảo mật thông tin cá nhân của khách hàng theo quy định pháp luật.',
        'Thông tin khách hàng chỉ được sử dụng cho mục đích xử lý đơn hàng và cải thiện dịch vụ.',
        'Chúng tôi không chia sẻ thông tin khách hàng với bên thứ ba trừ khi có yêu cầu từ cơ quan pháp luật.',
        'Website sử dụng công nghệ mã hóa SSL để bảo vệ thông tin thanh toán.',
        'Khách hàng có quyền yêu cầu xóa hoặc chỉnh sửa thông tin cá nhân.'
      ]
    },
    {
      id: 'liability',
      title: '9. Trách nhiệm và giới hạn',
      icon: ExclamationTriangleIcon,
      content: [
        'HN FOOD không chịu trách nhiệm cho các thiệt hại gián tiếp phát sinh từ việc sử dụng website.',
        'Chúng tôi nỗ lực đảm bảo thông tin chính xác nhưng không đảm bảo website hoạt động liên tục không lỗi.',
        'Khách hàng có trách nhiệm kiểm tra sản phẩm khi nhận hàng và báo ngay nếu có vấn đề.',
        'Trách nhiệm bồi thường của HN FOOD không vượt quá giá trị đơn hàng.',
        'Các tranh chấp sẽ được giải quyết thông qua thương lượng hoặc theo quy định pháp luật Việt Nam.'
      ]
    },
    {
      id: 'contact',
      title: '10. Thông tin liên hệ',
      icon: InformationCircleIcon,
      content: [
        'Công ty TNHH HN FOOD',
        'Địa chỉ: 174 CMT8, Biên Hòa, Đồng Nai',
        'Hotline: 0123 456 789',
        'Email: support@hnfood.vn',
        'Website: hnfood.vn',
        'Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Thứ 6), 9:00 - 17:00 (Thứ 7 - Chủ nhật)'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Điều khoản sử dụng - HN FOOD</title>
        <meta name="description" content="Điều khoản và điều kiện sử dụng dịch vụ tại HN FOOD" />
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Điều khoản sử dụng</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Vui lòng đọc kỹ các điều khoản và điều kiện sử dụng dịch vụ của HN FOOD
          </p>
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Cập nhật lần cuối:</strong> 10/06/2024 • 
              <strong> Có hiệu lực từ:</strong> 01/01/2024
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mục lục</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors"
              >
                <section.icon className="h-4 w-4 mr-2" />
                <span className="text-sm">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.id} id={section.id} className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <section.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>
              
              <div className="space-y-4">
                {section.content.map((paragraph, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Important notices */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Lưu ý quan trọng</h3>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Việc sử dụng website đồng nghĩa với việc bạn đã đọc và đồng ý với các điều khoản này</li>
                <li>• HN FOOD có quyền thay đổi điều khoản bất cứ lúc nào mà không cần thông báo trước</li>
                <li>• Nếu không đồng ý với các điều khoản, vui lòng ngừng sử dụng dịch vụ</li>
                <li>• Mọi tranh chấp sẽ được giải quyết theo pháp luật Việt Nam</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact for questions */}
        <div className="bg-primary-50 rounded-lg p-8 mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Có thắc mắc về điều khoản sử dụng?
          </h2>
          <p className="text-gray-600 mb-6">
            Đội ngũ pháp lý của chúng tôi sẵn sàng giải đáp mọi thắc mắc
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-1">Email pháp lý</h4>
              <p className="text-primary-600 font-medium">legal@hnfood.vn</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-1">Hotline</h4>
              <p className="text-primary-600 font-medium">0123 456 789</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-1">Địa chỉ</h4>
              <p className="text-gray-600">174 CMT8, Biên Hòa, Đồng Nai</p>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <div className="text-center mt-8">
          <a
            href="#top"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Về đầu trang
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
