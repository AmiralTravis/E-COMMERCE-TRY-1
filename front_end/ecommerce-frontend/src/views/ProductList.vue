<!-- /views/ProductList.vue -->
<template>
  <div class="products-container">
    <!-- Side Panel -->
    <SidePanel
      :categories="categories"
      :initialFilters="{
        rating: selectedRatings.length > 0 ? selectedRatings[0] : 0,
        categories: selectedCategories,
        minPrice: minPrice,
        maxPrice: maxPrice,
      }"
      @apply-filters="applyFilters"
      @clear-filters="clearFilters"
    />

    <!-- Product List -->
    <div class="products-list">
      <!-- Display products -->
      <div v-for="product in paginatedProducts" :key="product.id" class="product-card">
        <div class="product-image-container">
          <img 
            :src="`${product.imageUrl}`" 
            :alt="product.name" 
            class="product-image" 
            loading="lazy"
          />
        </div>
        <div class="product-info">
          <a :href="`/products/${product.id}`" target="_blank" class="product-name">
            {{ product.name }}
          </a>
          <!-- Star Rating -->
          <div class="star-rating-container">
            <div class="star-rating" @mouseover="showRatingDistribution(product)" @mouseleave="hideRatingDistribution">
              <div class="stars flex gap-1">
                <span v-for="star in 5" :key="star" class="star text-xl">
                  <!-- Full Star -->
                  <span v-if="star <= Math.floor(product.avgRating)" class="full-star text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  <!-- Partial Star -->
                  <span v-else-if="star === Math.ceil(product.avgRating) && product.avgRating % 1 !== 0" class="partial-star">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <defs>
                        <linearGradient :id="`partial-star-gradient-${product.id}-${star}`" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stop-color="#f1c40f" />
                          <stop :offset="`${(product.avgRating % 1) * 100}%`" stop-color="#f1c40f" />
                          <stop :offset="`${(product.avgRating % 1) * 100}%`" stop-color="#ddd" />
                          <stop offset="100%" stop-color="#ddd" />
                        </linearGradient>
                      </defs>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" :fill="`url(#partial-star-gradient-${product.id}-${star})`" />
                    </svg>
                  </span>
                  <!-- Empty Star -->
                  <span v-else class="empty-star text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                </span>
              </div>
              <span class="rating-text">
                ({{ (Number(product.avgRating) || 0).toFixed(1) }})
              </span>
              <span class="review-count">
                {{ product.reviewCount || 0 }} reviews
              </span>
            </div>
            <!-- Rating Distribution Box -->
            <div v-if="hoveredProductId === product.id" class="rating-distribution-box">
              <div v-for="n in 5" :key="n" class="rating-bar">
                <span class="rating-label">{{ 6 - n }}★</span>
                <div class="bar-container">
                  <div class="bar" :style="{ width: `${(product.ratingDistribution?.[6 - n] / product.reviewCount) * 100 || 0}%` }"></div>
                </div>
                <span class="rating-count">{{ product.ratingDistribution?.[6 - n] || 0 }}</span>
              </div>
              <button @click="redirectToReviews(product.id)" class="see-details-btn">See Details</button>
            </div>
          </div>
          <!-- Delivery Date -->
          <p class="delivery-date">
            {{ product.price >= 100 ? 'Free delivery by' : 'Delivered by' }} {{ calculateDeliveryDate() }}
          </p>
          <p class="product-price">${{ product.price.toFixed(2) }}</p>
          <button @click="addToCart(product)" class="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-controls">
        <!-- Previous Button -->
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1" 
          class="pagination-button"
        >
          Previous
        </button>

        <!-- Page Buttons -->
        <button 
          v-for="page in visiblePages" 
          :key="page" 
          @click="goToPage(page)" 
          :class="{ active: currentPage === page }" 
          class="pagination-button"
        >
          {{ page }}
        </button>

        <!-- Next Button -->
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages" 
          class="pagination-button"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && filteredProducts.length === 0" class="empty-state">
      <p>No products found.</p>
    </div>

    <!-- Back to Top Button -->
    <button
      v-if="showBackToTop"
      @click="scrollToTop"
      class="back-to-top"
    >
      ↑
    </button>
  </div>
