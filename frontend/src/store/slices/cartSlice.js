import { createSlice } from '@reduxjs/toolkit';

// Get cart from localStorage
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const initialState = {
  items: cartItems,
  total: 0,
  itemCount: 0,
  shippingInfo: JSON.parse(localStorage.getItem('shippingInfo')) || {},
  paymentMethod: localStorage.getItem('paymentMethod') || '',
};

// Calculate totals
const calculateTotals = (items) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...initialState,
    ...calculateTotals(initialState.items),
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          slug: product.slug,
          stock: product.stock,
          quantity,
        });
      }

      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;

      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item._id !== productId);

      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;

      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item._id === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item._id !== productId);
        } else {
          item.quantity = Math.min(quantity, item.stock);
        }

        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.itemCount = totals.itemCount;

        localStorage.setItem('cartItems', JSON.stringify(state.items));
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      localStorage.removeItem('cartItems');
    },

    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem('shippingInfo', JSON.stringify(action.payload));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },

    applyDiscount: (state, action) => {
      const { discountAmount, promotionCode } = action.payload;
      state.discount = discountAmount;
      state.promotionCode = promotionCode;
      state.finalTotal = state.total - discountAmount;
    },

    removeDiscount: (state) => {
      state.discount = 0;
      state.promotionCode = '';
      state.finalTotal = state.total;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  saveShippingInfo,
  savePaymentMethod,
  applyDiscount,
  removeDiscount,
} = cartSlice.actions;

export default cartSlice.reducer;
