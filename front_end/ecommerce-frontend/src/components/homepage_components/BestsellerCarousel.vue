<!-- /components/homepage_components/BestsellerCarousel.vue -->
<template>
  <div class="relative w-full ">
    <div class="relative">
      <div class="carousel-container relative overflow-hidden rounded-xl bg-gray-50/30">
        <div>
          <!-- <h2 class="text-3xl font-bold text-gray-900">Best Sellers</h2> -->
        </div>
        <div 
          ref="carouselTrack"
          class="carousel-track flex transition-transform duration-500 ease-out"
          :style="trackStyle"
        >
          <div 
            v-for="(product, index) in displayProducts" 
            :key="`${product.id}-${index}`"
            class="product-slot flex-shrink-0 transition-all duration-300 cursor-pointer"
            :class="{ 'active-slot': isActiveSlot(index) }"
            :ref="setProductSlotRef(index)"
            @click="handleProductClick(index)"
          >
            <div 
              class="flex gap-4 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              :class="{ 'is-active': isActiveSlot(index) }"
            >
              <div class="product-section">
                <div class="relative aspect-square p-4 bg-gradient-to-br from-gray-50 to-gray-100">
                  <img 
                    :src="product.imageUrl" 
                    :alt="product.name"
                    class="object-contain w-full h-full rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                  <div 
                    v-if="product.discountPercentage" 
                    class="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
                  >
                    -{{ product.discountPercentage }}%
                  </div>
                </div>

                <div class="p-6">
                  <!-- <h3 class="text-base font-semibold text-gray-900 truncate mb-2 tracking-tight">
                    {{ product.name }}
                    <router-link :to="{ name: 'ProductDetails', params: { id: product.id } }"></router-link>
                  </h3> -->
                  <h3 class="text-base font-semibold text-gray-900 truncate mb-2 tracking-tight">
  <router-link 
    :to="{ name: 'ProductDetails', params: { id: product.id } }"
    class="hover:text-blue-600 transition-colors"
    @click.stop
  >
    {{ product.name }}
  </router-link>
</h3>

                  <div class="flex items-center mb-3">
                    <div class="flex items-center gap-0.5">
                      <template v-for="n in 5" :key="n">
                        <svg 
                          class="w-4 h-4" 
                          :class="n <= (product.avgRating || 0) ? 'text-yellow-400' : 'text-gray-200'"
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </template>
                      <span class="ml-2 text-sm font-medium text-gray-600">
                        {{ product.reviewCount }}+ reviews
                      </span>
                    </div>
                  </div>

                  <div class="flex items-baseline gap-2 mb-4">
                    <span v-if="product.discountedPrice" class="text-lg font-bold text-red-600">
                      ${{ product.discountedPrice.toFixed(2) }}
                    </span>
                    <span 
                      class="text-base" 
                      :class="{ 'line-through text-gray-400': product.discountedPrice, 'font-bold text-gray-900': !product.discountedPrice }"
                    >
                      ${{ product.price.toFixed(2) }}
                    </span>
                  </div>

                  <button 
                    class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow flex items-center justify-center gap-2"
                    @click.stop="handleViewDetails(product)"
                  >
                    View Details
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div 
                v-if="isActiveSlot(index)"
                class="review-section w-[384px] p-6 border-l border-gray-100"
              >
                <div class="flex justify-between items-center mb-6">
                  <h4 class="text-lg font-semibold text-gray-900">Customer Reviews</h4>
                  <span class="text-sm font-medium text-blue-600">Top Reviews</span>
                </div>
                
                <div class="space-y-6">
                  <div 
                    v-for="review in product.topReviews" 
                    :key="review.id"
                    class="border-b border-gray-100 pb-6 last:border-b-0"
                  >
                    <div class="flex items-start gap-4">
                      <div class="flex-shrink-0">
                        <div v-if="review.profilePicUrl" class="w-10 h-10 rounded-full overflow-hidden">
                          <img 
                            :src="review.profilePicUrl" 
                            :alt="review.username"
                            class="w-full h-full object-cover"
                          >
                        </div>
                        <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span class="text-gray-600 font-semibold text-sm">
                            {{ review.username.charAt(0).toUpperCase() }}
                          </span>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-semibold text-gray-900 truncate">{{ review.username }}</span>
                          <span class="text-sm text-gray-500">{{ review.date }}</span>
                        </div>
                        <div class="flex items-center mb-2">
                          <template v-for="n in 5" :key="n">
                            <svg 
                              class="w-4 h-4" 
                              :class="n <= review.rating ? 'text-yellow-400' : 'text-gray-200'"
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </template>
                        </div>
                        <p class="text-gray-600 text-sm leading-relaxed">{{ review.comment }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          @click="prevSlide" 
          class="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/95 shadow-lg hover:bg-white transition-all border border-gray-100 hover:shadow-xl"
        >
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          @click="nextSlide" 
          class="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/95 shadow-lg hover:bg-white transition-all border border-gray-100 hover:shadow-xl"
        >
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useProductStore } from '@/stores/products'
import { useRouter } from 'vue-router';

const router = useRouter();
const CLONE_THRESHOLD = 2
const productStore = useProductStore()
const currentIndex = ref(0)
const autoplayInterval = ref(null)
const isLoading = ref(true)
const error = ref(null)
const productSlotRefs = ref([])
const trackTranslateX = ref(0)
const isMounted = ref(false)
const isTransitioning = ref(false)
const carouselTrack = ref(null)

const carouselProducts = computed(() => {
  if (!productStore.topProducts?.length) return []
  return [...productStore.topProducts]
})

