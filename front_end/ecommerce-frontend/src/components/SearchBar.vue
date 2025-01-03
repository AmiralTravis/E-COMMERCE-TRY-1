<!-- /components/SearchBar.vue -->
<template>
  <div class="search-container" @click.stop>
    <div class="search-wrapper">
      <!-- Main search input -->
      <div class="search-input-wrapper">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search products..."
          @focus="handleFocus"
          @keyup.enter="handleSearch"
          @input="handleInput"
          ref="searchInput"
        >
        <button class="search-button" @click="handleSearch">
          <span class="search-icon">🔍</span>
        </button>
      </div>

      <!-- Dropdown for suggestions and filters -->
      <div v-if="showDropdown" class="search-dropdown">
        <!-- Recent searches -->
        <div v-if="!searchQuery && recentSearches.length" class="recent-searches">
          <h3>Recent Searches</h3>
          <ul>
            <li v-for="search in recentSearches" 
                :key="search.query" 
                @click="selectRecentSearch(search)">
              <span class="history-icon">⏱️</span>
              {{ search.query }}
              <button class="remove-history" @click.stop="removeFromHistory(search)">×</button>
            </li>
          </ul>
        </div>

        <!-- Live suggestions -->
        <div v-if="searchQuery && suggestions.length" class="suggestions">
          <h3>Suggestions</h3>
          <ul>
            <li v-for="suggestion in suggestions" 
                :key="suggestion.id" 
                @click="selectSuggestion(suggestion)">
              <span class="suggestion-icon">🏷️</span>
              {{ suggestion.name }}
              <span class="suggestion-category">in {{ suggestion.category }}</span>
            </li>
          </ul>
        </div>

        <!-- Advanced filters -->
        <div class="advanced-filters">
          <h3>Filters</h3>
          
          <!-- Categories -->
          <div class="category-filters">
            <select v-model="filters.mainCategory" class="main-category-select">
              <option value="">All Categories</option>
              <option v-for="cat in mainCategories" 
                      :key="cat.id" 
                      :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
            
            <div v-if="filters.mainCategory" class="subcategories">
              <label v-for="cat in subcategories" 
                     :key="cat.id" 
                     class="subcategory-checkbox">
                <input type="checkbox" 
                       v-model="filters.categories" 
                       :value="cat.id">
                {{ cat.name }}
              </label>
            </div>
          </div>

          <!-- Price range -->
          <div class="price-range">
            <input type="number" 
                   v-model="filters.minPrice" 
                   placeholder="Min Price"
                   min="0"
                   class="price-input">
            <span class="price-separator">-</span>
            <input type="number" 
                   v-model="filters.maxPrice" 
                   placeholder="Max Price"
                   min="0"
                   class="price-input">
          </div>

          <!-- Rating filter -->
          <div class="rating-filter">
            <select v-model="filters.minRating" class="rating-select">
              <option value="">Min Rating</option>
              <option v-for="n in 5" :key="n" :value="n">
                {{ n }}+ Stars
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useProductStore } from '../stores/products';
import { useCategoryStore } from '../stores/category';
import { useRouter } from 'vue-router';
import debounce from 'lodash/debounce';