</template>


<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useProductStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import { useRoute, useRouter } from 'vue-router';
import { useReviewStore } from '@/stores/reviewStore';
import SidePanel from '../components/SidePanel.vue';
import Fuse from 'fuse.js';

export default {
  name: 'ProductList',
  components: {
    SidePanel,
  },
  props: {
    searchQuery: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const productStore = useProductStore();
    const cartStore = useCartStore();
    const reviewStore = useReviewStore();
    const route = useRoute();
    const router = useRouter();

    // Reactive variables
    const hoveredProductId = ref(null);
    const selectedRatings = ref([]);
    const minPrice = ref(0);
    const maxPrice = ref(5000);
    const selectedCategories = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(15);
    const isUpdatingURL = ref(false);
    const previousSearchQuery = ref(props.searchQuery); // Add this line
    const showBackToTop = ref(false); // For the "Back to Top" button

    // Categories data
    const categories = ref([
      {
        name: 'Electronics',
        children: ['Laptops', 'Smartphones', 'Wearables', 'Headphones', 'Cameras', 'Streaming Devices', 'Gaming Consoles', 'Printers', 'Speakers', 'Books & E-Readers'],
      },
      {
        name: 'Home Appliances',
        children: ['Kitchen Appliances', 'Air Purifiers', 'Vacuum Cleaners'],
      },
      {
        name: 'Furniture & Office Supplies',
        children: ['Ergonomic Chairs', 'Desks and Tables'],
      },
      {
        name: 'Fashion & Accessories',
        children: ['Clothing', 'Watches', 'Shoes', 'Bags'],
      },
      {
        name: 'Beauty & Health',
        children: ['Skin Care', 'Toothbrushes', 'Fitness Equipment'],
      },
      {
        name: 'Entertainment & Hobbies',
        children: ['Toys & Collectibles', 'Cutting Machines'],
      },
      {
        name: 'Outdoor & Travel',
        children: ['Camping Gear', 'Water Bottles', 'Pizza Ovens'],
      },
      {
        name: 'Smart Home & IoT',
        children: ['Video Doorbells', 'Security Cameras'],
      },
    ]);

    // Synonyms library
    const synonyms = {
      clothes: ['shirt', 'jacket', 'pants', 't-shirt', 'fleece', 'yoga pants', 'lululemon'],
      electronics: ['laptop', 'smartphone', 'headphones', 'camera', 'printer', 'tv', 'gaming'],
      gifts: ['lego', 'funko pop', 'watch', 'blender', 'air purifier', 'kindle'],
      home: ['oven', 'mixer', 'kettle', 'vacuum', 'air purifier', 'duffel bag'],
      fitness: ['fitbit', 'hoka', 'running shoes', 'yoga pants', 'peloton', 'garmin'],
      travel: ['backpack', 'duffel', 'jacket', 'hydro flask', 'patagonia'],
      kitchen: ['blender', 'mixer', 'kettle', 'instant pot', 'le creuset', 'ooni'],
      gaming: ['playstation', 'nintendo', 'xbox', 'gaming laptop', 'razer keyboard'],
      accessories: ['watch', 'headphones', 'earbuds', 'backpack', 'duffel', 'charger'],
      shoes: ['sneakers', 'running shoes', 'hoka', 'adidas', 'ultraboost'],
      bags: ['backpack', 'duffel', 'patagonia', 'north face', 'laptop bag'],
      laptop: ['notebook', 'macbook', 'chromebook', 'pc', 'computer'],
      iphone: ['apple phone', 'smartphone', 'cellphone', 'mobile'],
      mobiles: ['apple phone', 'smartphone', 'cellphone', 'iphone'],
      headphones: ['earphones', 'earbuds', 'bluetooth headphones', 'noise cancelling headphones'],
      earphones: ['earbuds', 'bluetooth headphones', 'noise cancelling headphones'],
      earphone: ['earbuds', 'bluetooth headphones', 'noise cancelling headphones'],
      earbuds: ['bluetooth headphones', 'noise cancelling headphones'],
      blender: ['nutribullet', 'vitamix', 'smoothie maker'],
    };

    // Function to convert plural terms to singular
    const pluralToSingular = (term) => {
      if (term.endsWith('es')) {
        return term.slice(0, -2); // Remove 'es' (e.g., "watches" → "watch")
      }
      if (term.endsWith('s')) {
        return term.slice(0, -1); // Remove 's' (e.g., "laptops" → "laptop")
      }
      return term; // Return the term as-is if it doesn't end with 's' or 'es'
    };

    // Function to recursively expand synonyms
    const expandQueryWithSynonyms = (query) => {
      const normalizedQuery = query.toLowerCase();
      const synonymsList = new Set(); // Use a Set to avoid duplicates

      // Recursive function to add synonyms
      const addSynonyms = (term) => {
        if (!synonymsList.has(term)) {
          synonymsList.add(term);

          // Add the singular form of the term (if applicable)
          const singularTerm = pluralToSingular(term);
          if (singularTerm !== term) {
            synonymsList.add(singularTerm);
          }

          // Add synonyms for the term
          if (synonyms[term]) {
            synonyms[term].forEach(synonym => {
              addSynonyms(synonym); // Recursively add synonyms of synonyms
            });
          }

          // Add synonyms for the singular form of the term (if applicable)
          if (singularTerm !== term && synonyms[singularTerm]) {
            synonyms[singularTerm].forEach(synonym => {
              addSynonyms(synonym); // Recursively add synonyms of the singular term
            });
          }
        }
      };

      // Start with the original query
      addSynonyms(normalizedQuery);

      return Array.from(synonymsList); // Convert the Set back to an array
    };

    // Save state to sessionStorage
    const saveStateToSessionStorage = () => {
      const state = {
        currentPage: currentPage.value,
        selectedRatings: selectedRatings.value,
        minPrice: minPrice.value,
        maxPrice: maxPrice.value,
        selectedCategories: selectedCategories.value,
        searchQuery: props.searchQuery, // Add this line
      };
      sessionStorage.setItem('productListState', JSON.stringify(state));
    };

    const loadStateFromSessionStorage = () => {
      const savedState = JSON.parse(sessionStorage.getItem('productListState'));
      if (savedState) {
        currentPage.value = savedState.currentPage || 1;
        selectedRatings.value = savedState.selectedRatings || [];
        minPrice.value = savedState.minPrice || 0;
        maxPrice.value = savedState.maxPrice || 5000;
        selectedCategories.value = savedState.selectedCategories || [];
        previousSearchQuery.value = savedState.searchQuery || ''; // Add this line
      }
    };

    // Update URL with current state
    const updateURL = () => {
      isUpdatingURL.value = true;
      const query = {
        page: currentPage.value,
        search: props.searchQuery || undefined, // Add this line
        rating: selectedRatings.value.length > 0 ? selectedRatings.value[0] : undefined,
        minPrice: minPrice.value,
        maxPrice: maxPrice.value,
        categories: selectedCategories.value.length > 0 ? selectedCategories.value.join(',') : undefined,
      };

      // Remove undefined values from the query
      const filteredQuery = Object.fromEntries(
        Object.entries(query).filter(([_, value]) => value !== undefined)
      );

      router.replace({ query: filteredQuery });
      isUpdatingURL.value = false;
    };

    // Load state on mount
    onMounted(() => {
      loadStateFromSessionStorage();

      // Load state from URL query parameters
      const query = route.query;
      if (query.page) currentPage.value = parseInt(query.page);
      if (query.rating) selectedRatings.value = [parseInt(query.rating)];
      if (query.minPrice) minPrice.value = parseFloat(query.minPrice);
      if (query.maxPrice) maxPrice.value = parseFloat(query.maxPrice);
      if (query.categories) selectedCategories.value = query.categories.split(',');

      // Fetch products
      productStore.fetchProducts();
    });

    // Watch for changes in route.query and update state
    watch(
      () => route.query,
      (newQuery) => {
        if (isUpdatingURL.value) return; // Skip if URL is being updated programmatically

        if (newQuery.page) currentPage.value = parseInt(newQuery.page);
        if (newQuery.rating) selectedRatings.value = [parseInt(newQuery.rating)];
        if (newQuery.minPrice) minPrice.value = parseFloat(newQuery.minPrice);
        if (newQuery.maxPrice) maxPrice.value = parseFloat(newQuery.maxPrice);
        if (newQuery.categories) selectedCategories.value = newQuery.categories.split(',');
      },
      { immediate: true }
    );

    watch(() => props.searchQuery, async (newQuery, oldQuery) => {
      if (newQuery === oldQuery) return; // Skip if search query hasn't changed

      if (newQuery) {
        await productStore.fetchProducts({ search: newQuery });
      } else {
        await productStore.fetchProducts(); // Fetch all products if query is empty
      }

      // Reset to page 1 only if the search query has changed
      if (newQuery !== previousSearchQuery.value) {
        currentPage.value = 1; // Reset to first page on new search
      }

      previousSearchQuery.value = newQuery; // Update the previous search query
      updateURL(); // Update URL with new search query
    }, { immediate: true });

    // Watch for changes in filters or page and save to sessionStorage
    watch([currentPage, selectedRatings, minPrice, maxPrice, selectedCategories], () => {
      saveStateToSessionStorage();
      updateURL();
    });

    // Function to calculate relevance score for a product
    const calculateRelevanceScore = (product, query) => {
      const normalizedQuery = query.toLowerCase();
      const normalizedName = product.name.toLowerCase();
      const normalizedDescription = product.description.toLowerCase();

      // Exact match in name or description (highest score)
      if (normalizedName.includes(normalizedQuery) || normalizedDescription.includes(normalizedQuery)) {
        return 3;
      }

      // Check for synonyms in name or description (medium score)
      const synonymsForQuery = synonyms[normalizedQuery] || [];
      const hasSynonymMatch = synonymsForQuery.some(synonym => {
        return normalizedName.includes(synonym) || normalizedDescription.includes(synonym);
      });

      if (hasSynonymMatch) {
        return 2;
      }

      // Partial match in name or description (lower score)
      if (
        normalizedName.includes(normalizedQuery) ||
        normalizedDescription.includes(normalizedQuery)
      ) {
        return 1;
      }

      // No match
      return 0;
    };

    // Computed property to rank products based on search query
    const filteredProducts = computed(() => {
      let products = productStore.products;

      // Apply search query and synonyms
      if (props.searchQuery) {
        // Expand the search query with synonyms
        const expandedQuery = expandQueryWithSynonyms(props.searchQuery);

        // Use Fuse.js for fuzzy search
        const fuse = new Fuse(products, {
          keys: ['name', 'description'], // Search in name and description
          threshold: 0.5, // Adjust threshold for typo tolerance
          includeScore: true,
        });

        // Perform fuzzy search for each term in the expanded query
        const fuzzyResults = expandedQuery.flatMap(term => fuse.search(term));

        // Use a Map to deduplicate products based on their IDs
        const uniqueProducts = new Map();

        fuzzyResults.forEach(result => {
          const product = result.item;
          if (!uniqueProducts.has(product.id)) {
            uniqueProducts.set(product.id, {
              ...product,
              relevanceScore: calculateRelevanceScore(product, props.searchQuery),
              fuseScore: result.score || 0,
            });
          }
        });

        // Convert the Map back to an array and sort by relevance score
        products = Array.from(uniqueProducts.values())
          .sort((a, b) => {
            if (b.relevanceScore !== a.relevanceScore) {
              return b.relevanceScore - a.relevanceScore; // Sort by relevance score
            }
            return a.fuseScore - b.fuseScore; // Sort by Fuse.js score if relevance is equal
          })
          .map(product => ({
            ...product,
            relevanceScore: undefined, // Remove relevance score from final output
            fuseScore: undefined, // Remove Fuse.js score from final output
          }));
      }

      // Apply filters (rating, price, and category)
      return products.filter(product => {
        const matchesRating = selectedRatings.value.length === 0 || selectedRatings.value.some(rating => product.avgRating >= rating);
        const matchesPrice = product.price >= minPrice.value && product.price <= maxPrice.value;

        // Category filtering logic
        const matchesCategory = selectedCategories.value.length === 0 || 
          selectedCategories.value.some(selectedCategory => {
            // Check if the product belongs to the selected category or its subcategories
            return product.categories?.some(category => {
              // Check if the category name matches the selected category
              if (category.name === selectedCategory) {
                return true;
              }
              // Check if the category belongs to any of the subcategories
              const parentCategory = categories.value.find(cat => cat.children?.includes(category.name));
              if (parentCategory && parentCategory.name === selectedCategory) {
                return true;
              }
              return false;
            });
          });

        return matchesRating && matchesPrice && matchesCategory;
      });
    });

    // Pagination logic
    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / pageSize.value);
    });

    const paginatedProducts = computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize.value;
      const endIndex = startIndex + pageSize.value;
      return filteredProducts.value.slice(startIndex, endIndex);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    // Apply filters (rating, minPrice, maxPrice, and categories)
    const applyFilters = (filters) => {
      selectedRatings.value = filters.rating ? [filters.rating] : [];
      minPrice.value = filters.minPrice || 0;
      maxPrice.value = filters.maxPrice || 5000;

      // Handle "Kitchen Appliances" and its subcategories
      const kitchenAppliancesCategory = categories.value.find(cat => cat.name === 'Kitchen Appliances');
      if (kitchenAppliancesCategory && filters.categories?.includes('Kitchen Appliances')) {
        selectedCategories.value = [
          ...filters.categories,
          ...(kitchenAppliancesCategory.subChildren?.['Kitchen Appliances'] || [])
        ];
      } else {
        selectedCategories.value = filters.categories || [];
      }

      // Only reset currentPage if explicitly required
      if (filters.resetPage) {
        currentPage.value = 1;
      }
    };

    // Clear filters
    const clearFilters = () => {
      selectedRatings.value = [];
      minPrice.value = 0;
      maxPrice.value = 5000;
      selectedCategories.value = [];
      currentPage.value = 1; // Reset to first page when filters are cleared
    };

    const showRatingDistribution = (product) => {
      hoveredProductId.value = product.id;
    };

    const hideRatingDistribution = () => {
      hoveredProductId.value = null;
    };

    const redirectToReviews = (productId) => {
      router.push(`/products/${productId}#reviews`);
    };

    const calculateDeliveryDate = () => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long',
        day: 'numeric' 
      });
    };

    const addToCart = (product) => {
      cartStore.addToCart(product);
    };

    // Computed property to generate visible page numbers
    const visiblePages = computed(() => {
      const pages = [];
      const maxVisiblePages = 5; // Number of visible page buttons
      let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

      // Adjust startPage if endPage exceeds totalPages
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    });

    // Function to navigate to a specific page
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    // Handle scroll event for "Back to Top" button
    const handleScroll = () => {
      showBackToTop.value = window.scrollY > 100; // Show button after scrolling 100px
    };

    // Smooth scroll to top
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    // Add scroll event listener when the component mounts
    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });

    // Clean up the scroll event listener when the component unmounts
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      hoveredProductId,
      selectedRatings,
      minPrice,
      maxPrice,
      selectedCategories,
      categories,
      currentPage,
      totalPages,
      visiblePages,
      filteredProducts,
      paginatedProducts,
      loading: computed(() => productStore.isLoading),
      error: computed(() => productStore.getError),
      showRatingDistribution,
      hideRatingDistribution,
      redirectToReviews,
      calculateDeliveryDate,
      addToCart,
      applyFilters,
      clearFilters,
      nextPage,
      prevPage,
      goToPage,
      showBackToTop,
      scrollToTop,
    };
  },
};
</script>

