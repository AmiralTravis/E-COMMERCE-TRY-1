<!-- /components/SearchBar.vue -->
<template>
  <div class="search-container" @click.stop>
    <div class="search-wrapper">
      <!-- Main search input -->
      <div class="search-input-wrapper">
        <input
          class="input-box"
          type="text"
          v-model="searchQuery"
          placeholder="Search products..."
          @input="handleInput"
          @keyup.enter="handleSearch"
          @focus="handleFocus"
          @blur="handleBlur"
          ref="searchInput"
        />
        <button class="search-button" @click="handleSearch">
          <!-- Custom search icon -->
          <img src="@/assets/search-icon.png" alt="Search" class="search-icon" />
        </button>
      </div>

      <!-- Dropdown for suggestions and recent searches -->
      <div v-if="showDropdown" class="search-dropdown">
        <!-- Recent searches -->
        <div v-if="!searchQuery && recentSearches.length" class="recent-searches">
          <h3>Recent Searches</h3>
          <ul>
            <li
              v-for="search in recentSearches"
              :key="search.query"
              @mousedown="selectRecentSearch(search)"
            >
              <span class="history-icon">⏱️</span>
              {{ search.query }}
              <button class="remove-history" @mousedown.stop="removeFromHistory(search)">
                ×
              </button>
            </li>
          </ul>
        </div>

        <!-- Live suggestions -->
        <div v-if="searchQuery && suggestions.length" class="suggestions">
          <h3>Suggestions</h3>
          <ul>
            <li
              v-for="suggestion in suggestions"
              :key="suggestion.id"
              @mousedown="selectSuggestion(suggestion)"
            >
              <span class="suggestion-icon">🏷️</span>
              {{ suggestion.name }}
              <span class="suggestion-category">
                in {{ suggestion.Categories?.[0]?.name || 'General' }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../stores/products';
import Fuse from 'fuse.js'; // Import Fuse.js for fuzzy search
import debounce from 'lodash/debounce';

export default {
  name: 'SearchBar',
  setup() {
    const router = useRouter();
    const productStore = useProductStore();

    const searchQuery = ref('');
    const showDropdown = ref(false);
    const suggestions = ref([]);
    const recentSearches = ref([]);
    const searchInput = ref(null); // Reference to the input element

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

      const newSearch = { query, timestamp: Date.now() };
      recentSearches.value = [
        newSearch,
        ...recentSearches.value.filter(s => s.query !== query),
      ].slice(0, 5); // Keep only the last 5 searches

      localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
    };

    // Remove from history
    const removeFromHistory = (search) => {
      recentSearches.value = recentSearches.value.filter(s => s.query !== search.query);
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
    };

    // Debounced search input handler
    const handleInput = debounce(async () => {
      if (searchQuery.value.length >= 2) {
        try {
          // Use Fuse.js for fuzzy search suggestions
          const fuse = new Fuse(productStore.products, {
            keys: ['name', 'description'], // Search in name and description
            threshold: 0.3, // Adjust threshold for typo tolerance
            includeScore: true,
          });

          const results = fuse.search(searchQuery.value);
          suggestions.value = results.map(result => result.item).slice(0, 6); // Limit to 6 suggestions
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
          suggestions.value = [];
        }
      } else {
        suggestions.value = [];
      }
    }, 300);

    // Handle search execution
    const handleSearch = () => {
      if (searchQuery.value) {
        saveToHistory(searchQuery.value);
        router.push({ path: '/products', query: { search: searchQuery.value } });
      } else {
        router.push({ path: '/products' }); // Reset to no query
      }
      showDropdown.value = false; // Close dropdown
      searchInput.value.blur(); // Blur the input field to make it inactive
    };

    // Select a suggestion
    const selectSuggestion = (suggestion) => {
      searchQuery.value = suggestion.name;
      handleSearch();
    };

    // Select a recent search
    const selectRecentSearch = (search) => {
      searchQuery.value = search.query;
      handleSearch();
    };

    // Handle focus on input
    const handleFocus = () => {
      showDropdown.value = true; // Show dropdown when input is focused
    };

    // Handle blur on input
    const handleBlur = () => {
      setTimeout(() => {
        showDropdown.value = false; // Hide dropdown after a short delay
      }, 200);
    };

    // Load recent searches on mount
    onMounted(() => {
      loadRecentSearches();
    });

    return {
      searchQuery,
      showDropdown,
      suggestions,
      recentSearches,
      searchInput,
      handleInput,
      handleSearch,
      selectSuggestion,
      selectRecentSearch,
      removeFromHistory,
      handleFocus,
      handleBlur,
    };
  },
};
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.search-wrapper {
  width: 100%;
}

.input-box {
  background-color: rgb(219, 234, 211);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: rgb(168, 205, 148);
  border: 4px solid rgb(36, 70, 19);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: #137d09;
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
  background: rgb(138, 113, 72);
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background: #ae926c;
}

.search-icon {
  width: 25px; /* Adjust the size as needed */
  height: 25px; /* Adjust the size as needed */
  vertical-align: middle; /* Align the icon properly */
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
</style>