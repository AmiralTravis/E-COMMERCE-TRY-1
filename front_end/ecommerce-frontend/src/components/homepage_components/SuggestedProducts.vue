<!-- /components/homepage_components/SuggestedProducts.vue -->
<template>
  <section class="new-arrivals-carousel bg-gray-50">
    <div class="">
      <!-- Header Section -->
      <div class="flex justify-between items-center ">
        <div>
          <!-- <h2 class="text-3xl font-bold text-gray-900">Recommended for you</h2> -->
          <h2 class="text-4xl font-bold text-center mt-6 mb-8 text-gray-800">
          <span class="relative">
            Recommended for you
          <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
        </span>
        </h2>
        </div>
        <div class="flex gap-3">
          <button
            @click="prevSlide"
            class="carousel-control-btn"
            :disabled="isTransitioning"
          >
            <span class="sr-only">Previous</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            @click="nextSlide"
            class="carousel-control-btn"
            :disabled="isTransitioning"
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
        class="carousel-container relative overflow-hidden"
      >
        <div
          ref="carouselTrack"
          class="carousel-track flex transition-transform duration-500 ease-out"
          :style="trackStyle"
        >
          <div
            v-for="(product, index) in displayProducts"
            :key="`${product.id}-${index}`"
            :ref="setProductRef(index)"
            class="product-card group cursor-pointer"
            :class="{ 'highlight-card': currentIndex === index }"
            @click="handleProductClick(index)"
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
              <button 
                class="add-to-cart-btn"
                @click.stop="addToCart(product)"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>

import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useProductStore } from '@/stores/products';
import { useCartStore } from '@/stores/cart';

const CLONE_THRESHOLD = 3;
const productStore = useProductStore();
const carouselContainer = ref(null);
const carouselTrack = ref(null);
const currentIndex = ref(0);
const autoplayInterval = ref(null);
const isTransitioning = ref(false);
const productRefs = ref([]);
const trackTranslateX = ref(0);
const cartStore = useCartStore();

const latestProducts = computed(() => productStore.getLatestProducts);
const latestProductsLoading = computed(() => productStore.isLatestProductsLoading);
const latestProductsError = computed(() => productStore.getLatestProductsError);

// Add clone products to create infinite loop effect
const displayProducts = computed(() => {
  if (!latestProducts.value?.length) return [];
  
  const products = [...latestProducts.value];
  const preClones = products.slice(-CLONE_THRESHOLD).map(product => ({
    ...product,
    id: `pre-${product.id}`
  }));
  const postClones = products.slice(0, CLONE_THRESHOLD).map(product => ({
    ...product,
    id: `post-${product.id}`
  }));
  
  return [...preClones, ...products, ...products, ...products, ...postClones];
});

const trackStyle = computed(() => ({
  transform: `translateX(${trackTranslateX.value}px)`
}));

// Corrected getRealIndex function
function getRealIndex(index) {
  const length = latestProducts.value.length;
  
  // Handle preClones (first CLONE_THRESHOLD items)
  if (index < CLONE_THRESHOLD) {
    return length - CLONE_THRESHOLD + index; // Maps to last CLONE_THRESHOLD items of original
  }
  
  // Handle postClones (last CLONE_THRESHOLD items)
  const totalMainItems = 3 * length;
  if (index >= CLONE_THRESHOLD + totalMainItems) {
    return index - (CLONE_THRESHOLD + totalMainItems); // Maps to first CLONE_THRESHOLD items of original
  }
  
  // Handle main items (three copies)
  const adjustedIndex = index - CLONE_THRESHOLD;
  return adjustedIndex % length; // Maps to original index
}

const setProductRef = (index) => (el) => {
  productRefs.value[index] = el;
};

