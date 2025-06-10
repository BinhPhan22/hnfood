import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { 
  ShoppingCartIcon,
  EyeIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { addToCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder-product.jpg',
      quantity: 1
    }));
    
    toast.success(t('cart.item_added'));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (product.original_price && product.original_price > product.price) {
      return Math.round(((product.original_price - product.price) / product.original_price) * 100);
    }
    return 0;
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/products/${product._id}`} className="block">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4">
          <div className="flex items-center space-x-4">
            {/* Product Image */}
            <div className="flex-shrink-0 w-24 h-24">
              <img
                src={product.images?.[0] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {product.description}
              </p>
              
              {/* Category */}
              {product.category && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mt-2">
                  {t(`products.categories.${product.category}`)}
                </span>
              )}
            </div>

            {/* Price and Actions */}
            <div className="flex-shrink-0 text-right">
              <div className="mb-2">
                <span className="text-xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <div className="text-sm">
                    <span className="text-gray-500 line-through">
                      {formatPrice(product.original_price)}
                    </span>
                    <span className="text-red-500 ml-1">
                      -{getDiscountPercentage()}%
                    </span>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleAddToCart}
                className="btn-primary text-sm px-4 py-2"
              >
                <ShoppingCartIcon className="h-4 w-4 mr-1" />
                {t('products.add_to_cart')}
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view (default)
  return (
    <Link to={`/products/${product._id}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg';
            }}
          />
          
          {/* Discount Badge */}
          {getDiscountPercentage() > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{getDiscountPercentage()}%
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
              <HeartIcon className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
              <EyeIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Stock Status */}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">{t('products.out_of_stock')}</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mb-2">
              {t(`products.categories.${product.category}`)}
            </span>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={`h-4 w-4 ${
                      index < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                ({product.review_count || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <ShoppingCartIcon className="h-4 w-4 mr-2" />
            {product.stock_quantity === 0 ? t('products.out_of_stock') : t('products.add_to_cart')}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
