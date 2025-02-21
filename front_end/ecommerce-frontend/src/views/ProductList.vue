<!-- /views/ProductList.vue -->
<template>
  <div class="products-container-wrapper">
  <div class="products-container">
    <!-- Side Panel -->
    <SidePanel
      :categories="categories"
      :initialFilters="filterStore.filters"
      @apply-filters="applyFilters"
      @clear-filters="clearFilters"
      class="side-panel"
    />

    <!-- Product List -->
    <div class="products-list">
      <!-- Display products -->
      <div v-for="product in paginatedProducts" :key="product.id" class="product-card relative">
        <div class="product-image-container">
          <img 
            :src="`${product.imageUrl}`" 
            :alt="product.name" 
            class="product-image" 
            loading="lazy"
          />
          
          <div class="absolute top-3 left-3">
          <div 
            v-if="product.discountPercentage" 
            class="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md mb-2"
          >
            -{{ product.discountPercentage }}% Off
          </div>
        </div>

        <div class="absolute bottom-3 left-3">
          <div 
            v-if="isBestSeller(product)" 
            class="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md"
          >
            Best Seller
          </div>
        </div>
          
        </div>
        <div class="product-info">
          <a :href="`/products/${product.id}`" target="_blank" class="product-name">
            {{ product.name }}
          </a>
          
          <!-- Star Rating and Review Count (Hover Trigger) -->
          <div
            class="star-rating-container relative flex items-center gap-2"
            @mouseover="showReviewBox(product.id)"
            @mouseleave="hideReviewBox"
          >
            <!-- Stars -->
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

            <!-- Rating Number -->
            <span class="rating-number text-sm text-gray-500">
              ({{ (Number(product.avgRating) || 0).toFixed(1) }})
            </span>

            <!-- Review Count -->
            <span class="review-count text-sm text-gray-500">
              {{ product.reviewCount || 0 }} reviews
            </span>

            <!-- Review Box (Shown on Hover) -->
            <div
              v-show="hoveredProductId === product.id"
              class="review-box absolute left-full top-0 z-10 transition-opacity duration-300 ease-in-out opacity-100 border-2 border-red-500 bg-blue-100"
            >
              <ReviewBox
                :avgRating="Number(product.avgRating)"
                :totalReviews="product.reviewCount"
                :ratingDistribution="product.ratingDistribution"
                :productId="product.id"
              />
            </div>
          </div>
          <!-- Delivery Date -->
          <p class="delivery-date">
            {{ product.price >= 100 ? 'Free delivery by' : 'Delivered by' }} {{ calculateDeliveryDate() }}
          </p>
          
          <div class="flex items-baseline gap-2 mb-4">
                <span v-if="product.discountPercentage" class="text-2xl font-bold text-green-500">
                  ${{ (product.price * (1 - product.discountPercentage/100)).toFixed(2) }}
                </span>
                <span 
                  :class="[
                    product.discountPercentage 
                      ? 'text-sm text-red-700 line-through' 
                      : 'text-2xl font-bold text-green-500'
                  ]"
                >
                  ${{ product.price.toFixed(2) }}
                </span>
              </div>
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
  </div>
</template>



<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useProductStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import { useRoute, useRouter } from 'vue-router';
import { useReviewStore } from '@/stores/reviewStore';
import SidePanel from '@/components/ProductList_components/SidePanel.vue';
import Fuse from 'fuse.js';
import ReviewBox from '@/components/ProductList_components/ReviewBox.vue';
import { useFilterStore } from '@/stores/useFilterStore';

