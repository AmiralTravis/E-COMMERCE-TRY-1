// src/stores/products.js

import { defineStore } from 'pinia';
import api from '../services/api';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts(searchQuery = '') {
      console.log('Fetching products with search query:', searchQuery);
      this.loading = true;
      this.error = null;
      try {
        let response;
        if (searchQuery) {
          response = await api.get('/products/search', {
            params: { query: searchQuery }
          });
        } else {
          response = await api.get('/products');
        }
        console.log('Products fetched:', response.data);
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = error.response?.data?.message || 'Failed to load products';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearProducts() {
      this.products = [];
      this.error = null;
    },

    async searchProducts(query) {
      console.log('Searching products with query:', query);
      return this.fetchProducts(query);
    }
  },

  getters: {
    getProducts: (state) => state.products,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});