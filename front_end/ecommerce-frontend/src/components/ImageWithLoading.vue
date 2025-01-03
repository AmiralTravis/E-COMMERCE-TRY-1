<!-- ImageWithLoading.vue
<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  src: String,
  alt: String,
  maxWidth: {
    type: Number,
    default: 200
  },
  maxHeight: {
    type: Number,
    default: 200
  }
});

const imageLoaded = ref(false);
const imageError = ref(false);
const imageRef = ref(null);

const getOptimizedImageUrl = (originalUrl) => {
  if (!originalUrl) return `/api/placeholder/${props.maxWidth}/${props.maxHeight}`;
  return `/api/placeholder/${props.maxWidth * 2}/${props.maxHeight * 2}?url=${encodeURIComponent(originalUrl)}`;
};

const handleImageLoad = (event) => {
  const img = event.target;
  if (img.naturalWidth === 0 || img.naturalHeight === 0) {
    handleImageError(event);
    return;
  }
  imageLoaded.value = true;
};

const handleImageError = (event) => {
  imageError.value = true;
  if (event.target) {
    event.target.src = `/api/placeholder/${props.maxWidth}/${props.maxHeight}`;
  }
};
</script>

<template>
  <div class="relative w-48 h-48 bg-white rounded-md overflow-hidden">
    <div 
      v-show="!imageLoaded" 
      class="absolute inset-0 bg-gray-100 animate-pulse"
    />
    
    <div class="absolute inset-0 flex items-center justify-center bg-white">
      <div class="w-full h-full p-4 flex items-center justify-center">
        <img 
          v-if="src"
          ref="imageRef"
          :src="getOptimizedImageUrl(src)"
          :alt="alt"
          class="max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300"
          :class="{
            'opacity-0': !imageLoaded,
            'opacity-100': imageLoaded
          }"
          crossorigin="anonymous"
          @load="handleImageLoad"
          @error="handleImageError"
        />
        
        <div 
          v-if="!src || imageError" 
          class="absolute inset-0 flex items-center justify-center bg-gray-50"
        >
          <svg 
            class="w-12 h-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="1.5" 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style> -->