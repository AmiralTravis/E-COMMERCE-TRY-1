// // src/stores/products.js

// import { defineStore } from 'pinia';
// import api from '../services/api';

// export const useProductStore = defineStore('products', {
//   state: () => ({
//     products: [],
//     currentProduct: null,
//     reviews: [],
//     loading: false,
//     error: null,
//   }),

//   actions: {
//     async fetchProducts(searchQuery = '') {
//       console.log('Fetching products with search query:', searchQuery);
//       this.loading = true;
//       this.error = null;
//       try {
//         let response;
//         if (searchQuery) {
//           response = await api.get('/products/search', {
//             params: { query: searchQuery }
//           });
//         } else {
//           response = await api.get('/products');
//         }
//         console.log('Products fetched:', response.data);
//         this.products = response.data;
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         this.error = error.response?.data?.message || 'Failed to load products';
//         throw error;
//       } finally {
//         this.loading = false;
//       }
//     },

//     async fetchProduct(productId) {
//       console.log('Fetching product with ID:', productId);
//       this.loading = true;
//       this.error = null;
//       try {
//         const response = await api.get(`/products/${productId}`);
//         console.log('Product fetched:', response.data);
//         this.currentProduct = response.data;
//         return this.currentProduct;
//       } catch (error) {
//         console.error('Error fetching product:', error);
//         this.error = error.response?.data?.message || 'Failed to load product';
//         throw error;
//       } finally {
//         this.loading = false;
//       }
//     },

//     async fetchReviews(productId) {
//       console.log('Fetching reviews for product ID:', productId);
//       this.loading = true;
//       this.error = null;
//       try {
//         const response = await api.get(`/products/${productId}/reviews`);
//         console.log('Reviews fetched:', response.data);
//         this.reviews = response.data;
//         return this.reviews;
//       } catch (error) {
//         console.error('Error fetching reviews:', error);
//         this.error = error.response?.data?.message || 'Failed to load reviews';
//         throw error;
//       } finally {
//         this.loading = false;
//       }
//     },

//     clearProducts() {
//       this.products = [];
//       this.error = null;
//     },

//     async searchProducts(query) {
//       console.log('Searching products with query:', query);
//       return this.fetchProducts(query);
//     }
//   },

//   getters: {
//     getProducts: (state) => state.products,
//     getCurrentProduct: (state) => state.currentProduct,
//     getReviews: (state) => state.reviews,
//     isLoading: (state) => state.loading,
//     getError: (state) => state.error,
//   },
// });
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
      minRating: null
    },
    suggestions: [],
    recentSearches: []
  }),

  actions: {

    async fetchProducts(params = {}) {
      this.loading = true;
      this.error = null;
    
      try {
        const queryParams = {
          page: this.pagination.page,
          ...this.filters,
          ...params
        };
    
        // Remove undefined or null values from queryParams
        Object.keys(queryParams).forEach(key => 
          queryParams[key] == null && delete queryParams[key]
        );
    
        const response = await api.get('/products/search', { params: queryParams });
    
        this.products = response.data.results;
        this.pagination = {
          page: response.data.page,
          totalPages: response.data.totalPages,
          total: response.data.total
        };
    
        return this.products;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to load products';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchProduct(productId) {
      this.loading = true;
      try {
        const response = await api.get(`/products/${productId}`);
        this.currentProduct = response.data;
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
    isLoading: state => state.loading,
    getError: state => state.error,
    getPagination: state => state.pagination,
    getFilters: state => state.filters
  }
});