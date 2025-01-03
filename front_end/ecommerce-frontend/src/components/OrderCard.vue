<!-- components/OrderCard.vue -->
<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <!-- Order Header -->
    <div class="px-6 py-4 bg-gray-50 border-b">
      <div class="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">
            <!-- Order #{{ order.id }} -->
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            Placed on {{ formatDateTime(order.createdAt) }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          <span class="font-medium text-gray-700">
            Total: ${{ order.totalAmount.toFixed(2) }}
          </span>
          <span 
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              getStatusColor(order.status)
            ]"
          >
            {{ order.status }}
          </span>
        </div>
      </div>
    </div>
  
    <!-- Order Items Scroll Section -->
    <div class="relative px-6 py-4">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-sm font-medium text-gray-700">Order Items</h4>
        <div class="flex gap-2">
          <button 
            @click="scrollItems('left')"
            :disabled="scrollPosition <= 0"
            :class="[
              'p-1 rounded-full hover:bg-gray-100',
              scrollPosition <= 0 ? 'text-gray-300' : 'text-gray-600'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            @click="scrollItems('right')"
            :disabled="scrollPosition >= maxScroll"
            :class="[
              'p-1 rounded-full hover:bg-gray-100',
              scrollPosition >= maxScroll ? 'text-gray-300' : 'text-gray-600'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

       <div 
        ref="itemsContainer"
        class="flex gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide"
        @scroll="handleScroll"
        @wheel.prevent="handleWheel"
      >


       <!-- <div 
          v-for="item in orderItemsWithColors" 
          :key="item.id"
          class="inline-block flex-none w-48 rounded-lg p-3"
          :style="{ backgroundColor: item.bgColor }"
        >
          <div class="aspect-square mb-2 rounded-md overflow-hidden custom-bg2 flex items-center justify-center p-2">
            <img 
              v-if="item.Product?.imageUrl"
              :src="getOptimizedImageUrl(item.Product.imageUrl)"
              :alt="item.Product.name"
              class="max-w-full max-h-full w-auto h-auto object-contain"
              crossorigin="anonymous"
              @error="handleImageError"
              @load="handleImageLoad"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <h5 class="font-medium text-sm text-gray-800 truncate mb-1">
            {{ item.Product?.name || 'Product Name' }}
          </h5>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-600">${{ item.Product.price.toFixed(2) }}</span>
            <span class="text-gray-500">Qty: {{ item.quantity }}</span>
          </div>
          <router-link 
            :to="`/products/${item.productId}`"
            class="mt-2 block text-center text-xs text-indigo-600 hover:text-indigo-500"
          >
            View Details
          </router-link>
        </div>
      </div> -->
        <div 
          v-for="item in orderItemsWithColors" 
          :key="item.id"
          class="inline-block flex-none w-48 rounded-lg p-3"
          :style="{ backgroundColor: item.bgColor }"
        >
          <div class="aspect-square mb-2 rounded-md overflow-hidden custom-bg2 flex items-center justify-center p-2">
            <!-- Image loading optimization -->
            <!-- <template v-if="item.Product?.imageUrl">
              <img 
                v-show="!imageLoadMap[item.id]"
                :src="`/api/placeholder/200/200`"
                class="max-w-full max-h-full w-auto h-auto object-contain blur-sm"
                alt="Loading..."
              />
              <img 
                :src="getOptimizedImageUrl(item.Product.imageUrl, item.id)"
                :alt="item.Product.name"
                class="max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300"
                :class="{ 'opacity-0': !imageLoadMap[item.id], 'opacity-100': imageLoadMap[item.id] }"
                @load="handleImageLoad(item.id)"
                @error="handleImageError($event, item.id)"
                crossorigin="anonymous"
                loading="lazy"
              />
            </template> -->
            <template v-if="item.Product?.imageUrl">
              <!-- Placeholder Image -->
              <!-- <img 
                v-show="!imageLoadMap[item.id]"
                :src="`/api/placeholder/200/200`"
                class="fixed-dimensions blur-sm"
                alt="Loading..." -->
              <!-- /> -->
              
              <!-- Actual Image -->
                <img 
                  :src="getOptimizedImageUrl(item.Product.imageUrl, item.id)"
                  :alt="item.Product.name"
                  class="w-full h-full object-contain transition-opacity duration-300"
                  :class="{ 'opacity-0': !imageLoadMap[item.id], 'opacity-100': imageLoadMap[item.id] }"
                  @load="handleImageLoad(item.id)"
                  @error="handleImageError($event, item.id)"
                  crossorigin="anonymous"
                  loading="lazy"
                />
            </template>

            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h5 class="font-medium text-sm text-gray-800 truncate mb-1">
            {{ item.Product?.name || 'Product Name' }}
          </h5>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-600">${{ item.Product.price.toFixed(2) }}</span>
            <span class="text-gray-500">Qty: {{ item.quantity }}</span>
          </div>
          <router-link 
            :to="`/products/${item.productId}`"
            class="mt-2 block text-center text-xs text-indigo-600 hover:text-indigo-500"
          >
            View Details
          </router-link>

        </div>
      </div>
    </div>

    <!-- Progress Bar Section -->
    <div class="px-6 py-4 bg-gray-50">
      <!-- Only show progress bar when not delivered -->
      <div v-if="order.status !== 'Delivered'" class="relative">
        <!-- Progress Line -->
        <div class="absolute top-5 left-0 w-full h-1 bg-gray-200">
          <div 
            class="h-full bg-green-500 transition-all duration-500"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>

        <!-- Status Points -->
        <div class="relative flex justify-between">
          <div 
            v-for="(status, index) in currentStatusFlow" 
            :key="status"
            class="flex flex-col items-center"
          >
            <!-- Status Circle -->
            <div 
              :class="[ 
                'w-5 h-5 rounded-full border-2 transition-colors duration-200',
                getStatusPointClass(index)
              ]"
            >
              <svg
                v-if="isStatusComplete(index)"
                class="w-full h-full text-white p-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <!-- Status Label -->
            <span 
              class="mt-2 text-xs text-center whitespace-nowrap"
              :class="getStatusLabelClass(index)"
            >
              {{ status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Dates section - always visible -->
      <div class="mt-6 flex flex-wrap gap-4 text-sm">
        <div v-if="order.status === 'Delivered'" class="flex-1">
          <span class="text-gray-500">Order Delivered At:</span>
          <br />
          <span class="font-medium">{{ formatDateTime(order.updatedAt) }}</span>
        </div>
        <div v-else-if="order.estimatedDate" class="flex-1">
          <span class="text-gray-500">Estimated {{ getCurrentStageText }} Date:</span>
          <br />
          <span class="font-medium">{{ formatDateTime(order.estimatedDate) }}</span>
        </div>
        <div v-if="order.estimatedDeliveryDate && order.status !== 'Delivered'" class="flex-1">
          <span class="text-gray-500">Estimated Delivery Date:</span>
          <br />
          <span class="font-medium">{{ formatDateTime(order.estimatedDeliveryDate) }}</span>
        </div>
      </div>
    </div>  
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  maxWidth: {
    type: Number,
    default: 200
  },
  maxHeight: {
    type: Number,
    default: 200
  }
});

