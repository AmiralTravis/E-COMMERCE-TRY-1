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
    async fetchProducts() {
      console.log('Fetching products...');
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/products');
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
    }
  },

  getters: {
    getProducts: (state) => state.products,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});