import api from './api';

const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    // Add language parameter
    const language = localStorage.getItem('i18nextLng') || 'vi';
    const paramsWithLang = { ...params, lang: language };
    const queryString = new URLSearchParams(paramsWithLang).toString();
    const response = await api.get(`/products?${queryString}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const language = localStorage.getItem('i18nextLng') || 'vi';
    const response = await api.get(`/products/${id}?lang=${language}`);
    return response.data;
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    const language = localStorage.getItem('i18nextLng') || 'vi';
    const response = await api.get(`/products/slug/${slug}?lang=${language}`);
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const language = localStorage.getItem('i18nextLng') || 'vi';
    const response = await api.get(`/products?featured=true&limit=${limit}&lang=${language}`);
    return response.data;
  },

  // Search products
  searchProducts: async (keyword, filters = {}) => {
    const language = localStorage.getItem('i18nextLng') || 'vi';
    const params = { keyword, ...filters, lang: language };
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/products?${queryString}`);
    return response.data;
  },
};

export default productService;
