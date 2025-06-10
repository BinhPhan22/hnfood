import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  WalletIcon,
  StarIcon,
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import walletService from '../../services/walletService';
import toast from 'react-hot-toast';

const WalletBalance = ({ onDeposit, showActions = true }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await walletService.getBalance();
      if (response.success) {
        setBalance(response.data);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error(t('errors.network'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchBalance();
      toast.success('Đã cập nhật số dư');
    } catch (error) {
      toast.error('Lỗi khi cập nhật số dư');
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <WalletIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Đăng nhập để xem số dư ví</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-40"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-lg text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Ví điện tử</h3>
        {showActions && (
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Wallet Balance */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <WalletIcon className="h-5 w-5" />
              <span className="text-sm opacity-90">Số dư ví</span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">
                {balance ? formatCurrency(balance.walletBalance) : '0 ₫'}
              </div>
            </div>
          </div>
        </div>

        {/* Points Balance */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StarIcon className="h-5 w-5 text-yellow-300" />
              <span className="text-sm opacity-90">Điểm thưởng</span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">
                {balance ? balance.points.toLocaleString('vi-VN') : '0'} điểm
              </div>
              <div className="text-xs opacity-75">
                ≈ {balance ? formatCurrency(balance.pointsValue) : '0 ₫'}
              </div>
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div className="border-t border-white/20 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-90">Tổng giá trị</span>
            <div className="text-xl font-bold">
              {balance ? formatCurrency(balance.totalValue) : '0 ₫'}
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onDeposit}
              className="flex-1 bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Nạp tiền</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletBalance;
