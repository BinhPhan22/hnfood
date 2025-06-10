import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  CreditCardIcon,
  QrCodeIcon,
  WalletIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const PaymentGuide = () => {
  const [activeTab, setActiveTab] = useState('vietqr');

  const paymentMethods = [
    {
      id: 'vietqr',
      name: 'VietQR',
      icon: QrCodeIcon,
      description: 'Thanh toán nhanh chóng bằng mã QR',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'wallet',
      name: 'Ví điện tử',
      icon: WalletIcon,
      description: 'Thanh toán bằng số dư ví HN FOOD',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'cod',
      name: 'COD',
      icon: BanknotesIcon,
      description: 'Thanh toán khi nhận hàng',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const vietqrSteps = [
    {
      step: 1,
      title: 'Chọn phương thức thanh toán',
      description: 'Tại trang thanh toán, chọn "Thanh toán VietQR"',
      image: '/payment-guide/step1.png'
    },
    {
      step: 2,
      title: 'Quét mã QR',
      description: 'Mở ứng dụng ngân hàng và quét mã QR hiển thị trên màn hình',
      image: '/payment-guide/step2.png'
    },
    {
      step: 3,
      title: 'Xác nhận thông tin',
      description: 'Kiểm tra số tiền và nội dung chuyển khoản, sau đó xác nhận',
      image: '/payment-guide/step3.png'
    },
    {
      step: 4,
      title: 'Hoàn tất thanh toán',
      description: 'Hệ thống tự động xác nhận và cập nhật trạng thái đơn hàng',
      image: '/payment-guide/step4.png'
    }
  ];

  const walletSteps = [
    {
      step: 1,
      title: 'Nạp tiền vào ví',
      description: 'Nạp tiền vào ví HN FOOD qua VietQR và nhận thưởng 20%',
      image: '/payment-guide/wallet1.png'
    },
    {
      step: 2,
      title: 'Chọn thanh toán ví',
      description: 'Tại trang thanh toán, chọn "Thanh toán bằng ví điện tử"',
      image: '/payment-guide/wallet2.png'
    },
    {
      step: 3,
      title: 'Xác nhận thanh toán',
      description: 'Kiểm tra số dư và xác nhận thanh toán',
      image: '/payment-guide/wallet3.png'
    },
    {
      step: 4,
      title: 'Thanh toán thành công',
      description: 'Số tiền được trừ từ ví và đơn hàng được xác nhận',
      image: '/payment-guide/wallet4.png'
    }
  ];

  const codSteps = [
    {
      step: 1,
      title: 'Chọn COD',
      description: 'Tại trang thanh toán, chọn "Thanh toán khi nhận hàng (COD)"',
      image: '/payment-guide/cod1.png'
    },
    {
      step: 2,
      title: 'Xác nhận đơn hàng',
      description: 'Điền đầy đủ thông tin giao hàng và xác nhận đơn hàng',
      image: '/payment-guide/cod2.png'
    },
    {
      step: 3,
      title: 'Nhận hàng',
      description: 'Nhận hàng từ shipper tại địa chỉ đã cung cấp',
      image: '/payment-guide/cod3.png'
    },
    {
      step: 4,
      title: 'Thanh toán',
      description: 'Kiểm tra hàng và thanh toán tiền mặt cho shipper',
      image: '/payment-guide/cod4.png'
    }
  ];

  const supportedBanks = [
    'Vietcombank', 'VietinBank', 'BIDV', 'Agribank', 'MB Bank',
    'Techcombank', 'ACB', 'VPBank', 'TPBank', 'Sacombank',
    'HDBank', 'VIB', 'SHB', 'OCB', 'MSB'
  ];

  const securityFeatures = [
    {
      icon: ShieldCheckIcon,
      title: 'Bảo mật SSL',
      description: 'Mã hóa dữ liệu 256-bit đảm bảo an toàn tuyệt đối'
    },
    {
      icon: CheckCircleIcon,
      title: 'Xác thực 2 lớp',
      description: 'Xác thực qua SMS và email để bảo vệ tài khoản'
    },
    {
      icon: ClockIcon,
      title: 'Theo dõi real-time',
      description: 'Cập nhật trạng thái thanh toán ngay lập tức'
    }
  ];

  const getCurrentSteps = () => {
    switch (activeTab) {
      case 'vietqr': return vietqrSteps;
      case 'wallet': return walletSteps;
      case 'cod': return codSteps;
      default: return vietqrSteps;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Hướng dẫn thanh toán - HN FOOD</title>
        <meta name="description" content="Hướng dẫn chi tiết các phương thức thanh toán tại HN FOOD - VietQR, Ví điện tử, COD" />
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hướng dẫn thanh toán</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            HN FOOD hỗ trợ nhiều phương thức thanh toán tiện lợi, an toàn và nhanh chóng
          </p>
        </div>

        {/* Payment methods tabs */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Các phương thức thanh toán</h2>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setActiveTab(method.id)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-lg border-2 transition-all ${
                  activeTab === method.id
                    ? `border-primary-500 ${method.bgColor} ${method.color}`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <method.icon className={`h-6 w-6 ${activeTab === method.id ? method.color : 'text-gray-500'}`} />
                <div className="text-left">
                  <div className={`font-semibold ${activeTab === method.id ? method.color : 'text-gray-900'}`}>
                    {method.name}
                  </div>
                  <div className="text-sm text-gray-500">{method.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getCurrentSteps().map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {step.step}
                </div>
                <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <DevicePhoneMobileIcon className="h-16 w-16 text-gray-400" />
                  {/* In production, replace with actual images */}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Special features for each method */}
        {activeTab === 'vietqr' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ngân hàng hỗ trợ VietQR</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {supportedBanks.map((bank, index) => (
                <div key={index} className="text-center p-3 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <CreditCardIcon className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{bank}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-green-800 mb-4">Ưu điểm của ví điện tử HN FOOD</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold">20%</span>
                </div>
                <h4 className="font-semibold text-green-800 mb-1">Thưởng nạp tiền</h4>
                <p className="text-green-700 text-sm">Nhận 20% thưởng khi nạp tiền vào ví</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-green-800 mb-1">Thanh toán nhanh</h4>
                <p className="text-green-700 text-sm">Thanh toán chỉ trong 1 click</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShieldCheckIcon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-green-800 mb-1">An toàn tuyệt đối</h4>
                <p className="text-green-700 text-sm">Bảo mật cao, không lo rủi ro</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cod' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Lưu ý khi thanh toán COD</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                <p className="text-orange-800">Phí COD: 15,000 VND cho đơn hàng dưới 200,000 VND</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                <p className="text-orange-800">Miễn phí COD cho đơn hàng từ 200,000 VND trở lên</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                <p className="text-orange-800">Vui lòng chuẩn bị đủ tiền mặt khi nhận hàng</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                <p className="text-orange-800">Được kiểm tra hàng trước khi thanh toán</p>
              </div>
            </div>
          </div>
        )}

        {/* Security features */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bảo mật thanh toán</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Câu hỏi thường gặp</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Tôi có thể hủy đơn hàng sau khi thanh toán không?</h4>
              <p className="text-gray-600">Bạn có thể hủy đơn hàng trong vòng 30 phút sau khi thanh toán. Tiền sẽ được hoàn lại vào ví điện tử hoặc tài khoản ngân hàng.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Tại sao thanh toán VietQR không thành công?</h4>
              <p className="text-gray-600">Có thể do mạng không ổn định, tài khoản không đủ số dư, hoặc quá thời gian thanh toán (15 phút). Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Số tiền trong ví có thể rút ra không?</h4>
              <p className="text-gray-600">Số tiền trong ví HN FOOD chỉ dùng để mua sản phẩm, không thể rút tiền mặt. Điều này giúp đảm bảo an toàn và tuân thủ quy định.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Làm sao để nhận thưởng 20% khi nạp ví?</h4>
              <p className="text-gray-600">Thưởng 20% được tự động cộng vào ví sau khi nạp tiền thành công. Ví dụ: nạp 100,000 VND sẽ nhận được 120,000 VND trong ví.</p>
            </div>
          </div>
        </div>

        {/* Contact support */}
        <div className="bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cần hỗ trợ thanh toán?</h2>
          <p className="text-gray-600 mb-6">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp bạn 24/7
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-1">Hotline</h4>
              <p className="text-primary-600 font-medium">0123 456 789</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
              <p className="text-primary-600 font-medium">payment@hnfood.vn</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-1">Live Chat</h4>
              <p className="text-primary-600 font-medium">Trên website 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGuide;
