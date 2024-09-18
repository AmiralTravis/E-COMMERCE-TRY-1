import { createStore } from 'vuex';
import products from './modules/products'; // Import the products module

const cart = {
  state: {
    cart: [], // Your existing cart state
  },
  mutations: {
    ADD_TO_CART(state, product) {
      const item = state.cart.find((p) => p.id === product.id);
      if (item) {
        item.quantity += 1; // Increment quantity if the product already exists
      } else {
        state.cart.push({ ...product, quantity: 1 }); // Add new product with quantity 1
      }
    },
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter((product) => product.id !== productId);
    },
    UPDATE_CART_QUANTITY(state, { productId, quantity }) {
      const item = state.cart.find((product) => product.id === productId);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
  },
  actions: {
    addToCart({ commit }, product) {
      commit('ADD_TO_CART', product);
    },
    removeFromCart({ commit }, productId) {
      commit('REMOVE_FROM_CART', productId);
    },
    updateCartQuantity({ commit }, payload) {
      commit('UPDATE_CART_QUANTITY', payload);
    },
  },
  getters: {
    cartItems: (state) => state.cart,
    cartTotalPrice: (state) =>
      state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
  },
};

// Create the Vuex store instance
const store = createStore({
  modules: {
    products, // Include the products module
    cart, // Include the cart module (same as your existing code)
  },
});

export default store;
