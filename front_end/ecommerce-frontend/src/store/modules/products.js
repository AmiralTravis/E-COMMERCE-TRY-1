// import axios from 'axios';

// const state = {
//   products: [],
//   product: {},
//   loading: false,
//   error: null,
// };

// const mutations = {
//   SET_PRODUCTS(state, products) {
//     console.log('Setting products:', products);
//     state.products = products;
//   },
//   SET_LOADING(state, loading) {
//     state.loading = loading;
//   },
//   SET_ERROR(state, error) {
//     state.error = error;
//   },
// };

// const actions = {
//   async fetchProducts({ commit, state }) {
//     console.log('Fetching products...');
//     if (state.products.length > 0) {
//       console.log('Products already in state:', state.products);
//       return;
//     }
//     commit('SET_LOADING', true);
//     commit('SET_ERROR', null);
//     try {
//       const response = await axios.get('http://localhost:5000/api/products');
//       console.log('Products fetched:', response.data);
//       commit('SET_PRODUCTS', response.data);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       commit('SET_ERROR', 'Failed to load products');
//     } finally {
//       commit('SET_LOADING', false);
//     }
//   },
// };

// const getters = {
//   products: (state) => state.products,
//   loading: (state) => state.loading,
//   error: (state) => state.error,
// };

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions,
//   getters,
// };






// import axios from 'axios';

// const state = {
//   products: [],
//   loading: false,
//   error: null,
// };

// const mutations = {
//   SET_PRODUCTS(state, products) {
//     console.log('Setting products:', products);
//     state.products = products;
//   },
//   SET_LOADING(state, loading) {
//     state.loading = loading;
//   },
//   SET_ERROR(state, error) {
//     state.error = error;
//   },
// };

// const actions = {
//   async fetchProducts({ commit, state }) {
//     console.log('Fetching products...');
//     if (state.products.length > 0) {
//       console.log('Products already in state:', state.products);
//       return;
//     }
//     commit('SET_LOADING', true);
//     commit('SET_ERROR', null);
//     try {
//       const response = await axios.get('http://localhost:5000/api/products');
//       console.log('Products fetched:', response.data);
//       commit('SET_PRODUCTS', response.data);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       commit('SET_ERROR', 'Failed to load products');
//       throw error;
//     } finally {
//       commit('SET_LOADING', false);
//     }
//   },
// };

// const getters = {
//   products: (state) => state.products,
//   loading: (state) => state.loading,
//   error: (state) => state.error,
// };

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions,
//   getters,
// };

import axios from 'axios';

const state = {
  products: [],
  loading: false,
  error: null,
};

const mutations = {
  SET_PRODUCTS(state, products) {
    console.log('Setting products:', products);
    state.products = products;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchProducts({ commit, state }) {
    console.log('Fetching products...');
    if (state.products.length > 0) {
      console.log('Products already in state:', state.products);
      return;
    }
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      console.log('Products fetched:', response.data);
      commit('SET_PRODUCTS', response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      commit('SET_ERROR', 'Failed to load products');
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

const getters = {
  products: (state) => state.products,
  loading: (state) => state.loading,
  error: (state) => state.error,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};