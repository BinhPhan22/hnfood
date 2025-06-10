import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UsersIcon,
  TagIcon,
  ChartBarIcon,
  CogIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Sản phẩm', href: '/products', icon: ShoppingBagIcon },
    { name: 'Đơn hàng', href: '/orders', icon: ShoppingCartIcon },
    { name: 'Khách hàng', href: '/users', icon: UsersIcon },
    { name: 'Khuyến mãi', href: '/promotions', icon: TagIcon },
    { name: 'Thống kê', href: '/analytics', icon: ChartBarIcon },
    { name: 'Website', href: '/website-settings', icon: CogIcon },
    { name: 'Cài đặt', href: '/settings', icon: CogIcon },
  ];

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-primary-600">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-bold text-lg">HN</span>
            </div>
            <span className="text-white font-bold text-xl">ADMIN</span>
          </Link>
          
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${isActive(item.href)
                    ? 'bg-primary-100 text-primary-700 border-r-4 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">HN</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">HN FOOD</p>
                <p className="text-xs text-gray-500">Admin Panel v1.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
