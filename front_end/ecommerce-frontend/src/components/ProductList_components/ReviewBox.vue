<!-- components/ReviewBox.vue -->
<template>
  <div class="review-box bg-white border border-gray-200 rounded-lg p-6 flex gap-8 relative max-w-2xl shadow-lg">
    <!-- Pointer Triangle -->
    <div class="pointer absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white"></div>

    <!-- Left Section -->
    <div class="left-section flex flex-col gap-2">
      <Transition appear enter-active-class="transition duration-500" enter-from-class="opacity-0 scale-90" enter-to-class="opacity-100 scale-100">
        <div class="average-rating text-4xl font-bold text-gray-900">
          {{ formattedAvgRating }} <span class="text-lg text-gray-500">out of 5</span>
        </div>
      </Transition>

      <Transition appear enter-active-class="transition duration-500 delay-100" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <div class="total-reviews text-sm text-gray-500">
          {{ totalReviews }} global ratings
        </div>
      </Transition>

      <Transition appear enter-active-class="transition duration-500 delay-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <div class="star-rating flex gap-1">
          <TransitionGroup name="star" tag="div" class="flex">
            <span v-for="star in 5" :key="star" class="star">
              <!-- Full Star -->
              <span v-if="star <= Math.floor(avgRating)" class="full-star text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
              <!-- Partial Star -->
              <span v-else-if="star === Math.ceil(avgRating) && avgRating % 1 !== 0" class="partial-star">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <defs>
                    <linearGradient :id="`partial-star-gradient-${productId}-${star}`" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#f1c40f" />
                      <stop :offset="`${(avgRating % 1) * 100}%`" stop-color="#f1c40f" />
                      <stop :offset="`${(avgRating % 1) * 100}%`" stop-color="#ddd" />
                      <stop offset="100%" stop-color="#ddd" />
                    </linearGradient>
                  </defs>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" :fill="`url(#partial-star-gradient-${productId}-${star})`" />
                </svg>
              </span>
              <!-- Empty Star -->
              <span v-else class="empty-star text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            </span>
          </TransitionGroup>
        </div>
      </Transition>

      <Transition appear enter-active-class="transition duration-500 delay-300" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <a href="#" class="see-reviews-link text-sm text-blue-500 hover:text-blue-600 hover:scale-105 transition-all">
          See customer reviews
        </a>
      </Transition>
    </div>

    <!-- Right Section -->
    <div class="right-section flex-1 flex flex-col gap-2">
      <TransitionGroup name="list" tag="div" class="space-y-2">
        <div v-for="n in 5" :key="n" class="rating-bar flex items-center gap-2">
          <span class="rating-label w-8 text-sm text-gray-600">{{ 6 - n }}★</span>
          <div class="bar-container flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="bar h-full bg-yellow-400 rounded-full transition-all duration-1000"
              :style="{ width: isVisible ? `${getPercentage(6 - n)}%` : '0%' }"
            ></div>
          </div>
          <span class="rating-count w-12 text-sm text-gray-600">
            {{ getPercentage(6 - n).toFixed(1) }}%
          </span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  avgRating: {
    type: Number,
    required: true,
  },
  totalReviews: {
    type: Number,
    required: true,
  },
  ratingDistribution: {
    type: Object,
    required: true,
  },
  productId: {
    type: [String, Number],
    required: true,
  },
});

const isVisible = ref(false);

const formattedAvgRating = computed(() => props.avgRating.toFixed(1));

const getPercentage = (rating) => {
  return (props.ratingDistribution[rating] / props.totalReviews) * 100;
};

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});
</script>

<style scoped>
.star-enter-active {
  transition: all 0.3s ease;
}
.star-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
.star-enter-to {
  opacity: 1;
  transform: scale(1);
}

.list-enter-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.list-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.pointer {
  filter: drop-shadow(-2px 0 2px rgba(0, 0, 0, 0.1));
}
</style>