const imageLoadMap = ref({})
const productImage = ref(null);
const imageLoaded = ref(false);
const imageError = ref(false);

const itemsContainer = ref(null)
const scrollPosition = ref(0)
const maxScroll = ref(0)
// -----------
const isScrolling = ref(false)
const requestId = ref(null)
const targetScrollLeft = ref(0)

// Status management
const statusFlows = {
  'Pending': ['Placed', 'Processing', 'Shipment', 'Delivery'],
  'Processing': ['Placed', 'Processing', 'Shipment', 'Delivery'],
  'Shipping': ['Placed', 'Processed', 'Shipping', 'Delivery'],
  'Delivering': ['Placed', 'Processed', 'Shipped', 'Delivering'],
  'Delivered': ['Placed', 'Processed', 'Shipped', 'Delivered'],
  'Completed': ['Placed', 'Processed', 'Shipped', 'Delivered', 'Completed']
}

const currentStatusFlow = computed(() => 
  statusFlows[props.order.status] || statusFlows['Pending']
)

const currentStatusIndex = computed(() => {
  return currentStatusFlow.value.findIndex(
    status => status.toLowerCase() === props.order.status.toLowerCase()
  )
})

const progressPercentage = computed(() => {
  const index = currentStatusIndex.value === -1 ? 0 : currentStatusIndex.value
  return (index / (currentStatusFlow.value.length - 1)) * 100
})

const getCurrentStageText = computed(() => {
  const nextIndex = currentStatusIndex.value + 1
  if (nextIndex >= currentStatusFlow.value.length) return 'Completion'
  return currentStatusFlow.value[nextIndex]
})

// Scroll handling
const scrollItems = (direction) => {
  if (!itemsContainer.value) return
  
  const container = itemsContainer.value
  const scrollAmount = container.clientWidth * 0.8
  
  if (direction === 'left') {
    container.scrollLeft -= scrollAmount
  } else {
    container.scrollLeft += scrollAmount
  }
}

const getOptimizedImageUrl = (originalUrl, itemId) => {
  if (!originalUrl) return '/api/placeholder/200/200'
  
  // For high-res images, use the placeholder API with original URL
  if (!originalUrl.includes('i.ibb.co')) {
    return `/api/placeholder/200/200?url=${encodeURIComponent(originalUrl)}`
  }
  
  // For i.ibb.co images, use their built-in resizing
  try {
    const url = new URL(originalUrl)
    url.searchParams.set('size', '200')
    return url.toString()
  } catch {
    return '/api/placeholder/200/200'
  }
}

