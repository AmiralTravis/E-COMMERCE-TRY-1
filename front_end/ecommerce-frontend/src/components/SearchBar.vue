<!-- components/SearchBar.vue -->
<!-- <template>
    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          @focus="showResults = true"
          placeholder="Search products..."
          class="search-input"
        />
        <span v-if="isSearching" class="search-loading">🔍</span>
      </div> -->
  
      <!-- Search Results Dropdown -->
      <!-- <div v-if="showResults && (searchResults.length > 0 || isSearching)" class="search-results">
        <div v-if="isSearching" class="searching-message">
          Searching...
        </div>
        <template v-else>
          <router-link
            v-for="result in searchResults"
            :key="result.objectID"
            :to="`/products/${result.objectID}`"
            class="search-result-item"
            @click="hideResults"
          >
            <div class="result-image">
              <img :src="result.imageUrl" :alt="result.name" v-if="result.imageUrl">
              <div v-else class="placeholder-image">No image</div>
            </div>
            <div class="result-info">
              <div class="result-name">{{ result.name }}</div>
              <div class="result-price">${{ result.price }}</div>
            </div>
          </router-link>
        </template>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { useSearchStore } from '../stores/search';
  import debounce from 'lodash/debounce';
  
  const searchStore = useSearchStore();
  const searchQuery = ref('');
  const showResults = ref(false);
  
  const handleSearch = debounce(async () => {
    await searchStore.search(searchQuery.value);
  }, 300);
  
  const hideResults = () => {
    showResults.value = false;
    searchQuery.value = '';
    searchStore.clearSearch();
  };
  
  // Close results when clicking outside
  const handleClickOutside = (event) => {
    if (!event.target.closest('.search-container')) {
      hideResults();
    }
  };
  
  // Add/remove click outside listener
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
  
  const searchResults = computed(() => searchStore.searchResults);
  const isSearching = computed(() => searchStore.isSearching);
  </script>
  
  <style scoped>
  .search-container {
    position: relative;
    width: 300px;
  }
  
  .search-input-wrapper {
    position: relative;
  }
  
  .search-input {
    width: 100%;
    padding: 8px 32px 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .search-loading {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 4px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .search-result-item {
    display: flex;
    padding: 8px;
    text-decoration: none;
    color: inherit;
    border-bottom: 1px solid #eee;
  }
  
  .search-result-item:hover {
    background-color: #f5f5f5;
  }
  
  .result-image {
    width: 50px;
    height: 50px;
    margin-right: 12px;
  }
  
  .result-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .placeholder-image {
    width: 100%;
    height: 100%;
    background: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #666;
    border-radius: 4px;
  }
  
  .result-info {
    flex: 1;
  }
  
  .result-name {
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  .result-price {
    color: #666;
    font-size: 14px;
  }
  
  .searching-message {
    padding: 12px;
    text-align: center;
    color: #666;
  }
  </style> -->