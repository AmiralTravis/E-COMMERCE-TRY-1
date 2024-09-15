// import Vue from 'vue';
// import Vuex from 'vuex';

// Vue.use(Vuex);

// export default new Vuex.Store({
//   state: {
//     cart: [],
//   },
//   mutations: {
//     ADD_TO_CART(state, product) {
//       const item = state.cart.find((p) => p.id === product.id);
//       if (item) {
//         item.quantity += 1; // Increment quantity if the product already exists
//       } else {
//         state.cart.push({ ...product, quantity: 1 }); // Add new product with quantity 1
//       }
//     },
//     REMOVE_FROM_CART(state, productId) {
//       state.cart = state.cart.filter((product) => product.id !== productId);
//     },
//     UPDATE_CART_QUANTITY(state, { productId, quantity }) {
//       const item = state.cart.find((product) => product.id === productId);
//       if (item && quantity > 0) {
//         item.quantity = quantity;
//       }
//     },
//   },
//   actions: {
//     addToCart({ commit }, product) {
//       commit('ADD_TO_CART', product);
//     },
//     removeFromCart({ commit }, productId) {
//       commit('REMOVE_FROM_CART', productId);
//     },
//     updateCartQuantity({ commit }, payload) {
//       commit('UPDATE_CART_QUANTITY', payload);
//     },
//   },
//   getters: {
//     cartItems: (state) => state.cart,
//     cartTotalPrice: (state) =>
//       state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
//   },
// });

// ----------------------this above version was for vue 2, the below one is for vue3---------------------
// src/store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state: {
    cart: [],
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
});

export default store;
