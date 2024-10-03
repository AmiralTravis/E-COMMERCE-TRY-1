import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [],
  }),

  actions: {
    addToCart(product) {
      const existingItem = this.cartItems.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cartItems.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(productId) {
      const index = this.cartItems.findIndex(item => item.id === productId);
      if (index !== -1) {
        this.cartItems.splice(index, 1);
      }
    },
    updateCartQuantity({ productId, quantity }) {
      const item = this.cartItems.find(item => item.id === productId);
      if (item) {
        item.quantity = parseInt(quantity);
      }
    },
    clearCart() {
      this.cartItems = [];
    },
  },

  getters: {
    getCartItems: (state) => state.cartItems,
    getCartTotalPrice: (state) =>
      state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    getCartItemCount: (state) =>
      state.cartItems.reduce((count, item) => count + item.quantity, 0),
  },
});