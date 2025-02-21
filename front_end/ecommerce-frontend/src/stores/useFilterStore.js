// stores/useFilterStore.js
import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filter', {
  state: () => ({
    filters: {
      rating: [],
      minPrice: 0,
      maxPrice: 5000,
      categories: [],
      discountRanges: [{ min: 0, max: 100 }], // Custom range filter
    },
    searchQuery: '',
  }),
  actions: {
    setFilters(newFilters) {
      this.filters = {
        ...this.filters,
        ...newFilters,
        discountRanges: newFilters.discountRanges || this.filters.discountRanges

      };
      this.saveFiltersToSessionStorage();
    },

    resetFilters() {
      console.log("resetFilter was called..");
      this.filters = {
        rating: [],
        minPrice: 0,
        maxPrice: 5000,
        categories: [],
        discountRanges: [{ min: 0, max: 100 }], // Reset discount ranges
      };
      this.searchQuery = '';
      this.saveFiltersToSessionStorage();
    },

    setDiscountRanges(ranges) {
      this.filters.discountRanges = ranges;
      this.saveFiltersToSessionStorage(); // Persist to session storage
    },

    saveFiltersToSessionStorage() {
      sessionStorage.setItem('productListState', JSON.stringify({
        filters: this.filters,
        searchQuery: this.searchQuery,
      }));
    },

    
    loadFiltersFromSessionStorage() {
      const saved = sessionStorage.getItem('productListState');
      if (saved) {
        try {
          const { filters: savedFilters, searchQuery } = JSON.parse(saved);
          this.filters = { 
            ...this.$state.filters, // Initial state
            ...savedFilters,
            discountRanges: savedFilters.discountRanges || [{ min: 0, max: 100 }]
          };
          this.searchQuery = searchQuery;
        } catch (error) {
          console.error("Error parsing stored filters:", error);
          this.resetFilters();
        }
      }
    }
  },
});