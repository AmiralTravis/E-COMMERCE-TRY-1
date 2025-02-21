<template>
    <div 
      class="w-full overflow-hidden relative"
      @wheel="handleScroll"
      @touchstart="startDrag"
      @touchmove="drag"
      @touchend="endDrag"
      @mousedown="startDrag"
      @mousemove="drag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
    >   
      <div 
        ref="track"
        class="flex items-center will-change-transform"
        :style="{ 
          transform: `translateX(${position}px)`,
          transition: isDragging ? 'none' : 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)'
        }"
      >
        <div 
          v-for="(image, index) in allImages" 
          :key="index" 
          class="logo-box flex-none h-[100px] flex items-center justify-center px-7 box-border cursor-pointer"
          @click="handleBrandClick(index)"

        >
          <img 
            :src="image" 
            :alt="`Brand ${index}`"
            class="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
      <div class="carousel-fade-overlay"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
  import { useRouter } from 'vue-router';

  const router = useRouter();

  
  // Import your images directly here
  import brand1 from '@/assets/brand_logos/adibas.png'
  import brand2 from '@/assets/brand_logos/nike.png'
  import brand3 from '@/assets/brand_logos/canon.png'
  import brand4 from '@/assets/brand_logos/sony.png'
  import brand5 from '@/assets/brand_logos/lg.png'
  import brand6 from '@/assets/brand_logos/asus.png'
  import brand7 from '@/assets/brand_logos/dell.png'
  import brand8 from '@/assets/brand_logos/apple.png'
  import brand9 from '@/assets/brand_logos/samsung.png'
  import brand10 from '@/assets/brand_logos/hp.png'
  import brand11 from '@/assets/brand_logos/bose.png'
  import brand12 from '@/assets/brand_logos/jbl.png'
  import brand13 from '@/assets/brand_logos/casio.png'
  import brand14 from '@/assets/brand_logos/garmin.png'
  import brand15 from '@/assets/brand_logos/hydro_flask.png'
  
  // Create array of imported images
  const brandImages = [brand1, brand2, brand3, brand4, brand5, brand6, brand7, brand8, brand9, brand10, brand11, brand12, brand13, brand14, brand15]
  
  const position = ref(0)
  const isDragging = ref(false)
  const startPosition = ref(0)
  const dragStartX = ref(0)
  const isAutoScrolling = ref(true)
  const track = ref(null)
  const imageWidth = 200
  
  // Create repeated arrays for infinite effect, including static items
  const allImages = computed(() => {
    let result = []
    // Static set at start
    result = [...brandImages]
    // Create 7 sets of images for middle section
    for (let i = 0; i < 7; i++) {
      result = [...result, ...brandImages]
    }
    // Static set at end
    result = [...result, ...brandImages]
    return result
  })
  
  // Calculate total width of all cloned elements
  const totalWidth = computed(() => imageWidth * allImages.value.length)
  
  let animationFrame = null
  let autoScrollTimeout = null
  
  const animate = () => {
    if (isAutoScrolling.value && !isDragging.value) {
      position.value -= 0.5 // Slower, smoother scroll speed
  
      // Reset position when reaching the end
      if (position.value <= -totalWidth.value) {
        position.value = 0
      }
    }
    animationFrame = requestAnimationFrame(animate)
  }
  
  const handleScroll = (e) => {
    e.preventDefault()
  
    if (isDragging.value) return
  
    isAutoScrolling.value = false
  
    // Smoother scroll with momentum
    const scrollMultiplier = 2
    position.value -= (e.deltaY || e.deltaX) * scrollMultiplier
  
    // Apply boundaries with smooth transition
    if (position.value <= -totalWidth.value) {
      position.value = 0
    } else if (position.value >= 0) {
      position.value = -totalWidth.value
    }
  
    // Resume auto-scroll after delay
    if (autoScrollTimeout) {
      clearTimeout(autoScrollTimeout)
    }
  
    autoScrollTimeout = setTimeout(() => {
      isAutoScrolling.value = true
    }, 3000)
  }
  
  const startDrag = (e) => {
    isDragging.value = true
    isAutoScrolling.value = false
  
    const pageX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX
    dragStartX.value = pageX
    startPosition.value = position.value
  }
  
  const drag = (e) => {
    if (!isDragging.value) return
    e.preventDefault()
  
    const pageX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX
    const diff = pageX - dragStartX.value
    position.value = startPosition.value + diff
  }
  
  const endDrag = () => {
    if (!isDragging.value) return
  
    isDragging.value = false
  
    // Apply boundaries with smooth transition
    if (position.value <= -totalWidth.value) {
      position.value = 0
    } else if (position.value >= 0) {
      position.value = -totalWidth.value
    }
  
    // Resume auto-scroll after delay
    setTimeout(() => {
      isAutoScrolling.value = true
    }, 3000)
  }

  const brandNames = [
  'adidas',
  'nike',
  'canon',
  'sony',
  'lg',
  'asus',
  'dell',
  'apple',
  'samsung',
  'hp',
  'bose',
  'jbl',
  'casio',
  'garmin',
  'hydro flask'
];


const handleBrandClick = (index) => {
  const brandIndex = index % brandImages.length;
  const brandName = brandNames[brandIndex];
  router.push({ 
    path: '/products', 
    query: { search: brandName } 
  }).then(() => {
    // Scroll to top after the route change and component is rendered
    nextTick(() => {
      window.scrollTo(0, 0); // or document.documentElement.scrollTop = 0;
    });
  });
};
  
  onMounted(() => {
    // Start from middle of carousel
    position.value = -(totalWidth.value / 2)
    animationFrame = requestAnimationFrame(animate)
  })
  
  onUnmounted(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
    if (autoScrollTimeout) {
      clearTimeout(autoScrollTimeout)
    }
  })
  </script>
  
  <style scoped>
  .carousel-container {
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  
  .carousel-track {
    display: flex;
    align-items: center;
    will-change: transform;
  }
  
  .logo-box {
    max-width: 200px;
  }

  .image-item {
    flex: 0 0 200px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    box-sizing: border-box;
  }
  
  .image-item img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .carousel-fade-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Allow clicks to pass through */
  background-image: linear-gradient(to right, 
    rgba(255, 255, 255, 1) 0%, /* Adjust color/opacity as needed */
    rgba(255, 255, 255, 0) 10%, /* Adjust fade start position */
    rgba(255, 255, 255, 0) 90%, /* Adjust fade end position */
    rgba(255, 255, 255, 1) 100% /* Adjust color/opacity as needed */
  );
}
  </style>

  