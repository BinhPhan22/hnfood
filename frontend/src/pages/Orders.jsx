import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import {
  EyeIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reorderItems, setReorderItems] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      // Simulate API call with sample data
      setTimeout(() => {
        const sampleOrders = [
          {
            _id: '1',
            order_number: 'HN001',
            items: [
              {
                _id: '1',
                product_id: 'p1',
                product_name: 'Nấm linh chi đỏ nguyên tai',
                quantity: 2,
                price: 450000,
                image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800'
              },
              {
                _id: '2',
                product_id: 'p2',
                product_name: 'Gel rửa tay khô tinh dầu tràm trà',
                quantity: 1,
                price: 45000,
                image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800'
              }
            ],
            total_amount: 945000,
            order_status: 'completed',
            payment_status: 'paid',
            payment_method: 'vietqr',
            shipping_address: '123 Đường ABC, Quận 1, TP.HCM',
            created_at: '2024-06-05T10:30:00Z',
            delivered_at: '2024-06-07T14:20:00Z'
          },
          {
            _id: '2',
            order_number: 'HN002',
            items: [
              {
                _id: '3',
                product_id: 'p3',
                product_name: 'Nấm mối đen tươi Đà Lạt',
                quantity: 1,
                price: 120000,
                image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800'
              }
            ],
            total_amount: 120000,
            order_status: 'shipped',
            payment_status: 'paid',
            payment_method: 'wallet',
            shipping_address: '456 Đường XYZ, Quận 2, TP.HCM',
            created_at: '2024-06-08T09:15:00Z',
            shipped_at: '2024-06-09T11:20:00Z'
          },
          {
            _id: '3',
            order_number: 'HN003',
            items: [
              {
                _id: '4',
                product_id: 'p4',
                product_name: 'Nước lau sàn hữu cơ Lavender',
                quantity: 2,
                price: 85000,
                image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800'
              },
              {
                _id: '5',
                product_id: 'p5',
                product_name: 'Xịt sát khuẩn tay hương bạc hà',
                quantity: 3,
                price: 35000,
                image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800'
              }
            ],
            total_amount: 275000,
            order_status: 'processing',
            payment_status: 'paid',
            payment_method: 'vietqr',
            shipping_address: '789 Đường DEF, Quận 3, TP.HCM',
            created_at: '2024-06-10T14:45:00Z'
          }
        ];
        setOrders(sampleOrders);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Lỗi khi tải danh sách đơn hàng');
      setLoading(false);
    }
  };

  const handleReorder = (order) => {
    setSelectedOrder(order);
    setReorderItems(order.items.map(item => ({
      ...item,
      quantity: item.quantity,
      selected: true
    })));
    setShowReorderModal(true);
  };

  const updateReorderQuantity = (itemId, newQuantity) => {
    if (newQuantity < 0) return;
    setReorderItems(items =>
      items.map(item =>
        item._id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const toggleItemSelection = (itemId) => {
    setReorderItems(items =>
      items.map(item =>
        item._id === itemId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const calculateReorderTotal = () => {
    return reorderItems
      .filter(item => item.selected && item.quantity > 0)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const confirmReorder = () => {
    const selectedItems = reorderItems.filter(item => item.selected && item.quantity > 0);

    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }

    // Add to cart logic here
    toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    setShowReorderModal(false);
    navigate('/cart');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || order.order_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'processing': return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'shipped': return <TruckIcon className="h-5 w-5 text-purple-500" />;
      case 'completed': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelled': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao hàng';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
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
        <title>Đơn hàng của tôi - HN FOOD</title>
        <meta name="description" content="Quản lý và theo dõi đơn hàng của bạn tại HN FOOD" />
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn hàng của tôi</h1>
          <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đang giao hàng</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            {/* Results count */}
            <div className="flex items-center text-sm text-gray-600">
              Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
            </div>
          </div>
        </div>

        {/* Orders list */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Order header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đơn hàng #{order.order_number}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Đặt ngày {new Date(order.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.order_status)}
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.order_status)}`}>
                        {getStatusText(order.order_status)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    <Link
                      to={`/orders/${order._id}`}
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Chi tiết
                    </Link>
                    {order.order_status === 'completed' && (
                      <button
                        onClick={() => handleReorder(order)}
                        className="flex items-center text-green-600 hover:text-green-700"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-1" />
                        Đặt lại
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Order items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.price.toLocaleString('vi-VN')} VND/sp
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order total */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Thanh toán: {order.payment_method === 'vietqr' ? 'VietQR' :
                                   order.payment_method === 'wallet' ? 'Ví điện tử' : 'COD'}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        Tổng cộng: {order.total_amount.toLocaleString('vi-VN')} VND
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
            <Link
              to="/products"
              className="btn-primary"
            >
              Mua sắm ngay
            </Link>
          </div>
        )}
      </div>

      {/* Reorder Modal */}
      {showReorderModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Đặt lại đơn hàng #{selectedOrder.order_number}
                </h3>
                <button
                  onClick={() => setShowReorderModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reorderItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleItemSelection(item._id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                      <p className="text-sm text-gray-500">
                        {item.price.toLocaleString('vi-VN')} VND/sp
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateReorderQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        disabled={item.quantity <= 0}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateReorderQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-gray-900">Tổng cộng:</span>
                  <span className="text-xl font-bold text-primary-600">
                    {calculateReorderTotal().toLocaleString('vi-VN')} VND
                  </span>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowReorderModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmReorder}
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