async function updateTrackPosition(immediate = false) {
  if (!displayProducts.value?.length || !productRefs.value[currentIndex.value]) {
    trackTranslateX.value = 0;
    return;
  }

  const activeCard = productRefs.value[currentIndex.value];
  const container = carouselContainer.value;
  if (!container || !activeCard) return;

  const containerWidth = container.clientWidth;
  const containerCenter = containerWidth / 2;
  const cardLeft = activeCard.offsetLeft;
  const cardWidth = activeCard.clientWidth;

  trackTranslateX.value = -(cardLeft - (containerCenter - cardWidth / 2));
}

async function selectProduct(index, immediate = false) {
  if (isTransitioning.value) return;
  isTransitioning.value = true;

  const track = carouselTrack.value;
  if (!track) return;

  const length = latestProducts.value.length;
  const realIndex = getRealIndex(index);

  // Handle clone transitions
  if (index < CLONE_THRESHOLD && !immediate) {
    // Jump to middle copy's corresponding position
    const middleCopyIndex = CLONE_THRESHOLD + length + realIndex;
    
    track.style.transitionDuration = '0s';
    currentIndex.value = middleCopyIndex;
    await updateTrackPosition(true);
    
    await nextTick();
    track.style.transitionDuration = '0.5s';
    currentIndex.value = middleCopyIndex - 1;
    await updateTrackPosition();

  } else if (index >= CLONE_THRESHOLD + 3 * length && !immediate) {
    // Jump to middle copy's corresponding position
    const middleCopyIndex = CLONE_THRESHOLD + length + realIndex;
    
    track.style.transitionDuration = '0s';
    currentIndex.value = middleCopyIndex;
    await updateTrackPosition(true);
    
    await nextTick();
    track.style.transitionDuration = '0.5s';
    currentIndex.value = middleCopyIndex + 1;
    await updateTrackPosition();

  } else {
    // Regular transition
    currentIndex.value = index;
    await nextTick();
    await updateTrackPosition();
  }

  isTransitioning.value = false;
  resetAutoplay();
}


function nextSlide() {
  if (!displayProducts.value?.length || isTransitioning.value) return;
  selectProduct(currentIndex.value + 1);
}

function prevSlide() {
  if (!displayProducts.value?.length || isTransitioning.value) return;
  selectProduct(currentIndex.value - 1);
}

function handleProductClick(index) {
  if (isTransitioning.value) return;
  selectProduct(index);
}

function startAutoplay() {
  if (autoplayInterval.value) return;
  autoplayInterval.value = setInterval(() => {
    nextSlide();
  }, 5000);
}

function resetAutoplay() {
  clearInterval(autoplayInterval.value);
  autoplayInterval.value = null;
  startAutoplay();
}

function addToCart(product) {
  cartStore.addToCart(product);
  // Optional: Add visual feedback or toast notification
}

async function retryFetch() {
  await productStore.fetchLatestProducts();
}

// Keep the rest of the methods (nextSlide, prevSlide, etc.) unchanged

onMounted(async () => {
  await productStore.fetchLatestProducts();
  if (latestProducts.value?.length > 0) {
    // Start from the middle copy's first item
    currentIndex.value = CLONE_THRESHOLD + latestProducts.value.length;
    await selectProduct(currentIndex.value, true);
  }
  startAutoplay();
});

onUnmounted(() => {
  clearInterval(autoplayInterval.value);
  autoplayInterval.value = null;
});

watch(currentIndex, () => {
  nextTick(() => updateTrackPosition());
});
</script>

<style scoped>
.carousel-container {
  padding: 0.5rem;
  padding-top: 1rem;
  height: 570px;
  
}

.carousel-track {
  will-change: transform;
}

.product-card {
  @apply w-72 bg-white rounded-xl shadow-sm 
         transition-all duration-300 snap-start
         flex-shrink-0 mx-2;
}

.highlight-card {
  @apply ring-2 ring-blue-500 ring-offset-2 shadow-lg 
         transform scale-105 z-10;
}

.carousel-control-btn {
  @apply p-3 rounded-full bg-white text-gray-800 shadow-md
         hover:bg-gray-50 hover:shadow-lg transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
         disabled:opacity-50 disabled:cursor-not-allowed;
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