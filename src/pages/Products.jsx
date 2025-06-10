import React from 'react';
import { Helmet } from 'react-helmet';

const Products = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Sản phẩm - HN FOOD</title>
        <meta name="description" content="Danh sách sản phẩm thực phẩm sạch và chăm sóc sức khỏe tại HN FOOD" />
      </Helmet>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sản phẩm</h1>
      
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">Trang sản phẩm đang được phát triển...</p>
      </div>
    </div>
  );
};

export default Products;