export default {
  name: 'ProductList',
  components: {
    SidePanel,
    ReviewBox,
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
    const filterStore = useFilterStore();
    // const topProducts = computed(() => productStore.topProducts);
    const topProducts = computed(() => productStore.topProducts); // Replace the existing topProducts ref


    // Reactive variables
    const hoveredProductId = ref(null);
    const currentPage = ref(1);
    const pageSize = ref(15);
    const isUpdatingURL = ref(false);
    const previousSearchQuery = ref(props.searchQuery);
    const showBackToTop = ref(false);
    const loading = ref(false);
    const error = ref(null);
    // const topProducts = ref([]); // Initialize with an empty array

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
      nike: ['jordan', 'shoes', 'air', 'retro'],
      mac: [ 'apple','macbook air','laptop', ]
    };

    // Utility functions
    const pluralToSingular = (term) => {
      if (term.endsWith('es')) return term.slice(0, -2);
      if (term.endsWith('s')) return term.slice(0, -1);
      return term;
    };

    const expandQueryWithSynonyms = (query) => {
      const normalizedQuery = query.toLowerCase();
      const synonymsList = new Set();

      const addSynonyms = (term) => {
        if (!synonymsList.has(term)) {
          synonymsList.add(term);
          const singularTerm = pluralToSingular(term);
          if (singularTerm !== term) synonymsList.add(singularTerm);

          if (synonyms[term]) {
            synonyms[term].forEach(synonym => addSynonyms(synonym));
          }

          if (singularTerm !== term && synonyms[singularTerm]) {
            synonyms[singularTerm].forEach(synonym => addSynonyms(synonym));
          }
        }
      };

      addSynonyms(normalizedQuery);
      return Array.from(synonymsList);
    };

    const calculateRelevanceScore = (product, query) => {
      const normalizedQuery = query.toLowerCase();
      const normalizedName = product.name.toLowerCase();
      const normalizedDescription = product.description.toLowerCase();

      if (normalizedName.includes(normalizedQuery) || normalizedDescription.includes(normalizedQuery)) return 3;

      const synonymsForQuery = synonyms[normalizedQuery] || [];
      const hasSynonymMatch = synonymsForQuery.some(synonym => {
        return normalizedName.includes(synonym) || normalizedDescription.includes(synonym);
      });

      if (hasSynonymMatch) return 2;
      if (normalizedName.includes(normalizedQuery) || normalizedDescription.includes(normalizedQuery)) return 1;
      return 0;
    };

    // URL and state management
    

    const updateURL = () => {
      isUpdatingURL.value = true;
      const query = {
        page: currentPage.value,
        search: props.searchQuery || undefined,
        rating: filterStore.filters.rating[0] || undefined,
        minPrice: filterStore.filters.minPrice,
        maxPrice: filterStore.filters.maxPrice,
        categories: filterStore.filters.categories?.join(',') || undefined, // Optional chaining
        // discountCategories: filterStore.filters.discountCategories?.join(',') || undefined,
        discountRanges: filterStore.filters.discountRanges?.length 
          ? JSON.stringify(filterStore.filters.discountRanges)
          : undefined,
      };

      router.replace({ query: Object.fromEntries(Object.entries(query).filter(([_, v]) => v !== undefined)) });
      isUpdatingURL.value = false;
    };


//     const isBestSeller = (product) => {
//   return topProducts.value.some(p => p.id === product.id);
// };
    const isBestSeller = (product) => {
      return (topProducts.value || []).some(p => p.id === product.id);
    };

    // Initialization
    
    onMounted(async () => {
  try {
    loading.value = true;

    // Fetch top products if not already fetched
    if (productStore.topProducts.length === 0) {
      await productStore.fetchTopProducts();
    }
    // topProducts.value = productStore.topProducts; // Populate topProducts ref
    const topProducts = computed(() => productStore.topProducts || []); // Add fallback

    // Load from session storage first
    filterStore.loadFiltersFromSessionStorage();

    // Override with URL parameters
    const query = route.query;
    currentPage.value = query.page ? parseInt(query.page, 10) : 1;

    // Parse discountRanges from URL
    const discountRanges = query.discountRanges 
      ? JSON.parse(query.discountRanges)
      : [];

    filterStore.setFilters({
      rating: query.rating ? [Number(query.rating)] : [],
      minPrice: query.minPrice ? Number(query.minPrice) : 0,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : 5000,
      categories: query.categories ? query.categories.split(',') : [],
      // discountCategories: query.discountCategories ? query.discountCategories.split(',') : [],
      discountRanges: discountRanges,

    });

    await productStore.setFilters(filterStore.filters);
  } catch (err) {
    error.value = err;
    console.error("Error initializing products:", err);
  } finally {
    loading.value = false;
  }
});
    // Watchers

    // ProductList.vue setup function
watch(
  () => filterStore.filters,
  (newFilters) => {
    productStore.setFilters(newFilters); // This updates productStore's filters and fetches products
    updateURL();
  },
  { deep: true }
);

    watch(
    () => filterStore.filters,
    () => {
      productStore.fetchProducts({
        search: filterStore.searchQuery,
        filters: filterStore.filters,
      });
      updateURL(); // Update URL when filters change
    },
    { deep: true }
  );
    watch(
      () => props.searchQuery,
      async (newQuery, oldQuery) => {
        if (newQuery === oldQuery) return;

        try {
          loading.value = true;
          if (newQuery) {
            await productStore.fetchProducts({ search: newQuery });
          } else {
            await productStore.fetchProducts();
          }

          if (newQuery !== previousSearchQuery.value) {
            currentPage.value = 1;
          }

          previousSearchQuery.value = newQuery;
          updateURL();
        } catch (err) {
          error.value = err;
        } finally {
          loading.value = false;
        }
      },
      { immediate: true }
    );


    watch(
    () => route.query.search,
    (newSearch) => {
      if (newSearch) {
        filterStore.searchQuery = newSearch; // Update store
        productStore.fetchProducts({ search: newSearch });
      } else {
        filterStore.searchQuery = ''; // Clear search query in store
        productStore.fetchProducts(); // Fetch all products
      }
    },
    { immediate: true }
  );

  // Add watcher for currentPage to update URL
watch(currentPage, () => {
  updateURL();
});

    // Product filtering and pagination
    const filteredProducts = computed(() => {
      let products = productStore.products;

      // Search logic
      if (props.searchQuery) {
        const expandedQuery = expandQueryWithSynonyms(props.searchQuery);
        const fuse = new Fuse(products, {
          keys: ['name', 'description'],
          threshold: 0.5,
          includeScore: true,
        });

        const fuzzyResults = expandedQuery.flatMap(term => fuse.search(term));
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

        products = Array.from(uniqueProducts.values())
          .sort((a, b) => {
            if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
            return a.fuseScore - b.fuseScore;
          })
          .map(product => ({
            ...product,
            relevanceScore: undefined,
            fuseScore: undefined,
          }));
      }

      // // Apply filters
      
      return products.filter(product => {
        // Rating filter
        const matchesRating = filterStore.filters.rating.length === 0 || 
                              product.avgRating >= filterStore.filters.rating[0];

        // Price filter
        // const matchesPrice = product.price >= Number(filterStore.filters.minPrice) &&
        //                     product.price <= Number(filterStore.filters.maxPrice);
        const finalPrice = product.discountPercentage 
          ? product.price * (1 - product.discountPercentage / 100)
          : product.price;
          
        const matchesPrice = finalPrice >= filterStore.filters.minPrice &&
                            finalPrice <= filterStore.filters.maxPrice;

        // Category filter
        const matchesCategory = filterStore.filters.categories.length === 0 || 
          filterStore.filters.categories.some(selectedCategory => {
            return product.categories?.some(category => {
              if (category.name === selectedCategory) return true;
              const parentCategory = categories.value.find(cat => 
                cat.children?.includes(category.name)
              );
              return parentCategory?.name === selectedCategory;
            });
          });
        
        // Discount Range Filter
        // const matchesDiscount = filterStore.filters.discountRanges.length === 0 || filterStore.filters.discountRanges.some(range => {
        //   return product.discountPercentage >= range.min && product.discountPercentage <= range.max;
        // });

        return matchesRating && matchesPrice && matchesCategory ;
      });
   
    });

    const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize.value));

    const paginatedProducts = computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize.value;
      const endIndex = startIndex + pageSize.value;
      return filteredProducts.value.slice(startIndex, endIndex);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const applyFilters = (filters) => {
      filterStore.setFilters(filters);
      currentPage.value = 1;
      updateURL();
    };

    const clearFilters = () => {
  filterStore.resetFilters();
  currentPage.value = 1;
  updateURL(); // Add this to clear URL parameters
};

    // UI methods
    const showReviewBox = (productId) => {
      hoveredProductId.value = productId;
    };

    const keepReviewBoxVisible = (productId) => {
      hoveredProductId.value = productId;
    };

    const hideReviewBox = () => {
      setTimeout(() => {
        hoveredProductId.value = null;
      });
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

    const visiblePages = computed(() => {
      const pages = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    });

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const handleScroll = () => {
      showBackToTop.value = window.scrollY > 100;
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    

    // Scroll event listeners
    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      hoveredProductId,
      categories,
      currentPage,
      totalPages,
      visiblePages,
      filteredProducts,
      paginatedProducts,
      loading: computed(() => productStore.isLoading || loading.value),
      error,
      showReviewBox,
      keepReviewBoxVisible,
      hideReviewBox,
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
      filterStore, // Ensure filterStore is exposed to the template
      isBestSeller,
    };
  },
};
</script>

