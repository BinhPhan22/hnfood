import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

// Layout components
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/LoginPage';

// Admin pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Users from './pages/Users';
import Promotions from './pages/Promotions';
import PromotionForm from './pages/PromotionForm';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Protected route component
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="App min-h-screen bg-gray-100">
      <Helmet>
        <title>HN FOOD Admin - Quản trị hệ thống</title>
        <meta name="description" content="Trang quản trị hệ thống HN FOOD" />
      </Helmet>
      
      <Routes>
        {/* Login route */}
        <Route 
          path="/login" 
          element={
            user && user.role === 'admin' ? 
            <Navigate to="/dashboard" replace /> : 
            <LoginPage />
          } 
        />
        
        {/* Protected admin routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Products */}
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          
          {/* Orders */}
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          
          {/* Users */}
          <Route path="users" element={<Users />} />
          
          {/* Promotions */}
          <Route path="promotions" element={<Promotions />} />
          <Route path="promotions/new" element={<PromotionForm />} />
          <Route path="promotions/:id/edit" element={<PromotionForm />} />
          
          {/* Analytics */}
          <Route path="analytics" element={<Analytics />} />
          
          {/* Settings */}
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Redirect to login if not authenticated */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
