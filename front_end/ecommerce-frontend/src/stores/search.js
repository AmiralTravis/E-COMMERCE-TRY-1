// // stores/search.js
// import { defineStore } from 'pinia';
// import { searchProducts } from '../utils/algolia';

// export const useSearchStore = defineStore('search', {
//   state: () => ({
//     searchResults: [],
//     isSearching: false,
//     searchQuery: '',
//   }),

//   actions: {
//     async search(query) {
//       if (!query.trim()) {
//         this.searchResults = [];
//         return;
//       }

//       this.isSearching = true;
//       try {
//         this.searchResults = await searchProducts(query);
//       } catch (error) {
//         console.error('Search error:', error);
//         this.searchResults = [];
//       } finally {
//         this.isSearching = false;
//       }
//     },

//     clearSearch() {
//       this.searchResults = [];
//       this.searchQuery = '';
//     }
//   }
// });