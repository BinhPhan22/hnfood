import React from 'react';
import { Helmet } from 'react-helmet';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Thông tin cá nhân - HN FOOD</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Thông tin cá nhân</h1>
      
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">Trang thông tin cá nhân đang được phát triển...</p>
      </div>
    </div>
  );
};

export default Profile;
