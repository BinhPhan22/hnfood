import React from 'react';
import { Helmet } from 'react-helmet';

const Checkout = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Thanh toán - HN FOOD</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>
      
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">Trang thanh toán đang được phát triển...</p>
      </div>
    </div>
  );
};

export default Checkout;
