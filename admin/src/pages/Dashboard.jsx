import React, { useEffect, useState } from 'react';
import { 
  ShoppingBagIcon,
  ShoppingCartIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls
      setTimeout(() => {
        setStats({
          totalProducts: 12,
          totalOrders: 45,
          totalUsers: 128,
          totalRevenue: 15750000,
          recentOrders: [
            { id: 1, customer: 'Nguyễn Văn A', total: 250000, status: 'completed' },
            { id: 2, customer: 'Trần Thị B', total: 180000, status: 'pending' },
            { id: 3, customer: 'Lê Văn C', total: 320000, status: 'processing' },
            { id: 4, customer: 'Phạm Thị D', total: 150000, status: 'completed' },
            { id: 5, customer: 'Hoàng Văn E', total: 420000, status: 'shipped' }
          ],
          topProducts: [
            { name: 'Nấm linh chi đỏ', sales: 25, revenue: 11250000 },
            { name: 'Gel rửa tay khô', sales: 45, revenue: 2025000 },
            { name: 'Nấm mối đen tươi', sales: 18, revenue: 2160000 },
            { name: 'Nước lau sàn Lavender', sales: 32, revenue: 2720000 }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Đơn hàng',
      value: stats.totalOrders,
      icon: ShoppingCartIcon,
      color: 'bg-green-500',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Khách hàng',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'bg-purple-500',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'Doanh thu',
      value: `${stats.totalRevenue.toLocaleString('vi-VN')} VND`,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
      change: '+22%',
      trend: 'up'
    }
  ];

  // Chart data
  const revenueChartData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: [1200000, 1900000, 3000000, 2500000, 2200000, 3200000, 2800000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const ordersChartData = {
    labels: ['Chờ xử lý', 'Đang xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'],
    datasets: [
      {
        data: [8, 12, 15, 35, 5],
        backgroundColor: [
          '#fbbf24',
          '#3b82f6',
          '#8b5cf6',
          '#10b981',
          '#ef4444',
        ],
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao';
      default: return status;
    }
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hệ thống HN FOOD</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="flex items-center">
                {stat.trend === 'up' ? (
                  <TrendingUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ml-1 ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Doanh thu 7 ngày qua
          </h3>
          <Line 
            data={revenueChartData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return value.toLocaleString('vi-VN') + ' VND';
                    }
                  }
                }
              }
            }}
          />
        </div>

        {/* Orders status chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Trạng thái đơn hàng
          </h3>
          <Doughnut 
            data={ordersChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Recent orders and top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Đơn hàng gần đây
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">
                      {order.total.toLocaleString('vi-VN')} VND
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Sản phẩm bán chạy
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.sales} đã bán
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">
                    {product.revenue.toLocaleString('vi-VN')} VND
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
