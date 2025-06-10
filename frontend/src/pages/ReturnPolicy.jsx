import React from 'react';
import { Helmet } from 'react-helmet';
import { 
  ClockIcon,
  ShieldCheckIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const ReturnPolicy = () => {
  const returnConditions = [
    {
      icon: ClockIcon,
      title: 'Thời gian đổi trả',
      description: 'Trong vòng 7 ngày kể từ ngày nhận hàng',
      color: 'text-blue-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Tình trạng sản phẩm',
      description: 'Sản phẩm còn nguyên vẹn, chưa sử dụng, còn tem mác',
      color: 'text-green-600'
    },
    {
      icon: TruckIcon,
      title: 'Vận chuyển',
      description: 'HN FOOD chịu phí vận chuyển nếu lỗi từ nhà cung cấp',
      color: 'text-purple-600'
    }
  ];

  const acceptedReasons = [
    'Sản phẩm bị hư hỏng trong quá trình vận chuyển',
    'Sản phẩm không đúng như mô tả trên website',
    'Sản phẩm bị lỗi từ nhà sản xuất',
    'Giao sai sản phẩm so với đơn hàng',
    'Sản phẩm hết hạn sử dụng khi nhận hàng',
    'Bao bì sản phẩm bị rách, móp méo nghiêm trọng'
  ];

  const rejectedReasons = [
    'Khách hàng đổi ý sau khi mua',
    'Sản phẩm đã được sử dụng hoặc mở niêm phong',
    'Sản phẩm bị hư hỏng do lỗi của khách hàng',
    'Quá thời hạn 7 ngày đổi trả',
    'Không có hóa đơn hoặc chứng từ mua hàng',
    'Sản phẩm thuộc danh mục không được đổi trả'
  ];

  const nonReturnableItems = [
    'Sản phẩm tươi sống đã qua sử dụng',
    'Thực phẩm chức năng đã mở niêm phong',
    'Sản phẩm chăm sóc cá nhân đã sử dụng',
    'Sản phẩm khuyến mãi, giảm giá đặc biệt',
    'Sản phẩm được làm riêng theo yêu cầu'
  ];

  const returnSteps = [
    {
      step: 1,
      title: 'Liên hệ hỗ trợ',
      description: 'Gọi hotline 0123 456 789 hoặc gửi email đến support@hnfood.vn trong vòng 7 ngày'
    },
    {
      step: 2,
      title: 'Cung cấp thông tin',
      description: 'Cung cấp mã đơn hàng, lý do đổi trả và hình ảnh sản phẩm (nếu có)'
    },
    {
      step: 3,
      title: 'Xác nhận đổi trả',
      description: 'Nhân viên sẽ xác nhận và hướng dẫn cách thức đổi trả'
    },
    {
      step: 4,
      title: 'Gửi sản phẩm',
      description: 'Đóng gói sản phẩm cẩn thận và gửi về địa chỉ được hướng dẫn'
    },
    {
      step: 5,
      title: 'Kiểm tra và xử lý',
      description: 'HN FOOD kiểm tra sản phẩm và xử lý đổi trả trong 3-5 ngày làm việc'
    },
    {
      step: 6,
      title: 'Hoàn tất',
      description: 'Hoàn tiền vào ví điện tử hoặc gửi sản phẩm thay thế'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Chính sách đổi trả - HN FOOD</title>
        <meta name="description" content="Chính sách đổi trả sản phẩm tại HN FOOD - Quy trình đơn giản, minh bạch" />
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Chính sách đổi trả</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            HN FOOD cam kết mang đến trải nghiệm mua sắm tốt nhất với chính sách đổi trả linh hoạt và minh bạch
          </p>
        </div>

        {/* Return conditions */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Điều kiện đổi trả</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {returnConditions.map((condition, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${condition.color} bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <condition.icon className={`h-8 w-8 ${condition.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{condition.title}</h3>
                <p className="text-gray-600">{condition.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Accepted vs Rejected reasons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Accepted reasons */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Chấp nhận đổi trả</h3>
            </div>
            <ul className="space-y-3">
              {acceptedReasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Rejected reasons */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <XCircleIcon className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Không chấp nhận đổi trả</h3>
            </div>
            <ul className="space-y-3">
              {rejectedReasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Non-returnable items */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-2" />
            <h3 className="text-xl font-semibold text-yellow-800">Sản phẩm không được đổi trả</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nonReturnableItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-yellow-800">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Return process */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quy trình đổi trả</h2>
          <div className="space-y-6">
            {returnSteps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  {step.step}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h4>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund policy */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Chính sách hoàn tiền</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 mt-2"></div>
              <p className="text-gray-700">
                <strong>Hoàn tiền vào ví điện tử:</strong> Tiền sẽ được hoàn vào ví điện tử HN FOOD trong vòng 1-2 ngày làm việc sau khi xác nhận đổi trả.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 mt-2"></div>
              <p className="text-gray-700">
                <strong>Hoàn tiền về tài khoản ngân hàng:</strong> Áp dụng cho đơn hàng thanh toán bằng VietQR, thời gian hoàn tiền 3-7 ngày làm việc.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 mt-2"></div>
              <p className="text-gray-700">
                <strong>Đổi sản phẩm:</strong> Khách hàng có thể chọn đổi sang sản phẩm khác có giá trị tương đương hoặc bù thêm tiền nếu sản phẩm mới có giá cao hơn.
              </p>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cần hỗ trợ đổi trả?</h2>
          <p className="text-gray-600 mb-6">
            Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-1">Hotline</h4>
              <p className="text-primary-600 font-medium">0123 456 789</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
              <p className="text-primary-600 font-medium">support@hnfood.vn</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-1">Giờ làm việc</h4>
              <p className="text-gray-600">8:00 - 18:00 (T2-T6)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
