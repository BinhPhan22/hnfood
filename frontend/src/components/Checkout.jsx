import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('vietqr');
  const [qrCode, setQrCode] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    phone: ''
  });
  
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.user);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Create order
      const orderResponse = await axios.post('/api/orders', {
        products: cart.items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        total_amount: cart.total,
        payment_method: paymentMethod,
        shipping_info: shippingInfo
      });
      
      const orderId = orderResponse.data._id;
      
      // 2. If VietQR, generate QR code
      if (paymentMethod === 'vietqr') {
        const qrResponse = await axios.post('/api/vietqr/generate', {
          order_id: orderId
        });
        
        setQrCode(qrResponse.data.qr_code_url);
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thanh toán</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Shipping Information */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Thông tin giao hàng</h2>
          <input
            type="text"
            placeholder="Họ tên"
            className="w-full p-2 border rounded mb-2"
            value={shippingInfo.name}
            onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
            required
          />
          {/* More fields... */}
        </div>
        
        {/* Payment Methods */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Phương thức thanh toán</h2>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="vietqr"
                checked={paymentMethod === 'vietqr'}
                onChange={() => setPaymentMethod('vietqr')}
              />
              <span className="ml-2">VietQR (Quét mã QR)</span>
            </label>
            {/* Other payment methods... */}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Xác nhận đặt hàng
        </button>
      </form>
      
      {/* QR Code Display */}
      {qrCode && (
        <div className="mt-6 p-4 border rounded text-center">
          <h2 className="text-xl font-semibold mb-2">Quét mã QR để thanh toán</h2>
          <img src={qrCode} alt="VietQR Code" className="mx-auto" />
          <p className="mt-2">Sử dụng ứng dụng ngân hàng để quét mã QR và thanh toán</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;