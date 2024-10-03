// import { createStore } from 'vuex';
// import products from './modules/products';
// import cart from './modules/cart';
// import auth from './modules/auth';

// // Create a plugin to update auth state
// const updateAuthPlugin = (store) => {
//   store.subscribe((mutation) => {
//     if (mutation.type.startsWith('auth/') && mutation.type !== 'auth/UPDATE_AUTH_STATE') {
//       // Force update of auth state, but avoid infinite loop
//       store.commit('auth/UPDATE_AUTH_STATE', null, { root: true });
//     }
//   });
// };

// const store = createStore({
//   modules: {
//     products,
//     cart,
//     auth,
//   },
//   plugins: [updateAuthPlugin],
// });

// export default store;


import { createStore } from 'vuex';
import products from './modules/products';
import cart from './modules/cart';
import auth from './modules/auth';

// Create a plugin to update auth state
const updateAuthPlugin = (store) => {
  store.subscribe((mutation) => {
    if (mutation.type.startsWith('auth/') && mutation.type !== 'auth/UPDATE_AUTH_STATE') {
      console.log('Auth mutation detected:', mutation.type); // Log the mutation type
      // Force update of auth state, but avoid infinite loop
      store.commit('auth/UPDATE_AUTH_STATE', null, { root: true });
    }
  });
};

const store = createStore({
  modules: {
    products,
    cart,
    auth,
  },
  plugins: [updateAuthPlugin],
});

export default store;
