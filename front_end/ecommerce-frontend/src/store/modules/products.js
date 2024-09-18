// store/modules/products.js
import axios from 'axios';

const state = {
  products: [],
  product: {},
  loading: false,
  error: null,
};

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products;
  },
  SET_PRODUCT(state, product) {
    state.product = product;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchProducts({ commit }) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.get('/products'); // Adjust API endpoint if needed
      commit('SET_PRODUCTS', response.data);
    } catch (error) {
      commit('SET_ERROR', 'Failed to load products');
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchProductDetails({ commit }, productId) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.get(`/products/${productId}`);
      commit('SET_PRODUCT', response.data);
    } catch (error) {
      commit('SET_ERROR', 'Failed to load product details');
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

const getters = {
  products: (state) => state.products,
  product: (state) => state.product,
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
