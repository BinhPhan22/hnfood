import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import { 
  CreditCardIcon,
  PlusIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

const Wallet = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWalletData();
  }, [user, navigate]);

  const fetchWalletData = async () => {
    try {
      // Simulate API calls
      setTimeout(() => {
        setWalletBalance(250000);
        
        const sampleTransactions = [
          {
            _id: '1',
            type: 'topup',
            amount: 200000,
            bonus_amount: 40000,
            description: 'Nạp tiền vào ví',
            status: 'completed',
            created_at: '2024-06-10T10:30:00Z',
            reference: 'TOPUP123456'
          },
          {
            _id: '2',
            type: 'payment',
            amount: -120000,
            description: 'Thanh toán đơn hàng HN002',
            status: 'completed',
            created_at: '2024-06-09T14:20:00Z',
            reference: 'ORDER_HN002'
          },
          {
            _id: '3',
            type: 'bonus',
            amount: 50000,
            description: 'Thưởng sinh nhật',
            status: 'completed',
            created_at: '2024-06-08T09:15:00Z',
            reference: 'BIRTHDAY_BONUS'
          },
          {
            _id: '4',
            type: 'topup',
            amount: 100000,
            bonus_amount: 20000,
            description: 'Nạp tiền vào ví',
            status: 'completed',
            created_at: '2024-06-05T16:45:00Z',
            reference: 'TOPUP789012'
          },
          {
            _id: '5',
            type: 'payment',
            amount: -85000,
            description: 'Thanh toán đơn hàng HN001',
            status: 'completed',
            created_at: '2024-06-03T11:30:00Z',
            reference: 'ORDER_HN001'
          }
        ];
        
        setTransactions(sampleTransactions);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Lỗi khi tải thông tin ví');
      setLoading(false);
    }
  };

  const handleTopup = async () => {
    const amount = parseInt(topupAmount.replace(/[^0-9]/g, ''));
    
    if (!amount || amount < 10000) {
      toast.error('Số tiền nạp tối thiểu là 10,000 VND');
      return;
    }

    if (amount > 10000000) {
      toast.error('Số tiền nạp tối đa là 10,000,000 VND');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/payment/wallet/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount })
      });

      if (response.ok) {
        const result = await response.json();
        setPaymentData(result.data);
        setShowTopupModal(false);
        setShowPaymentModal(true);
        setTopupAmount('');
      } else {
        toast.error('Lỗi tạo giao dịch nạp tiền');
      }
    } catch (error) {
      console.error('Error creating topup:', error);
      toast.error('Lỗi tạo giao dịch nạp tiền');
    }
  };

  const simulateTopupSuccess = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/payment/wallet/topup/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          transactionId: paymentData.transactionId,
          transactionRef: paymentData.transactionRef
        })
      });

      if (response.ok) {
        toast.success('Nạp tiền thành công!');
        setShowPaymentModal(false);
        fetchWalletData(); // Refresh wallet data
      } else {
        toast.error('Lỗi xác nhận nạp tiền');
      }
    } catch (error) {
      console.error('Error confirming topup:', error);
      toast.error('Lỗi xác nhận nạp tiền');
    }
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('vi-VN');
  };

  const formatCurrency = (value) => {
    const number = value.replace(/[^0-9]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'topup': return <ArrowDownIcon className="h-5 w-5 text-green-500" />;
      case 'payment': return <ArrowUpIcon className="h-5 w-5 text-red-500" />;
      case 'bonus': return <GiftIcon className="h-5 w-5 text-purple-500" />;
      case 'refund': return <ArrowDownIcon className="h-5 w-5 text-blue-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'topup': return 'text-green-600';
      case 'payment': return 'text-red-600';
      case 'bonus': return 'text-purple-600';
      case 'refund': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTransactionText = (type) => {
    switch (type) {
      case 'topup': return 'Nạp tiền';
      case 'payment': return 'Thanh toán';
      case 'bonus': return 'Thưởng';
      case 'refund': return 'Hoàn tiền';
      default: return type;
    }
  };

  const calculateBonus = (amount) => {
    return Math.floor(amount * 0.2); // 20% bonus
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Ví điện tử - HN FOOD</title>
        <meta name="description" content="Quản lý ví điện tử và lịch sử giao dịch tại HN FOOD" />
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ví điện tử</h1>
          <p className="text-gray-600">Quản lý số dư và lịch sử giao dịch của bạn</p>
        </div>

        {/* Wallet balance card */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg shadow-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 mb-2">Số dư hiện tại</p>
              <p className="text-4xl font-bold">{formatAmount(walletBalance)} VND</p>
              <p className="text-primary-100 mt-2">
                Chỉ dùng để mua sản phẩm • Không thể rút tiền mặt
              </p>
            </div>
            <div className="text-right">
              <CreditCardIcon className="h-16 w-16 text-primary-200 mb-4" />
              <button
                onClick={() => setShowTopupModal(true)}
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nạp tiền
              </button>
            </div>
          </div>
        </div>

        {/* Bonus info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <InformationCircleIcon className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">Chương trình khuyến mãi</h3>
              <p className="text-yellow-700 text-sm">
                🎉 Nạp tiền nhận ngay <strong>20% thưởng</strong>! Ví dụ: Nạp 100,000 VND → Nhận 120,000 VND vào ví.
                <br />
                💰 Số tiền trong ví chỉ dùng để mua sản phẩm tại HN FOOD, không thể rút tiền mặt.
              </p>
            </div>
          </div>
        </div>

        {/* Transaction history */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Lịch sử giao dịch</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div key={transaction._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{new Date(transaction.created_at).toLocaleString('vi-VN')}</span>
                        <span>•</span>
                        <span>{getTransactionText(transaction.type)}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          {transaction.status === 'completed' ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                              Thành công
                            </>
                          ) : transaction.status === 'pending' ? (
                            <>
                              <ClockIcon className="h-4 w-4 text-yellow-500 mr-1" />
                              Đang xử lý
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                              Thất bại
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)} VND
                    </p>
                    {transaction.bonus_amount && (
                      <p className="text-sm text-purple-600">
                        +{formatAmount(transaction.bonus_amount)} VND thưởng
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="p-12 text-center">
              <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có giao dịch nào</h3>
              <p className="text-gray-500">Lịch sử giao dịch của bạn sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>

      {/* Topup Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Nạp tiền vào ví</h3>
                <button
                  onClick={() => setShowTopupModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền nạp (VND)
                  </label>
                  <input
                    type="text"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(formatCurrency(e.target.value))}
                    placeholder="Nhập số tiền"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Tối thiểu: 10,000 VND • Tối đa: 10,000,000 VND
                  </p>
                </div>

                {topupAmount && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Số tiền nạp:</span>
                      <span className="font-medium">
                        {formatCurrency(topupAmount)} VND
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-green-600">
                      <span>Thưởng 20%:</span>
                      <span className="font-medium">
                        +{formatAmount(calculateBonus(parseInt(topupAmount.replace(/[^0-9]/g, '')) || 0))} VND
                      </span>
                    </div>
                    <div className="border-t border-green-200 mt-2 pt-2">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Tổng nhận được:</span>
                        <span className="text-green-600">
                          {formatAmount((parseInt(topupAmount.replace(/[^0-9]/g, '')) || 0) + calculateBonus(parseInt(topupAmount.replace(/[^0-9]/g, '')) || 0))} VND
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Số tiền trong ví chỉ dùng để mua sản phẩm tại HN FOOD, không thể rút tiền mặt.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowTopupModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleTopup}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Thanh toán VietQR</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="text-center space-y-4">
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <img
                    src={paymentData.qrCodeDataUrl}
                    alt="VietQR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <h4 className="font-medium text-gray-900 mb-3">Thông tin chuyển khoản:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Ngân hàng:</span>
                      <span className="font-medium">{paymentData.bankInfo.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số tài khoản:</span>
                      <span className="font-medium">{paymentData.bankInfo.accountNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số tiền:</span>
                      <span className="font-medium">{formatAmount(paymentData.amount)} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nội dung:</span>
                      <span className="font-medium text-right max-w-xs truncate">
                        {paymentData.description}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={simulateTopupSuccess}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mô phỏng thanh toán thành công
                </button>
                
                <p className="text-xs text-gray-500">
                  (Demo) - Trong thực tế sẽ tự động xác nhận khi nhận được tiền
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
