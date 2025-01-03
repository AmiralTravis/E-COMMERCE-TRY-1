// import { defineStore } from 'pinia';
// import api from '../services/api';

// export const useCategoryStore = defineStore('categories', {
//   state: () => ({
//     categories: [], // This was initialized correctly but might be getting non-array data
//     mainCategories: []
//   }),
  
//   actions: {
//     async fetchCategories() {
//       try {
//         const response = await api.get('/categories');
//         // Ensure we're setting an array
//         this.categories = Array.isArray(response.data) ? response.data : [];
//         this.mainCategories = this.categories.filter(c => c.isMainCategory);
//       } catch (error) {
//         console.error('Failed to fetch categories:', error);
//         this.categories = [];
//         this.mainCategories = [];
//       }
//     }
//   }
// });

// // stores/category.js

import { defineStore } from 'pinia';
import api from '../services/api';

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    categories: [],
    mainCategories: [],
    isLoading: false,
    error: null
  }),
  
  getters: {
    getMainCategories: (state) => state.mainCategories,
    getSubcategories: (state) => (mainCategoryId) => 
      state.categories.filter(c => c.parentId === mainCategoryId)
  },

  actions: {
    async fetchCategories() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get('/categories');
        const categoriesData = Array.isArray(response.data) ? response.data : [];
        
        this.categories = categoriesData;
        this.mainCategories = categoriesData.filter(c => !c.parentId || c.isMainCategory);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        this.error = error.message;
        this.categories = [];
        this.mainCategories = [];
      } finally {
        this.isLoading = false;
      }
    }
  }
});