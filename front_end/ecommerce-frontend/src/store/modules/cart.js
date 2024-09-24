// const state = {
//   cartItems: []
// };

// const mutations = {
//   ADD_TO_CART(state, product) {
//     const existingItem = state.cartItems.find(item => item.id === product.id);
//     if (existingItem) {
//       existingItem.quantity++;
//     } else {
//       state.cartItems.push({ ...product, quantity: 1 });
//     }
//   },
//   REMOVE_FROM_CART(state, productId) {
//     state.cartItems = state.cartItems.filter(item => item.id !== productId);
//   },
//   UPDATE_CART_QUANTITY(state, { productId, quantity }) {
//     const item = state.cartItems.find(item => item.id === productId);
//     if (item) {
//       // Use Vue.set or reassign to ensure reactivity
//       item.quantity = quantity;
//     }
//   }
// };

// const actions = {
//   addToCart({ commit }, product) {
//     commit('ADD_TO_CART', product);
//   },
//   removeFromCart({ commit }, productId) {
//     commit('REMOVE_FROM_CART', productId);
//   },
//   updateCartQuantity({ commit }, { productId, quantity }) {
//     commit('UPDATE_CART_QUANTITY', { productId, quantity });
//   }
// };

// const getters = {
//   cartItems: (state) => state.cartItems,
//   cartTotalPrice: (state) =>
//     state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
// };

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions,
//   getters,
// };


























// const state = {
//   cartItems: []
// };

// const mutations = {
//   ADD_TO_CART(state, product) {
//     const existingItem = state.cartItems.find(item => item.id === product.id);
//     if (existingItem) {
//       existingItem.quantity += 1;
//     } else {
//       state.cartItems.push({ ...product, quantity: 1 });
//     }
//   },
//   REMOVE_FROM_CART(state, productId) {
//     const index = state.cartItems.findIndex(item => item.id === productId);
//     if (index !== -1) {
//       state.cartItems.splice(index, 1);
//     }
//   },
//   UPDATE_CART_QUANTITY(state, { productId, quantity }) {
//     const item = state.cartItems.find(item => item.id === productId);
//     if (item) {
//       item.quantity = quantity;
//     }
//   }
// };

// const actions = {
//   addToCart({ commit }, product) {
//     commit('ADD_TO_CART', product);
//   },
//   removeFromCart({ commit }, productId) {
//     commit('REMOVE_FROM_CART', productId);
//   },
//   updateCartQuantity({ commit }, { productId, quantity }) {
//     commit('UPDATE_CART_QUANTITY', { productId, quantity });
//   }
// };

// const getters = {
//   cartItems: (state) => state.cartItems,
//   cartTotalPrice: (state) =>
//     state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
// };

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions,
//   getters,
// };

import { reactive } from 'vue'

const state = reactive({
  cartItems: []
});

const mutations = {
  ADD_TO_CART(state, product) {
    const existingItem = state.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      state.cartItems.push({ ...product, quantity: 1 });
    }
  },
  REMOVE_FROM_CART(state, productId) {
    const index = state.cartItems.findIndex(item => item.id === productId);
    if (index !== -1) {
      state.cartItems.splice(index, 1);
    }
  },
  UPDATE_CART_QUANTITY(state, { productId, quantity }) {
    const item = state.cartItems.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }
};

const actions = {
  addToCart({ commit }, product) {
    commit('ADD_TO_CART', product);
  },
  removeFromCart({ commit }, productId) {
    commit('REMOVE_FROM_CART', productId);
  },
  updateCartQuantity({ commit }, { productId, quantity }) {
    commit('UPDATE_CART_QUANTITY', { productId, quantity });
  }
};

const getters = {
  cartItems: (state) => state.cartItems,
  cartTotalPrice: (state) =>
    state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};