<template>
    <section class="new-arrivals-carousel bg-gray-50 ">
      <div class="">
        <!-- Header Section -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <!-- <h2 class="text-3xl font-bold text-gray-900">New Arrivals</h2> -->
            <h2 class="text-4xl font-bold  mb-4 text-gray-800">
          <span class="relative">
            New Arrivals
          <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
        </span>
        </h2>
            <p class="mt-2 text-gray-600">Check out our latest products</p>
          </div>
          <div class="flex gap-3">
            <button
              @click="scroll('left')"
              class="carousel-control-btn"
              :class="{ 'opacity-50 cursor-not-allowed': isAtStart }"
              :disabled="isAtStart"
            >
              <span class="sr-only">Previous</span>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              @click="scroll('right')"
              class="carousel-control-btn"
              :class="{ 'opacity-50 cursor-not-allowed': isAtEnd }"
              :disabled="isAtEnd"
            >
              <span class="sr-only">Next</span>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
  
        <!-- Loading State -->
        <div v-if="latestProductsLoading" class="flex justify-center items-center h-96">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
  
        <!-- Error State -->
        <div v-else-if="latestProductsError" class="flex justify-center items-center h-96">
          <div class="text-center">
            <p class="text-red-600 text-lg">Failed to load products</p>
            <button @click="retryFetch" class="mt-4 text-blue-600 hover:text-blue-800">
              Try Again
            </button>
          </div>
        </div>
  
        <!-- Carousel Container -->
        <div
          v-else
          ref="carouselContainer"
          class="carousel-container"
          @scroll="handleScroll"
        >
          <div
            v-for="product in latestProducts"
            :key="product.id"
            class="product-card group"
          >
            <!-- Product Image -->
            <div class="relative overflow-hidden p-3 rounded-t-xl h-64">
              <img 
                :src="product.imageUrl" 
                :alt="product.name"
                class="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-black bg-opacity-10"></div>
              <div v-if="product.isNew" class="absolute top-4 right-4">
                <span class="new-badge">New</span>
              </div>
              <div v-if="product.discountPercentage" class="absolute top-4 left-4">
                <span class="discount-badge">-{{ product.discountPercentage }}%</span>
              </div>
            </div>
  
            <!-- Product Info -->
            <div class="p-6">
              <!-- <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {{ product.name }}
              </h3> -->
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
  <router-link 
    :to="{ name: 'ProductDetails', params: { id: product.id } }"
    class="hover:text-blue-600 transition-colors"
    @click.stop
  >
    {{ product.name }}
  </router-link>
</h3>

              <!-- Rating -->
              <div class="flex items-center gap-2 mb-3">
                <div class="flex">
                  <template v-for="n in 5" :key="n">
                    <svg
                      class="w-4 h-4"
                      :class="n <= Math.floor(product.avgRating) ? 'text-yellow-400' : 'text-gray-300'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </template>
                </div>
                <span class="text-sm text-gray-600">({{ product.reviewCount }} global reviews)</span>
              </div>
  
              <!-- Price -->
              <div class="flex items-baseline gap-2 mb-4">
                <span v-if="product.discountPercentage" class="text-2xl font-bold text-gray-900">
                  ${{ (product.price * (1 - product.discountPercentage/100)).toFixed(2) }}
                </span>
                <span 
                  :class="[
                    product.discountPercentage 
                      ? 'text-sm text-gray-500 line-through' 
                      : 'text-2xl font-bold text-gray-900'
                  ]"
                >
                  ${{ product.price.toFixed(2) }}
                </span>
              </div>
  
              <!-- Add to Cart Button -->
              <button @click="addToCart(product)" class="add-to-cart-btn">
    Add to Cart
  </button>
  
              <!-- Arrival Date -->
              <p class="mt-4 text-sm text-gray-500">
                Added {{ formatDate(product.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import { useProductStore } from '@/stores/products';
  import { onMounted, ref, computed } from 'vue';
  import { useCartStore } from '@/stores/cart';


  
  
  export default {
    name: 'NewArrivalsCarousel',
    setup() {
      const productStore = useProductStore();
      const cartStore = useCartStore();

      const carouselContainer = ref(null);
      const isAtStart = ref(true);
      const isAtEnd = ref(false);
  
      const latestProducts = computed(() => productStore.getLatestProducts);
      const latestProductsLoading = computed(() => productStore.isLatestProductsLoading);
      const latestProductsError = computed(() => productStore.getLatestProductsError);
  
      onMounted(async () => {
        await productStore.fetchLatestProducts();
        // Initialize scroll position check after products are loaded
        handleScroll();
      });
  
      const scroll = (direction) => {
        const container = carouselContainer.value;
        const scrollAmount = container.offsetWidth * 0.8;
  
        container.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth',
        });
      };
  
      const handleScroll = () => {
        const container = carouselContainer.value;
        if (!container) return;
        
        isAtStart.value = container.scrollLeft <= 0;
        isAtEnd.value = 
          Math.ceil(container.scrollLeft + container.offsetWidth) >= container.scrollWidth;
      };
  
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
          -Math.round((new Date() - date) / (1000 * 60 * 60 * 24)),
          'day'
        );
      };
  
      const retryFetch = () => {
        productStore.fetchLatestProducts();
      };

      const addToCart = (product) => { // Make sure product is passed as argument
      cartStore.addToCart(product);
      // Optional: Add visual feedback or toast notification
      console.log("Added to cart:", product); // Helpful for debugging
    }
  
      return {
        latestProducts,
        latestProductsLoading,
        latestProductsError,
        isAtStart,
        isAtEnd,
        carouselContainer,
        scroll,
        handleScroll,
        formatDate,
        retryFetch,
        addToCart
      };
    },
  };
  </script>
  
  <style scoped>

  .new-arrivals-carousel{
    padding-bottom: 2rem;
  }

  .carousel-container {
    @apply grid grid-flow-col auto-cols-max gap-6 overflow-x-auto 
           snap-x snap-mandatory scroll-smooth pb-6 -mx-4 px-4;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .carousel-container::-webkit-scrollbar {
    display: none;
  }
  
  .product-card {
    @apply w-72 bg-white rounded-xl shadow-sm hover:shadow-lg
           transition-all duration-300 snap-start;
  }
  
  .carousel-control-btn {
    @apply p-3 rounded-full bg-white text-gray-800 shadow-md
           hover:bg-gray-50 hover:shadow-lg transition-all duration-200
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
  }
  
  .new-badge {
    @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
           bg-blue-500 text-white shadow-sm;
  }
  
  .discount-badge {
    @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
           bg-red-500 text-white shadow-sm;
  }
  
  .add-to-cart-btn {
    @apply w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium
           hover:bg-blue-700 transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
  }
  </style>