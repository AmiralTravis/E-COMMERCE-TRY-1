// src/stores/products.js

import { defineStore } from 'pinia';
import api from '../services/api';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    currentProduct: null,
    reviews: [],
    topReviews: [], // New state for top reviews
    loading: false,
    error: null,
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0
    },
    filters: {
      query: '',
      categories: [],
      minPrice: null,
      maxPrice: null,
      minRating: null,
      discountRanges: [] // Add discountRanges here

    },
    suggestions: [],
    recentSearches: [],

    latestProducts: [],
    latestProductsLoading: false,
    latestProductsError: null,
    topProducts: [], // Add this line


  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
    
      try {
        const queryParams = { ...this.filters }; // Create a copy of the filters
    
        // // Remove any null or undefined values from the query parameters
        // for (const key in queryParams) {
        //   if (queryParams[key] === null || queryParams[key] === undefined || (Array.isArray(queryParams[key]) && queryParams[key].length === 0)) {
        //     delete queryParams[key];
        //   }
        // }
        
        // Stringify discountRanges if present
        // if (queryParams.discountRanges) {
        //   queryParams.discountRanges = JSON.stringify(queryParams.discountRanges);
        // }
        if (queryParams.discountRanges && queryParams.discountRanges.length > 0) {
          queryParams.discountRanges = JSON.stringify(queryParams.discountRanges);
        }

        // Remove empty values
        Object.keys(queryParams).forEach(key => {
          if (queryParams[key] === null || 
              queryParams[key] === undefined || 
              (Array.isArray(queryParams[key]) && queryParams[key].length === 0)) {
            delete queryParams[key];
          }
        });

        const response = await api.get('/products/search', { params: queryParams }); // Pass queryParams to the API request
        this.products = response.data.results;
        this.pagination.total = response.data.total;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to load products';
        // Consider re-throwing the error if you want the component to handle it:
        // throw error; 
      } finally {
        this.loading = false;
      }
    },

    
    async fetchProduct(productId) {
      this.loading = true;
      try {
        const response = await api.get(`/products/${productId}`);
        const product = response.data;
    
        // Ensure all required fields are present
        this.currentProduct = {
          ...product,
          image: product.image || '/images/placeholder-product.jpg', // Fallback image
          price: product.price || 0,
          discountedPrice: product.discountedPrice || null,
          discountedPercentage: product.discountedPercentage || null,
          avgRating: product.avgRating || 0,
          reviewCount: product.reviewCount || 0
        };
    
        return this.currentProduct;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to load product';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchReviews(productId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/products/${productId}/reviews`);
        this.reviews = response.data;
        return this.reviews;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to load reviews';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    
    async fetchTopReviews(productId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/reviews/top-reviews/${productId}`, {
          params: {
            limit: 8 // Fetch top 8 reviews
          }
        });
    
        // Ensure all required fields are present
        this.topReviews = response.data.map(review => ({
          ...review,
          updatedAt: review.updatedAt || new Date().toISOString(), // Fallback date
          username: review.User?.username || 'Anonymous',
          profilePicUrl: review.User?.profilePicUrl || '/images/default-profile.jpg',
          rating: review.rating || 0
        }));
    
        return this.topReviews;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to load top reviews';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchSuggestions(query) {
      if (!query || query.length < 2) return [];
      
      try {
        // For now, we'll filter the existing products as suggestions
        // Later you can replace this with a proper API endpoint
        const response = await this.fetchProducts({ 
          query,
          limit: 6
        });
        
        return response.map(product => ({
          id: product.id,
          name: product.name,
          category: product.Categories?.[0]?.name || 'General'
        }));
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        return [];
      }
    },

    async fetchTopProducts() {
      this.loading = true;
      try {
        const response = await api.get('/products/top/products', {
          params: {
            limit: 15,
            sort: '-rating,-reviewCount' // Sort by rating descending, then reviewCount descending
          }
        });
        this.topProducts = response.data.map(product => ({
          ...product,
          // Ensure we have all required fields
          image: product.image || '/images/placeholder-product.jpg',
          rating: product.rating || 0,
          reviewCount: product.reviewCount || 0,
          price: product.price || 0,
          discountedPrice: product.discountedPrice || null,
          discountedPercentage: product.discountedPercentage || null
        }));
        return this.topProducts;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to load top products';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchLatestProducts(limit = 15) {
      this.latestProductsLoading = true;
      this.latestProductsError = null;

      try {
        const response = await api.get('/products/latest', { params: { limit } });
        this.latestProducts = response.data;
      } catch (error) {
        this.latestProductsError = error.response?.data?.message || 'Failed to load latest products';
        console.error('Error fetching latest products:', error);
      } finally {
        this.latestProductsLoading = false;
      }
    },

    // Local storage methods for recent searches
    loadRecentSearches() {
      try {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
          this.recentSearches = JSON.parse(saved);
        }
      } catch (error) {
        console.error('Failed to load recent searches:', error);
        this.recentSearches = [];
      }
    },

    saveRecentSearch(query) {
      if (!query) return;
      
      const newSearch = {
        query,
        timestamp: Date.now()
      };

      this.recentSearches = [
        newSearch,
        ...this.recentSearches.filter(s => s.query !== query)
      ].slice(0, 5);

      try {
        localStorage.setItem('recentSearches', 
          JSON.stringify(this.recentSearches)
        );
      } catch (error) {
        console.error('Failed to save recent search:', error);
      }
    },
    // --------------------

    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
      this.pagination.page = 1;
      return this.fetchProducts();
    },

    resetFilters() {
      this.filters = {
        query: '',
        categories: [],
        minPrice: null,
        maxPrice: null,
        minRating: null
      };
      return this.fetchProducts();
    },

    setPage(page) {
      this.pagination.page = page;
      return this.fetchProducts();
    },

    clearProducts() {
      this.products = [];
      this.error = null;
    }
  },

  getters: {
    getProducts: state => state.products,
    getCurrentProduct: state => state.currentProduct,
    getReviews: state => state.reviews,
    getTopReviews: state => state.topReviews, // New getter for top reviews
    isLoading: state => state.loading,
    getError: state => state.error,
    getPagination: state => state.pagination,
    getFilters: state => state.filters,

    getLatestProducts: (state) => state.latestProducts,
    isLatestProductsLoading: (state) => state.latestProductsLoading,
    getLatestProductsError: (state) => state.latestProductsError,
  }
});
