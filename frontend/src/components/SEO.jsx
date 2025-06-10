import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title, description, keywords, image }) => {
  const siteTitle = 'HN FOOD - Sản phẩm sức khỏe và sạch';
  const defaultDescription = 'Mua sắm thực phẩm hữu cơ, sản phẩm chăm sóc sức khỏe tại HN FOOD. Thanh toán VietQR, COD, chuyển khoản.';
  const defaultKeywords = 'HN FOOD, thực phẩm sạch, sức khỏe, VietQR';
  const defaultImage = 'https://hnfood.vn/images/logo.png';

  return (
    <Helmet>
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

export default SEO;