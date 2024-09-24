// // store/modules/cart.js
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

// store/modules/cart.js
const state = {
  cartItems: []
};

const mutations = {
  ADD_TO_CART(state, product) {
    const existingItem = state.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      state.cartItems.push({ ...product, quantity: 1 });
    }
  },
  REMOVE_FROM_CART(state, productId) {
    state.cartItems = state.cartItems.filter(item => item.id !== productId);
  },
  UPDATE_CART_QUANTITY(state, { productId, quantity }) {
    const item = state.cartItems.find(item => item.id === productId);
    if (item && quantity > 0) {
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
    if (quantity > 0) {
      commit('UPDATE_CART_QUANTITY', { productId, quantity });
    }
  }
};

const getters = {
  cartItems: (state) => state.cartItems,
  cartTotalPrice: (state) =>
    state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
