import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Wallet from './pages/Wallet';
import ReturnPolicy from './pages/ReturnPolicy';
import PaymentGuide from './pages/PaymentGuide';
import FAQ from './pages/FAQ';
import TermsOfService from './pages/TermsOfService';

// Protected route component
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <div className="App min-h-screen bg-gray-50">
      <Helmet>
        <title>HN FOOD - Thực phẩm sạch cho sức khỏe</title>
        <meta name="description" content="Mua sắm thực phẩm hữu cơ, sản phẩm chăm sóc sức khỏe tại HN FOOD. Thanh toán VietQR, COD, chuyển khoản." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          } />
          <Route path="/payment/:orderId" element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } />
          <Route path="/wallet" element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          } />

          {/* Policy pages */}
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/payment-guide" element={<PaymentGuide />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
