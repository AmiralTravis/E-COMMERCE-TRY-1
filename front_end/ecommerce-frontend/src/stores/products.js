import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts() {
      console.log('Fetching products...');
      if (this.products.length > 0) {
        console.log('Products already in state:', this.products);
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        console.log('Products fetched:', response.data);
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'Failed to load products';
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    getProducts: (state) => state.products,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});