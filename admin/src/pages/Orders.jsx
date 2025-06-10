import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Simulate API call with sample data
      setTimeout(() => {
        const sampleOrders = [
          {
            _id: '1',
            order_number: 'HN001',
            customer: {
              name: 'Nguyễn Văn A',
              email: 'nguyenvana@email.com',
              phone: '0123456789'
            },
            items: [
              { product_name: 'Nấm linh chi đỏ', quantity: 2, price: 450000 },
              { product_name: 'Gel rửa tay khô', quantity: 1, price: 45000 }
            ],
            total_amount: 945000,
            order_status: 'pending',
            payment_status: 'pending',
            payment_method: 'vietqr',
            shipping_address: '123 Đường ABC, Quận 1, TP.HCM',
            created_at: '2024-06-10T10:30:00Z',
            updated_at: '2024-06-10T10:30:00Z'
          },
          {
            _id: '2',
            order_number: 'HN002',
            customer: {
              name: 'Trần Thị B',
              email: 'tranthib@email.com',
              phone: '0987654321'
            },
            items: [
              { product_name: 'Nấm mối đen tươi', quantity: 1, price: 120000 },
              { product_name: 'Nước lau sàn Lavender', quantity: 2, price: 85000 }
            ],
            total_amount: 290000,
            order_status: 'processing',
            payment_status: 'paid',
            payment_method: 'vietqr',
            shipping_address: '456 Đường XYZ, Quận 2, TP.HCM',
            created_at: '2024-06-10T09:15:00Z',
            updated_at: '2024-06-10T11:20:00Z'
          },
          {
            _id: '3',
            order_number: 'HN003',
            customer: {
              name: 'Lê Văn C',
              email: 'levanc@email.com',
              phone: '0369852147'
            },
            items: [
              { product_name: 'Viên nang linh chi', quantity: 1, price: 520000 }
            ],
            total_amount: 520000,
            order_status: 'shipped',
            payment_status: 'paid',
            payment_method: 'cod',
            shipping_address: '789 Đường DEF, Quận 3, TP.HCM',
            created_at: '2024-06-09T14:45:00Z',
            updated_at: '2024-06-10T08:30:00Z'
          },
          {
            _id: '4',
            order_number: 'HN004',
            customer: {
              name: 'Phạm Thị D',
              email: 'phamthid@email.com',
              phone: '0741852963'
            },
            items: [
              { product_name: 'Nấm rơm tươi', quantity: 3, price: 25000 },
              { product_name: 'Xịt sát khuẩn tay', quantity: 2, price: 35000 }
            ],
            total_amount: 145000,
            order_status: 'completed',
            payment_status: 'paid',
            payment_method: 'vietqr',
            shipping_address: '321 Đường GHI, Quận 4, TP.HCM',
            created_at: '2024-06-08T16:20:00Z',
            updated_at: '2024-06-09T10:15:00Z'
          },
          {
            _id: '5',
            order_number: 'HN005',
            customer: {
              name: 'Hoàng Văn E',
              email: 'hoangvane@email.com',
              phone: '0159753486'
            },
            items: [
              { product_name: 'Bột nấm linh chi', quantity: 1, price: 280000 },
              { product_name: 'Khăn lau bamboo', quantity: 1, price: 120000 }
            ],
            total_amount: 400000,
            order_status: 'cancelled',
            payment_status: 'refunded',
            payment_method: 'vietqr',
            shipping_address: '654 Đường JKL, Quận 5, TP.HCM',
            created_at: '2024-06-08T11:10:00Z',
            updated_at: '2024-06-08T15:30:00Z'
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Simulate API call
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, order_status: newStatus, updated_at: new Date().toISOString() }
          : order
      ));
      toast.success('Cập nhật trạng thái đơn hàng thành công');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Lỗi khi cập nhật trạng thái đơn hàng');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.order_status === statusFilter;
    const matchesDate = !dateFilter || order.created_at.startsWith(dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

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
      case 'shipped': return 'Đang giao';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán';
      case 'paid': return 'Đã thanh toán';
      case 'refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };

  const exportOrders = () => {
    // Simple CSV export
    const csvContent = [
      ['Mã đơn hàng', 'Khách hàng', 'Email', 'Tổng tiền', 'Trạng thái', 'Ngày tạo'],
      ...filteredOrders.map(order => [
        order.order_number,
        order.customer.name,
        order.customer.email,
        order.total_amount,
        getStatusText(order.order_status),
        new Date(order.created_at).toLocaleDateString('vi-VN')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Theo dõi và xử lý đơn hàng của khách hàng</p>
        </div>
        <button
          onClick={exportOrders}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Xuất Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <option value="shipped">Đang giao</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          {/* Date filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600">
            Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.order_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} sản phẩm
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.total_amount.toLocaleString('vi-VN')} VND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.order_status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(order.order_status)}`}
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="shipped">Đang giao</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                      {getPaymentStatusText(order.payment_status)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {order.payment_method === 'vietqr' ? 'VietQR' : 'COD'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    <div className="text-xs">
                      {new Date(order.created_at).toLocaleTimeString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