<style scoped>
.products-container {
  display: flex;
  max-width: 1450px;
  margin: 0 auto;
  padding: 10px;
  gap: 10px;
  margin-left: 40px;
  /* align-items: center; */
  /* justify-content: center; */
  background: #f9f9f9;
  /* background: #f9f9f9; */
}

.products-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-count-box {
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

.product-card {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 290px; /* Set height */
  width: 952px;
  
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}



.product-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  margin-bottom: auto;
  width: 220px; /* Fixed width for the container */
  height: 220px; /* Fixed height for the container */
  overflow: hidden; /* Ensure the image doesn't overflow */
  /* border: 1px solid #ddd; Optional: Add a border for better visualization */
  /* background: #f30b0b; Optional: Add a background color */
}

.product-image {
  max-width: 100%; /* Ensure the image doesn't exceed the container width */
  max-height: 100%; /* Ensure the image doesn't exceed the container height */
  object-fit: contain; /* Scale the image proportionally to fit inside the container */
}

.product-info {
  padding: 10px;
  flex: 1;
}

.product-name {
  font-size: 18px;
  color: #333;
  text-decoration: none;
  margin-bottom: 8px;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-name:hover {
  color: #3498db;
}

.star-rating-container {
  position: relative;
  display: inline-block;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 8px 0;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 14px;
  position: relative;
}

.full-star {
  color: #f1c40f;
}

.half-star {
  color: #f1c40f;
  position: absolute;
  width: 50%;
  overflow: hidden;
}

.empty-star {
  color: #ddd;
}

.rating-text {
  font-size: 12px;
  color: #666;
}

.review-count {
  font-size: 12px;
  color: #666;
}

.rating-distribution-box {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.bar-container {
  flex: 1;
  height: 6px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #f1c40f;
  border-radius: 4px;
}

.rating-count {
  font-size: 12px;
  color: #666;
}

.see-details-btn {
  margin-top: 6px;
  padding: 4px 8px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.delivery-date {
  font-size: 14px;
  color: #666;
  margin: 8px 0;
}

.product-price {
  font-size: 28px;
  font-weight: bold;
  color: #2ecc71;
  margin: 8px 0;
}

.add-to-cart-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.add-to-cart-btn:hover {
  background-color: #2980b9;
}

.empty-state {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #666;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.pagination-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #2980b9;
}

.pagination-button.active {
  background-color: #2ecc71;
  font-weight: bold;
}

/* Back to Top Button */
.back-to-top {
  position: fixed;
  bottom: 20px; /* Distance from the bottom */
  right: 20px; /* Distance from the right */
  padding: 12px;
  width:50px;
  background-color: #3b82f6; /* Blue 500 */
  color: white;
  border: none;
  border-radius: 20%;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s, transform 0.2s;
  z-index: 1000; /* Ensure it's above other elements */
}

.back-to-top:hover {
  background-color: #2563eb; /* Blue 600 */
  transform: translateY(-2px); /* Slight lift on hover */
}

@media (max-width: 768px) {
  .products-container {
    flex-direction: column;
    padding: 10px;
  }

  .product-card {
    flex-direction: column;
    height: auto; /* Adjust height for mobile */
    width: 100%;
  }

  .product-image {
    width: 100%;
    height: auto;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 8px;
  }
}
</style>