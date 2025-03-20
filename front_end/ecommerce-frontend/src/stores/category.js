// /stores/category.js

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
      state.categories.filter(c => c.parentId === mainCategoryId),
    flatCategories: (state) => {
      const flatten = (categories, parent = null) => 
        categories.reduce((acc, category) => [
          ...acc,
          { ...category, parentId: parent?.id || null },
          ...flatten(category.children || [], category)
        ], [])
      
      return flatten(state.categories)
    }
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