<style scoped>

.products-container-wrapper{
  padding-left: clamp(20px, 5vw, 50px); /* Adjust values as needed */
  padding-right: clamp(20px, 5vw, 50px); /* Adjust values as needed */
  margin: 0; /* Important: Remove default body margins */
}
/* .products-container {
  display: flex;
  max-width: 1450px;
  margin: 0 auto;
  padding: 10px;
  gap: 10px;
  margin-left: 40px;
  
  background: #f9f9f9;
 
} */
/* .products-container {
  display: flex;
  max-width: 100%;
  margin:  auto;
  padding: 0.625rem;
  gap: 0.625rem;
  margin-left: clamp(1rem, 2.5vw, 2.5rem); 
  background: #f9f9f9;
} */
.products-container {
  display: flex;
  max-width: 1400px; /* Or a specific max-width */
  margin-left: 0 auto; /* Centers the container */
  padding: 0.625rem;
  gap: 0.625rem;
  background: #f9f9f9;
  justify-content: center; /* Centers the items *within* the container */
}

.side-panel {
  flex-shrink: 0; /* Prevent side panel from shrinking */
  flex-basis: 27%; /* Initial width: 30% */
  /* width: clamp(250px, 20vw, 350px);  */
  transition: all 0.3s ease;
}

/* .products-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
} */
.products-list {
  flex: 1;
  flex-basis: 73%; /* Initial width: 70% */

  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  min-width: 0; /* Prevent flex item overflow */
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
  height: 290px;
  width: 100%;
  
}
/* .product-card {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  overflow: hidden;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
  height: clamp(200px, 30vh, 290px); 
  width: 100%;
  min-width: 0; 
} */

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
  width: 220px; 
  height: 220px; 
  overflow: hidden;
}
/* .product-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: clamp(150px, 20%, 220px); 
  height: clamp(150px, 90%, 220px); 
  overflow: hidden;
  flex-shrink: 0; 
} */


.product-image {
  max-width: 100%; /* Ensure the image doesn't exceed the container width */
  max-height: 100%; /* Ensure the image doesn't exceed the container height */
  object-fit: contain; /* Scale the image proportionally to fit inside the container */
}

.product-info {
  padding: 10px;
  flex: 1;
}
/* .product-info {
  padding: clamp(0.5rem, 1vw, 1rem);
  padding: 10px;

  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
} */

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
/* .product-name { */
  /* font-size: clamp(0.875rem, 1.5vw, 1.125rem); */
  /* margin-bottom: 0.5rem; */
  /* margin-top: 0.5rem; */
  /* font-size: 18px;
  color: #333;
  text-decoration: none;
  margin-bottom: 8px;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; */
/* } */


.product-name:hover {
  color: #3498db;
}

.star-rating-container {
  position: relative;
  display: inline-block;
  align-items: center;
  gap: 8px; 
  padding: 8px; /* Increase hover area */
  font-size: clamp(0.75rem, 1vw, 0.875rem);
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
  width: 200px;

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

.review-box {
  width: 400px; /* Adjust as needed */
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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