export default defineComponent({
  name: 'SearchBar',
  
  setup() {
    const router = useRouter();
    const productStore = useProductStore();
    const categoryStore = useCategoryStore();
    
    // Refs
    const searchQuery = ref('');
    const showDropdown = ref(false);
    const searchInput = ref(null);
    const suggestions = ref([]);
    const recentSearches = ref([]);
    
    // Filters state
    const filters = ref({
      mainCategory: '',
      categories: [],
      minPrice: '',
      maxPrice: '',
      minRating: ''
    });

    // Computed
    const mainCategories = computed(() => categoryStore.mainCategories);
    const subcategories = computed(() => 
      categoryStore.categories.filter(c => !c.isMainCategory)
    );

    // Load recent searches from localStorage
    const loadRecentSearches = () => {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        recentSearches.value = JSON.parse(saved);
      }
    };

    // Save search to history
    const saveToHistory = (query) => {
      if (!query) return;
      
      const newRecent = {
        query,
        timestamp: Date.now()
      };
      
      recentSearches.value = [
        newRecent,
        ...recentSearches.value.filter(s => s.query !== query)
      ].slice(0, 5);
      
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
    };

    // Remove from history
    const removeFromHistory = (search) => {
      recentSearches.value = recentSearches.value.filter(s => s.query !== search.query);
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
    };

    // Fetch suggestions (debounced)
    const fetchSuggestions = debounce(async (query) => {
      if (!query || query.length < 2) {
        suggestions.value = [];
        return;
      }
      
      try {
        // Replace with your actual API call
        const response = await productStore.fetchSuggestions(query);
        suggestions.value = response.slice(0, 6); // Limit to 6 suggestions
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        suggestions.value = [];
      }
    }, 300);

    // Handle search execution
    // const handleSearch = () => {
    //   if (!searchQuery.value && !Object.values(filters.value).some(v => v)) {
    //     return;
    //   }

    //   saveToHistory(searchQuery.value);
      
    //   // Navigate to products page with search params
    //   router.push({
    //     path: '/products',
    //     query: {
    //       search: searchQuery.value || undefined,
    //       ...filters.value
    //     }
    //   });
      
    //   showDropdown.value = false;
    // };


    const handleSearch = () => {
      if (!searchQuery.value && !Object.values(filters.value).some(v => v)) {
        return;
      }

      saveToHistory(searchQuery.value);

      // Convert categories array to a comma-separated string
      const categoriesQuery = filters.value.categories.length 
        ? filters.value.categories.join(',') 
        : undefined;

      // Navigate to products page with search params
      router.push({
        path: '/products',
        query: {
          search: searchQuery.value || undefined,
          categories: categoriesQuery,
          minPrice: filters.value.minPrice || undefined,
          maxPrice: filters.value.maxPrice || undefined,
          minRating: filters.value.minRating || undefined
        }
      });

      showDropdown.value = false;
    };

    // Input handlers
    const handleInput = () => {
      if (searchQuery.value.length >= 2) {
        suggestions.value = productStore.getProducts.filter(p => 
          p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        ).slice(0, 6);
      } else {
        suggestions.value = [];
      }
    };

    const handleFocus = () => {
      showDropdown.value = true;
    };

    const selectSuggestion = (suggestion) => {
      searchQuery.value = suggestion.name;
      handleSearch();
    };

    const selectRecentSearch = (search) => {
      searchQuery.value = search.query;
      handleSearch();
    };

    // Close dropdown when clicking outside
    const closeDropdown = (e) => {
      if (!e.target.closest('.search-container')) {
        showDropdown.value = false;
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      document.addEventListener('click', closeDropdown);
      loadRecentSearches();
      categoryStore.fetchCategories();
    });

    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown);
    });

    return {
      searchQuery,
      searchInput,
      showDropdown,
      suggestions,
      recentSearches,
      filters,
      mainCategories,
      subcategories,
      handleSearch,
      handleInput,
      handleFocus,
      selectSuggestion,
      selectRecentSearch,
      removeFromHistory
    };
  }
});
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-wrapper {
  width: 100%;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input-wrapper input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-button {
  padding: 12px 20px;
  background: #3b82f6;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background: #2563eb;
}

.search-icon {
  font-size: 18px;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 50;
  max-height: 80vh;
  overflow-y: auto;
}

.search-dropdown h3 {
  padding: 12px 16px;
  margin: 0;
  color: #4b5563;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
}

.suggestions ul,
.recent-searches ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.suggestions li,
.recent-searches li {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.suggestions li:hover,
.recent-searches li:hover {
  background: #f3f4f6;
}

.suggestion-category {
  font-size: 12px;
  color: #6b7280;
  margin-left: auto;
}

.remove-history {
  margin-left: auto;
  padding: 2px 6px;
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 16px;
}

.remove-history:hover {
  color: #ef4444;
}

.advanced-filters {
  padding: 16px;
  border-top: 1px solid #e2e8f0;
}

.category-filters,
.price-range,
.rating-filter {
  margin-bottom: 16px;
}

.main-category-select,
.rating-select,
.price-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.subcategories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  margin-top: 8px;
}

.subcategory-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-separator {
  color: #6b7280;
}

.price-input {
  flex: 1;
}
</style>