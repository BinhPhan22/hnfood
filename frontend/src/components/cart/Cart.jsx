import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ShoppingCartIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  StarIcon,
  TruckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { updateQuantity, removeFromCart, clearCart } from '../../store/slices/cartSlice';
import walletService from '../../services/walletService';
import toast from 'react-hot-toast';

const Cart = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  const [usePoints, setUsePoints] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
  const [shippingSettings, setShippingSettings] = useState(null);
  const [affordability, setAffordability] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchUserBalance();
    }
    if (isOpen) {
      fetchShippingSettings();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (usePoints && total > 0) {
      checkAffordability();
    }
  }, [usePoints, total]);

  const fetchUserBalance = async () => {
    try {
      const response = await walletService.getBalance();
      if (response.success) {
        setUserBalance(response.data);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchShippingSettings = async () => {
    try {
      const response = await walletService.getSettings();
      if (response.success) {
        setShippingSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const checkAffordability = async () => {
    try {
      const shippingFee = calculateShippingFee();
      const totalWithShipping = total + shippingFee;
      
      const response = await walletService.checkAffordability(totalWithShipping);
      if (response.success) {
        setAffordability(response.data);
      }
    } catch (error) {
      console.error('Error checking affordability:', error);
    }
  };

  const calculateShippingFee = () => {
    if (!shippingSettings) return 0;
    
    if (total >= shippingSettings.free_shipping_threshold) {
      return 0;
    }
    return shippingSettings.shipping_fee;
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('Đã xóa tất cả sản phẩm');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const shippingFee = calculateShippingFee();
  const totalWithShipping = total + shippingFee;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ShoppingCartIcon className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Giỏ hàng ({items.length} sản phẩm)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Giỏ hàng trống
              </h3>
              <p className="text-gray-600 mb-4">
                Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
              </p>
              <Link
                to="/products"
                onClick={onClose}
                className="btn-primary inline-flex items-center"
              >
                Xem sản phẩm
              </Link>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MinusIcon className="h-4 w-4 text-gray-600" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <PlusIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors mt-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              {shippingSettings && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TruckIcon className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-blue-900">Thông tin vận chuyển</span>
                  </div>
                  {shippingFee === 0 ? (
                    <p className="text-sm text-green-700">
                      🎉 Miễn phí vận chuyển cho đơn hàng từ {formatCurrency(shippingSettings.free_shipping_threshold)}
                    </p>
                  ) : (
                    <div className="text-sm text-blue-700">
                      <p>Phí vận chuyển: {formatCurrency(shippingFee)}</p>
                      <p>
                        Mua thêm {formatCurrency(shippingSettings.free_shipping_threshold - total)} để được miễn phí vận chuyển
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Points Payment Option */}
              {user && userBalance && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <StarIcon className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium text-gray-900">Thanh toán bằng điểm</span>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={usePoints}
                        onChange={(e) => setUsePoints(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">Sử dụng điểm</span>
                    </label>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Điểm hiện có:</span>
                      <span className="font-medium">{userBalance.points.toLocaleString('vi-VN')} điểm</span>
                    </div>
                    
                    {usePoints && affordability && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Điểm cần dùng:</span>
                          <span className="font-medium text-orange-600">
                            {affordability.pointsNeeded.toLocaleString('vi-VN')} điểm
                          </span>
                        </div>
                        
                        {!affordability.canAfford && (
                          <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
                            <p className="text-red-700 text-xs">
                              Không đủ điểm. Thiếu {affordability.pointsShortfall.toLocaleString('vi-VN')} điểm
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển:</span>
                  <span>{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary-600">{formatCurrency(totalWithShipping)}</span>
                </div>
                
                {usePoints && affordability?.canAfford && (
                  <div className="text-sm text-green-700 bg-green-50 rounded p-2">
                    ✓ Thanh toán bằng {affordability.pointsNeeded.toLocaleString('vi-VN')} điểm
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-3">
            <div className="flex space-x-3">
              <button
                onClick={handleClearCart}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Xóa tất cả
              </button>
              
              <Link
                to="/checkout"
                onClick={onClose}
                state={{ 
                  usePoints: usePoints && affordability?.canAfford,
                  pointsUsed: usePoints && affordability?.canAfford ? affordability.pointsNeeded : 0
                }}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
              >
                Thanh toán
              </Link>
            </div>
            
            {usePoints && !affordability?.canAfford && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <div className="flex items-start space-x-2">
                  <InformationCircleIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    Bạn có thể nạp thêm tiền để nhận điểm thưởng và thanh toán bằng điểm
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
