import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import { getFeaturedProducts } from '../store/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Products = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { featuredProducts, isLoading } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { id: 'all', name: t('products.categories.all') },
    { id: 'thuc-pham-chuc-nang', name: t('products.categories.thuc-pham-chuc-nang') },
    { id: 'thuc-pham-huu-co', name: t('products.categories.thuc-pham-huu-co') },
    { id: 'cham-soc-ca-nhan', name: t('products.categories.cham-soc-ca-nhan') }
  ];

  const sortOptions = [
    { value: 'newest', label: t('products.sort_options.newest') },
    { value: 'oldest', label: t('products.sort_options.oldest') },
    { value: 'price_low', label: t('products.sort_options.price_low') },
    { value: 'price_high', label: t('products.sort_options.price_high') },
    { value: 'name_az', label: t('products.sort_options.name_az') },
    { value: 'name_za', label: t('products.sort_options.name_za') }
  ];

  useEffect(() => {
    dispatch(getFeaturedProducts(12));
  }, [dispatch, i18n.language]);

  const filteredProducts = featuredProducts?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'name_az':
        return a.name.localeCompare(b.name);
      case 'name_za':
        return b.name.localeCompare(a.name);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      default: // newest
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('products.title')} - HN FOOD</title>
        <meta name="description" content="Danh sách sản phẩm thực phẩm sạch và chăm sóc sức khỏe tại HN FOOD" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('products.title')}</h1>
          <p className="text-gray-600">
            {t('homepage.hero_subtitle')}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('products.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-600">
            {t('common.showing')} {sortedProducts.length} {t('products.items')}
          </div>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FunnelIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('products.no_products')}
            </h3>
            <p className="text-gray-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
