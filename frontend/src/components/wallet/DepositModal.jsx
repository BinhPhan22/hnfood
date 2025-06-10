import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  XMarkIcon,
  CreditCardIcon,
  QrCodeIcon,
  StarIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import walletService from '../../services/walletService';
import toast from 'react-hot-toast';

const DepositModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('vietqr');
  const [loading, setLoading] = useState(false);
  const [pointsPreview, setPointsPreview] = useState(null);
  const [settings, setSettings] = useState(null);

  const presetAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000];

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  useEffect(() => {
    if (amount && parseInt(amount) > 0) {
      calculatePoints();
    } else {
      setPointsPreview(null);
    }
  }, [amount]);

  const fetchSettings = async () => {
    try {
      const response = await walletService.getSettings();
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const calculatePoints = async () => {
    try {
      const response = await walletService.calculatePoints(parseInt(amount), 'deposit');
      if (response.success) {
        setPointsPreview(response.data);
      }
    } catch (error) {
      console.error('Error calculating points:', error);
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseInt(amount) < 10000) {
      toast.error('Số tiền nạp tối thiểu là 10,000 VND');
      return;
    }

    setLoading(true);
    try {
      const response = await walletService.deposit(parseInt(amount), paymentMethod);
      if (response.success) {
        toast.success(response.message);
        onSuccess && onSuccess(response.data);
        onClose();
        setAmount('');
        setPointsPreview(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error depositing:', error);
      toast.error('Lỗi khi nạp tiền');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Nạp tiền vào ví</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số tiền nạp
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                min="10000"
                step="1000"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                VND
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Số tiền nạp tối thiểu: 10,000 VND
            </p>
          </div>

          {/* Preset Amounts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn nhanh
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset.toString())}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                    amount === preset.toString()
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {formatCurrency(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Points Preview */}
          {pointsPreview && settings && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <StarIcon className="h-5 w-5 text-yellow-500" />
                <span className="font-medium text-gray-900">Điểm thưởng nhận được</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền nạp:</span>
                  <span className="font-medium">{formatCurrency(parseInt(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thưởng {settings.points_bonus_percentage}%:</span>
                  <span className="font-medium text-green-600">
                    +{formatCurrency(pointsPreview.bonusAmount)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-yellow-200 pt-2">
                  <span className="font-medium text-gray-900">Tổng điểm nhận:</span>
                  <span className="font-bold text-yellow-600">
                    {pointsPreview.points.toLocaleString('vi-VN')} điểm
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Phương thức thanh toán
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="vietqr"
                  checked={paymentMethod === 'vietqr'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <QrCodeIcon className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <div className="font-medium">VietQR</div>
                  <div className="text-sm text-gray-500">Quét mã QR để thanh toán</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <CreditCardIcon className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <div className="font-medium">Chuyển khoản ngân hàng</div>
                  <div className="text-sm text-gray-500">Chuyển khoản trực tiếp</div>
                </div>
              </label>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Điểm thưởng sẽ được cộng ngay sau khi nạp tiền thành công</li>
                  <li>• Điểm thưởng có thể sử dụng để thanh toán đơn hàng</li>
                  <li>• 1 điểm = 1,000 VND khi thanh toán</li>
                  <li>• Giao dịch sẽ được xử lý trong vòng 5-10 phút</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleDeposit}
            disabled={loading || !amount || parseInt(amount) < 10000}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Đang xử lý...' : 'Nạp tiền'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
