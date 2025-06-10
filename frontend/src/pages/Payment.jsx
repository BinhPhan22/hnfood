import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [order, setOrder] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchOrderAndGeneratePayment();
  }, [orderId, user, navigate]);

  useEffect(() => {
    let interval;
    if (timeLeft > 0 && paymentStatus === 'pending') {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPaymentStatus('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft, paymentStatus]);

  useEffect(() => {
    let statusInterval;
    if (paymentStatus === 'pending') {
      statusInterval = setInterval(() => {
        checkPaymentStatus();
      }, 5000); // Check every 5 seconds
    }
    return () => clearInterval(statusInterval);
  }, [paymentStatus]);

  const fetchOrderAndGeneratePayment = async () => {
    try {
      // Fetch order details
      const orderResponse = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!orderResponse.ok) {
        throw new Error('Không thể tải thông tin đơn hàng');
      }

      const orderData = await orderResponse.json();
      setOrder(orderData.data);

      // Generate VietQR payment if order is pending
      if (orderData.data.payment_status === 'pending') {
        const paymentResponse = await fetch('http://localhost:5001/api/payment/vietqr/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            orderId: orderId,
            amount: orderData.data.total_amount,
            description: `Thanh toan don hang ${orderData.data.order_number}`
          })
        });

        if (paymentResponse.ok) {
          const paymentResult = await paymentResponse.json();
          setPaymentData(paymentResult.data);
          
          // Calculate time left
          const expiresAt = new Date(paymentResult.data.expiresAt);
          const now = new Date();
          const timeLeftSeconds = Math.max(0, Math.floor((expiresAt - now) / 1000));
          setTimeLeft(timeLeftSeconds);
        }
      } else {
        setPaymentStatus(orderData.data.payment_status);
      }

    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Lỗi khi tải thông tin thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/payment/vietqr/status/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setPaymentStatus(result.data.paymentStatus);
        
        if (result.data.paymentStatus === 'paid') {
          toast.success('Thanh toán thành công!');
          setTimeout(() => {
            navigate(`/orders/${orderId}`);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const simulatePayment = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/payment/vietqr/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          orderId: orderId,
          transactionRef: paymentData.transactionRef
        })
      });

      if (response.ok) {
        setPaymentStatus('paid');
        toast.success('Thanh toán thành công!');
        setTimeout(() => {
          navigate(`/orders/${orderId}`);
        }, 2000);
      } else {
        toast.error('Lỗi xác nhận thanh toán');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Lỗi xác nhận thanh toán');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy đơn hàng</h2>
          <button
            onClick={() => navigate('/orders')}
            className="btn-primary"
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Thanh toán đơn hàng - HN FOOD</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin đơn hàng</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-medium">{order.order_number}</span>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Sản phẩm:</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.product_name} x {item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString('vi-VN')} VND</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary-600">
                    {order.total_amount.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                {paymentStatus === 'pending' && (
                  <ClockIcon className="h-12 w-12 text-yellow-500" />
                )}
                {paymentStatus === 'paid' && (
                  <CheckCircleIcon className="h-12 w-12 text-green-500" />
                )}
                {(paymentStatus === 'expired' || paymentStatus === 'failed') && (
                  <XCircleIcon className="h-12 w-12 text-red-500" />
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {paymentStatus === 'pending' && 'Thanh toán VietQR'}
                {paymentStatus === 'paid' && 'Thanh toán thành công'}
                {paymentStatus === 'expired' && 'Hết thời gian thanh toán'}
                {paymentStatus === 'failed' && 'Thanh toán thất bại'}
              </h2>
              
              {paymentStatus === 'pending' && timeLeft > 0 && (
                <div className="text-red-600 font-medium">
                  Thời gian còn lại: {formatTime(timeLeft)}
                </div>
              )}
            </div>

            {paymentStatus === 'pending' && paymentData && (
              <div className="space-y-6">
                {/* QR Code */}
                <div className="text-center">
                  <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <img
                      src={paymentData.qrCodeDataUrl}
                      alt="VietQR Code"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                  </p>
                </div>

                {/* Bank Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Thông tin chuyển khoản:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Ngân hàng:</span>
                      <span className="font-medium">{paymentData.bankInfo.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số tài khoản:</span>
                      <button
                        onClick={() => copyToClipboard(paymentData.bankInfo.accountNo)}
                        className="font-medium text-primary-600 hover:text-primary-700"
                      >
                        {paymentData.bankInfo.accountNo}
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <span>Chủ tài khoản:</span>
                      <span className="font-medium">{paymentData.bankInfo.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số tiền:</span>
                      <button
                        onClick={() => copyToClipboard(paymentData.amount.toString())}
                        className="font-medium text-primary-600 hover:text-primary-700"
                      >
                        {paymentData.amount.toLocaleString('vi-VN')} VND
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <span>Nội dung:</span>
                      <button
                        onClick={() => copyToClipboard(paymentData.description)}
                        className="font-medium text-primary-600 hover:text-primary-700 text-right max-w-xs truncate"
                      >
                        {paymentData.description}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Demo Payment Button */}
                <div className="text-center">
                  <button
                    onClick={simulatePayment}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CreditCardIcon className="h-5 w-5 inline mr-2" />
                    Mô phỏng thanh toán thành công
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    (Chỉ dành cho demo - Trong thực tế sẽ tự động xác nhận)
                  </p>
                </div>
              </div>
            )}

            {paymentStatus === 'paid' && (
              <div className="text-center space-y-4">
                <p className="text-green-600 font-medium">
                  Đơn hàng của bạn đã được thanh toán thành công!
                </p>
                <button
                  onClick={() => navigate(`/orders/${orderId}`)}
                  className="btn-primary"
                >
                  Xem chi tiết đơn hàng
                </button>
              </div>
            )}

            {(paymentStatus === 'expired' || paymentStatus === 'failed') && (
              <div className="text-center space-y-4">
                <p className="text-red-600 font-medium">
                  {paymentStatus === 'expired' 
                    ? 'Thời gian thanh toán đã hết. Vui lòng thử lại.'
                    : 'Thanh toán thất bại. Vui lòng thử lại.'
                  }
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Thử lại
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-3">Hướng dẫn thanh toán:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Mở ứng dụng ngân hàng trên điện thoại</li>
            <li>Chọn chức năng "Quét mã QR" hoặc "Chuyển khoản"</li>
            <li>Quét mã QR hoặc nhập thông tin chuyển khoản</li>
            <li>Kiểm tra thông tin và xác nhận thanh toán</li>
            <li>Hệ thống sẽ tự động xác nhận sau khi nhận được tiền</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Payment;