const getInitialIndex = (productsLength) => {
  return CLONE_THRESHOLD + productsLength;  // Start at beginning of second list
}



const displayProducts = computed(() => {
  if (!carouselProducts.value?.length) return [];
  
  const products = [...carouselProducts.value];
  const preClones = products.slice(-CLONE_THRESHOLD).map(product => ({
    ...product,
    id: `pre-${product.id}`
  }));
  const postClones = products.slice(0, CLONE_THRESHOLD).map(product => ({
    ...product,
    id: `post-${product.id}`
  }));
  
  // Create three copies of the product list
  const tripleProducts = [...products, ...products, ...products];
  
  return [...preClones, ...tripleProducts, ...postClones];
});

const currentProduct = computed(() => {
  if (!carouselProducts.value?.length) return null
  return carouselProducts.value[getRealIndex(currentIndex.value)]
})

const setProductSlotRef = (index) => (el) => {
  productSlotRefs.value[index] = el
}


function getRealIndex(index) {
  const length = carouselProducts.value.length;
  if (index < CLONE_THRESHOLD) {
    return length * 3 + index - CLONE_THRESHOLD;
  }
  if (index >= length * 3 + CLONE_THRESHOLD) {
    return index - length * 3 - CLONE_THRESHOLD;
  }
  return (index - CLONE_THRESHOLD) % length;
}

function isActiveSlot(index) {
  return getRealIndex(currentIndex.value) === getRealIndex(index)
}

async function updateTrackPosition(immediate = false) {
  if (!displayProducts.value?.length || !productSlotRefs.value[currentIndex.value]) {
    trackTranslateX.value = 0
    return
  }

  const activeSlot = productSlotRefs.value[currentIndex.value]
  const carouselContainer = activeSlot.closest('.carousel-container')
  if (!carouselContainer) return

  const containerWidth = carouselContainer.clientWidth
  const containerCenter = containerWidth / 2
  const activeSlotLeft = activeSlot.offsetLeft
  const activeSlotWidth = activeSlot.clientWidth

  trackTranslateX.value = -(activeSlotLeft - (containerCenter - activeSlotWidth / 2))
}

const trackStyle = computed(() => ({
  transform: `translateX(${trackTranslateX.value}px)`
}))

async function handleProductClick(index) {
  if (isTransitioning.value || isActiveSlot(index)) return
  await selectProduct(index)
}

function handleViewDetails(product) {
  router.push({ 
    name: 'ProductDetails', 
    params: { id: product.id } 
  });
}



async function selectProduct(index) {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  
  const track = carouselTrack.value;
  if (!track) return;
  
  currentIndex.value = index;
  
  if (currentProduct.value && !currentProduct.value.topReviews) {
    try {
      await productStore.fetchTopReviews(currentProduct.value.id);
      currentProduct.value.topReviews = productStore.topReviews;
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  }
  
  await nextTick();
  await updateTrackPosition();
  
  const length = carouselProducts.value.length;
  const totalLength = length * 3;
  
  // Handle the wrap-around transitions
  if (index < CLONE_THRESHOLD) {
    track.style.transitionDuration = '0s';
    currentIndex.value = totalLength + index;
    await updateTrackPosition();
  } else if (index >= totalLength + CLONE_THRESHOLD) {
    track.style.transitionDuration = '0s';
    currentIndex.value = index - totalLength;
    await updateTrackPosition();
  }

  requestAnimationFrame(() => {
    track.style.transitionDuration = '0.5s';
    isTransitioning.value = false;
  });
  
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

function startAutoplay() {
  if (autoplayInterval.value) return
  autoplayInterval.value = setInterval(() => {
    if (isMounted.value) {
      nextSlide()
    }
  }, 5000)
}

function resetAutoplay() {
  clearInterval(autoplayInterval.value)
  autoplayInterval.value = null
  startAutoplay()
}





onMounted(async () => {
  try {
    await productStore.fetchTopProducts();
    if (productStore.topProducts?.length > 0) {
      // Start from the middle set of products
      const initialIndex = getInitialIndex(productStore.topProducts.length);
      currentIndex.value = initialIndex;
      await selectProduct(initialIndex);
    }
    isMounted.value = true;
    startAutoplay();
  } catch (err) {
    error.value = err.message || 'Failed to load products';
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  isMounted.value = false
  clearInterval(autoplayInterval.value)
  autoplayInterval.value = null
})

watch(currentIndex, () => {
  nextTick(() => updateTrackPosition())
})
</script>

<style scoped>
.carousel-container {
  /* padding: 1.5rem; */
  height: 600px;
  /* padding-bottom: 1.5rem ; */
}

.carousel-track {
  will-change: transform;
}

.product-slot {
  width: 316px;
  margin-right: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-slot.active-slot {
  width: 700px;
}

.product-section {
  width: 300px;
}

.product-card {
  height: 100%;
  transform-origin: center center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card.is-active {
  transform: scale(1.02);
}

.review-section {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.review-section::-webkit-scrollbar {
  width: 4px;
}

.review-section::-webkit-scrollbar-track {
  background: transparent;
}

.review-section::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

@media (max-width: 1280px) {
  .product-section {
    width: 280px;
  }
  .product-slot {
    width: 296px;
  }
  .product-slot.active-slot {
    width: 616px;
  }
}

@media (max-width: 1024px) {
  .product-section {
    width: 260px;
  }
  .product-slot {
    width: 276px;
  }
  .product-slot.active-slot {
    width: 576px;
  }
}
</style>