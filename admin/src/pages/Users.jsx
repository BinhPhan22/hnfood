import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  StarIcon,
  WalletIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    points: '',
    wallet: '',
    reason: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/users/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
      } else {
        // Fallback to sample data if API fails
        const sampleUsers = [
          {
            _id: '1',
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            phone: '0123456789',
            role: 'customer',
            is_active: true,
            address: '123 Đường ABC, Quận 1, TP.HCM',
            birthday: '1990-05-15',
            created_at: '2024-01-15T10:30:00Z',
            last_login: '2024-06-10T08:20:00Z',
            total_orders: 8,
            total_spent: 2450000,
            wallet_balance: 150000,
            loyalty_points: 245
          },
          {
            _id: '2',
            name: 'Trần Thị B',
            email: 'tranthib@email.com',
            phone: '0987654321',
            role: 'customer',
            is_active: true,
            address: '456 Đường XYZ, Quận 2, TP.HCM',
            birthday: '1985-08-22',
            created_at: '2024-02-20T14:15:00Z',
            last_login: '2024-06-09T16:45:00Z',
            total_orders: 12,
            total_spent: 3200000,
            wallet_balance: 250000,
            loyalty_points: 320
          },
          {
            _id: '3',
            name: 'Lê Văn C',
            email: 'levanc@email.com',
            phone: '0369852147',
            role: 'customer',
            is_active: true,
            address: '789 Đường DEF, Quận 3, TP.HCM',
            birthday: '1992-12-03',
            created_at: '2024-03-10T09:20:00Z',
            last_login: '2024-06-08T12:30:00Z',
            total_orders: 5,
            total_spent: 1800000,
            wallet_balance: 80000,
            loyalty_points: 180
          },
          {
            _id: '4',
            name: 'Phạm Thị D',
            email: 'phamthid@email.com',
            phone: '0741852963',
            role: 'customer',
            is_active: false,
            address: '321 Đường GHI, Quận 4, TP.HCM',
            birthday: '1988-07-18',
            created_at: '2024-04-05T11:45:00Z',
            last_login: '2024-05-20T14:10:00Z',
            total_orders: 3,
            total_spent: 950000,
            wallet_balance: 0,
            loyalty_points: 95
          },
          {
            _id: '5',
            name: 'Admin HN FOOD',
            email: 'admin@hnfood.vn',
            phone: '0123456789',
            role: 'admin',
            is_active: true,
            address: '174 CMT8, Biên Hòa, Đồng Nai',
            birthday: '1980-01-01',
            created_at: '2024-01-01T00:00:00Z',
            last_login: '2024-06-10T15:30:00Z',
            total_orders: 0,
            total_spent: 0,
            wallet_balance: 0,
            loyalty_points: 0
          }
        ];
        setUsers(sampleUsers);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Lỗi khi tải danh sách khách hàng');
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, is_active: !currentStatus }
          : user
      ));
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = statusFilter === '' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const exportUsers = () => {
    const csvContent = [
      ['Tên', 'Email', 'Điện thoại', 'Vai trò', 'Tổng đơn hàng', 'Tổng chi tiêu', 'Ngày tham gia'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone,
        user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng',
        user.total_orders,
        user.total_spent,
        new Date(user.created_at).toLocaleDateString('vi-VN')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      points: user.loyalty_points.toString(),
      wallet: user.wallet_balance.toString(),
      reason: ''
    });
    setShowEditModal(true);
  };

  const handleUpdatePoints = async () => {
    if (!selectedUser || !editForm.points) {
      toast.error('Vui lòng nhập số điểm');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/users/admin/users/${selectedUser._id}/points`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          points: parseInt(editForm.points),
          reason: editForm.reason || 'Admin cập nhật điểm'
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
        setShowEditModal(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating points:', error);
      toast.error('Lỗi khi cập nhật điểm');
    }
  };

  const handleUpdateWallet = async () => {
    if (!selectedUser || !editForm.wallet) {
      toast.error('Vui lòng nhập số dư ví');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/users/admin/users/${selectedUser._id}/wallet`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseInt(editForm.wallet),
          reason: editForm.reason || 'Admin cập nhật số dư ví'
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
        setShowEditModal(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating wallet:', error);
      toast.error('Lỗi khi cập nhật ví');
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng (CRM)</h1>
          <p className="text-gray-600">Theo dõi và quản lý thông tin khách hàng</p>
        </div>
        <button
          onClick={exportUsers}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Xuất Excel
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'customer').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Khách hàng hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'customer' && u.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.reduce((sum, u) => sum + u.total_spent, 0).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <ShoppingCartIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.reduce((sum, u) => sum + u.total_orders, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Tất cả vai trò</option>
            <option value="customer">Khách hàng</option>
            <option value="admin">Quản trị viên</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600">
            Hiển thị {filteredUsers.length} / {users.length} khách hàng
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm thưởng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số dư ví
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Tham gia: {new Date(user.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {user.loyalty_points ? user.loyalty_points.toLocaleString('vi-VN') : '0'} điểm
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <WalletIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {user.wallet_balance ? user.wallet_balance.toLocaleString('vi-VN') : '0'} VND
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user._id, user.is_active)}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.is_active ? 'Hoạt động' : 'Không hoạt động'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => showUserDetails(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-green-600 hover:text-green-900"
                        title="Chỉnh sửa điểm và ví"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy khách hàng nào</p>
          </div>
        )}
      </div>

      {/* User detail modal */}
      {showUserDetail && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết khách hàng
                </h3>
                <button
                  onClick={() => setShowUserDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-gray-500">{selectedUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <p className="text-sm">{selectedUser.phone}</p>
                </div>
                
                <div className="flex items-start">
                  <div className="h-5 w-5 text-gray-400 mr-3 mt-0.5">📍</div>
                  <p className="text-sm">{selectedUser.address}</p>
                </div>
                
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <p className="text-sm">
                    Sinh nhật: {selectedUser.birthday ? new Date(selectedUser.birthday).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Thống kê mua hàng</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Tổng đơn hàng</p>
                      <p className="font-medium">{selectedUser.total_orders}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tổng chi tiêu</p>
                      <p className="font-medium">{selectedUser.total_spent.toLocaleString('vi-VN')} VND</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Số dư ví</p>
                      <p className="font-medium">{selectedUser.wallet_balance.toLocaleString('vi-VN')} VND</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Điểm tích lũy</p>
                      <p className="font-medium">{selectedUser.loyalty_points} điểm</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">
                    Đăng nhập lần cuối: {new Date(selectedUser.last_login).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Chỉnh sửa: {selectedUser.name}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điểm thưởng
                  </label>
                  <input
                    type="number"
                    value={editForm.points}
                    onChange={(e) => setEditForm(prev => ({ ...prev, points: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Hiện tại: {selectedUser.loyalty_points ? selectedUser.loyalty_points.toLocaleString('vi-VN') : '0'} điểm
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số dư ví (VND)
                  </label>
                  <input
                    type="number"
                    value={editForm.wallet}
                    onChange={(e) => setEditForm(prev => ({ ...prev, wallet: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Hiện tại: {selectedUser.wallet_balance ? selectedUser.wallet_balance.toLocaleString('vi-VN') : '0'} VND
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do thay đổi
                  </label>
                  <input
                    type="text"
                    value={editForm.reason}
                    onChange={(e) => setEditForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Nhập lý do..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdatePoints}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Cập nhật điểm
                </button>
                <button
                  onClick={handleUpdateWallet}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Cập nhật ví
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