const handleImageLoad = (itemId) => {
  imageLoadMap.value[itemId] = true
}

const handleImageError = (event, itemId) => {
  console.error('Image failed to load:', event)
  imageLoadMap.value[itemId] = true
  event.target.src = '/api/placeholder/200/200'
}

// Add this to check the order data structure when component mounts
onMounted(() => {
  console.log('Order data:', props.order);
  console.log('Order items:', props.order.OrderItems);
  if (props.order.OrderItems?.[0]?.Product) {
    console.log('Product image URL:', props.order.OrderItems[0].Product.imageUrl);
  }
});

const handleScroll = () => {
  if (!itemsContainer.value) return
  scrollPosition.value = itemsContainer.value.scrollLeft
  maxScroll.value = itemsContainer.value.scrollWidth - itemsContainer.value.clientWidth
}

const handleWheel = (event) => {
  if (!itemsContainer.value) return
  
  event.preventDefault()
  
  // Calculate scroll amount based on input
  const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX
  const scrollMultiplier = 1.5 // Adjust this value to change scroll speed
  
  // Update target scroll position
  targetScrollLeft.value = itemsContainer.value.scrollLeft + (delta * scrollMultiplier)
  
  // Clamp target scroll position
  targetScrollLeft.value = Math.max(0, Math.min(targetScrollLeft.value, maxScroll.value))
  
  if (!isScrolling.value) {
    isScrolling.value = true
    animateScroll()
  }
}

// Add new smooth scroll animation function
const animateScroll = () => {
  if (!itemsContainer.value || !isScrolling.value) return
  
  const currentScroll = itemsContainer.value.scrollLeft
  const diff = targetScrollLeft.value - currentScroll
  
  // If we're close enough to target, stop scrolling
  if (Math.abs(diff) < 0.5) {
    isScrolling.value = false
    return
  }
  
  // Smooth easing function
  const ease = 0.15 // Adjust this value to change smoothness (0.1 to 0.3 works well)
  const nextScroll = currentScroll + (diff * ease)
  
  itemsContainer.value.scrollLeft = nextScroll
  requestId.value = requestAnimationFrame(animateScroll)
}

watch(() => itemsContainer.value, (newValue) => {
  if (newValue) {
    maxScroll.value = newValue.scrollWidth - newValue.clientWidth
  }
}, { immediate: true })

onMounted(() => {
  if (itemsContainer.value) {
    maxScroll.value = itemsContainer.value.scrollWidth - itemsContainer.value.clientWidth
    itemsContainer.value.addEventListener('scroll', handleScroll)
  }
})

// Status styling
const getStatusColor = (status) => {
  const colors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipping': 'bg-purple-100 text-purple-800',
    'Delivering': 'bg-indigo-100 text-indigo-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Completed': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusPointClass = (index) => {
  if (index < currentStatusIndex.value) {
    return 'border-green-500 bg-green-500' // Completed
  } else if (index === currentStatusIndex.value) {
    return 'border-blue-500 bg-blue-500' // Current
  }
  return 'border-gray-300 bg-white' // Upcoming
}

const getStatusLabelClass = (index) => {
  if (index < currentStatusIndex.value) {
    return 'text-green-600 font-medium'
  } else if (index === currentStatusIndex.value) {
    return 'text-blue-600 font-medium'
  }
  return 'text-gray-500'
}

const isStatusComplete = (index) => {
  return index <= currentStatusIndex.value
}

// Date formatting
const formatDateTime = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// ----------------------------------------------ooooooooooooooooooooooooooo
const pastelColors = [
  '#FFB3BA', // Light pink
  '#FFDFBA', // Light orange
  '#FFFFBA', // Light yellow
  '#B9FBC0', // Light green
  '#BAE1FF', // Light blue
  '#E1BAFF'  // Light purple
];

const generateRandomColor = (() => {
  let recentColors = []; // To store recently used colors
  const maxRecent = 4;   // Minimum gap between repeated colors

  return () => {
    // Filter colors to exclude recent ones
    const availableColors = pastelColors.filter(
      (color) => !recentColors.includes(color)
    );

    // Randomly select a color from the available ones
    const selectedColor = 
      availableColors[Math.floor(Math.random() * availableColors.length)];

    // Update recent colors queue
    recentColors.push(selectedColor);
    if (recentColors.length > maxRecent) {
      recentColors.shift(); // Remove the oldest color
    }

    return selectedColor;
  };
})();

const assignColorsToItems = (orderItems) => {
  return orderItems.map((item) => ({
    ...item,
    bgColor: generateRandomColor()
  }));
};

const orderItemsWithColors = computed(() => assignColorsToItems(props.order.OrderItems));

</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.custom-bg2 {
  background-color: white;
}

.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}

.fixed-dimensions {
  width: 200px !important;
  height: 200px !important;
  object-fit: contain; 
}

</style>