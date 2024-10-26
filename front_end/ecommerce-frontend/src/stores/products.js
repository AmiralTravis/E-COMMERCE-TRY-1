// src/stores/products.js

import { defineStore } from 'pinia';
import api from '../services/api';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    currentProduct: null,
    reviews: [],
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

    async fetchProduct(productId) {
      console.log('Fetching product with ID:', productId);
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/products/${productId}`);
        console.log('Product fetched:', response.data);
        this.currentProduct = response.data;
        return this.currentProduct;
      } catch (error) {
        console.error('Error fetching product:', error);
        this.error = error.response?.data?.message || 'Failed to load product';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchReviews(productId) {
      console.log('Fetching reviews for product ID:', productId);
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/products/${productId}/reviews`);
        console.log('Reviews fetched:', response.data);
        this.reviews = response.data;
        return this.reviews;
      } catch (error) {
        console.error('Error fetching reviews:', error);
        this.error = error.response?.data?.message || 'Failed to load reviews';
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
    getCurrentProduct: (state) => state.currentProduct,
    getReviews: (state) => state.reviews,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});