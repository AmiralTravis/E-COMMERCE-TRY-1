<!-- components/SubHeader.vue -->
<template>
    <div 
      class="bg-[#04221F]/90 text-gray-100 py-0 shadow-md duration-0"
     
    >
      <div class="max-w-7xl mx-auto px-4">
        <!-- Main Categories -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6 overflow-x-auto scrollbar-hide">
            <div 
              v-for="category in mainCategories" 
              :key="category.id"
              class="group relative cursor-pointer whitespace-nowrap"
              @mouseenter="activeCategory = category.id"
              @mouseleave="activeCategory = null"
            >
              <div class="flex items-center space-x-1 py-2">
                <span>{{ category.name }}</span>
                <svg v-if="category.subCategories" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              <!-- Dropdown for subcategories -->
              <div 
                v-if="category.subCategories && activeCategory === category.id"
                class="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 z-50"
                @mouseenter="activeCategory = category.id"
                @mouseleave="activeCategory = null"
              >
                <router-link
                  v-for="subCat in category.subCategories"
                  :key="subCat.id"
                  :to="{ path: '/products', query: { category: subCat.id }}"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  {{ subCat.name }}
                </router-link>
              </div>
            </div>
          </div>
  
          <!-- Quick Filters -->
          <div class="flex items-center space-x-4">
            <button 
              v-for="filter in quickFilters" 
              :key="filter.id"
              @click="toggleFilter(filter.id)"
              class="px-3 py-1 rounded-full text-sm transition-colors"
              :class="activeFilters.includes(filter.id) ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'"
            >
              {{ filter.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useFilterStore } from '../stores/useFilterStore';
  
  const filterStore = useFilterStore();
  const activeCategory = ref(null);
  const showSubHeader = ref(true);
  const lastScrollPosition = ref(0);
  const activeFilters = ref([]);
  
  // Sample data - Replace with your actual data from API/store
  const mainCategories = ref([
    {
      id: 1,
      name: 'Electronics',
      subCategories: [
        { id: 'phones', name: 'Phones' },
        { id: 'laptops', name: 'Laptops' },
        { id: 'accessories', name: 'Accessories' }
      ]
    },
    {
      id: 2,
      name: 'Clothing',
      subCategories: [
        { id: 'mens', name: "Men's Wear" },
        { id: 'womens', name: "Women's Wear" },
        { id: 'kids', name: "Kids' Wear" }
      ]
    },
    { id: 3, name: 'New Arrivals' },
    { id: 4, name: 'Sale' },
    { id: 5, name: 'Trending' }
  ]);
  
  const quickFilters = ref([
    { id: 'new', name: '🆕 New' },
    { id: 'sale', name: '🏷️ On Sale' },
    { id: 'popular', name: '🔥 Popular' },
    { id: 'featured', name: '⭐ Featured' }
  ]);
  
  const toggleFilter = (filterId) => {
    const index = activeFilters.value.indexOf(filterId);
    if (index === -1) {
      activeFilters.value.push(filterId);
    } else {
      activeFilters.value.splice(index, 1);
    }
    filterStore.updateFilters({ quickFilters: activeFilters.value });
  };
  
  // Hide/show subheader on scroll
  const handleScroll = () => {
    const currentScrollPosition = window.scrollY;
    
    if (currentScrollPosition < 0) {
      return;
    }
    
    // Show/hide based on scroll direction
    if (Math.abs(currentScrollPosition - lastScrollPosition.value) < 60) {
      return;
    }
  
    showSubHeader.value = currentScrollPosition < lastScrollPosition.value;
    lastScrollPosition.value = currentScrollPosition;
  };
  
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  </script>
  
  <style scoped>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  </style>
  
