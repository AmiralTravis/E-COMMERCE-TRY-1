<template>
    <div class="trend-chart-container" ref="chartContainer">
      <svg v-if="!loading" class="trend-chart" :width="width" :height="height" viewBox="0 0 100 40">
        <!-- Area fill -->
        <path
          :d="areaPath"
          :fill="color"
          fill-opacity="0.1"
        />
        <!-- Line path -->
        <path
          :d="linePath"
          :stroke="color"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <!-- Dots for data points -->
        <circle
          v-for="(point, index) in points"
          :key="index"
          :cx="point.x"
          :cy="point.y"
          :r="index === points.length - 1 ? 3 : 0"
          :fill="color"
        />
      </svg>
      <div v-if="loading" class="loading-indicator">
        <div class="loading-spinner"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  
  const props = defineProps({
    chartData: {
      type: Array,
      default: () => []
    },
    color: {
      type: String,
      default: '#10B981' // Default to green
    },
    loading: {
      type: Boolean,
      default: false
    }
  });
  
  const chartContainer = ref(null);
  const width = ref(100);
  const height = ref(40);
  
  // Computed properties for the chart paths
//   const normalizedData = computed(() => {
//     if (!props.chartData || props.chartData.length === 0) return [];
    
//     const min = Math.min(...props.chartData);
//     const max = Math.max(...props.chartData);
//     const range = max - min || 1; // Prevent division by zero
    
//     return props.chartData.map(value => {
//       // Scale to 0-1 range, then to 10-35 range (leaving margin at top and bottom)
//       return 35 - ((value - min) / range) * 25;
//     });
//   });
const normalizedData = computed(() => {
  if (!props.chartData || props.chartData.length === 0) return [];
  
  // Ensure chartData is an array of numbers
  const values = props.chartData.map(item => parseFloat(item.amount));
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1; // Prevent division by zero
  
  return values.map(value => {
    // Scale to 0-1 range, then to 10-35 range (leaving margin at top and bottom)
    return 35 - ((value - min) / range) * 25;
  });
});

  const points = computed(() => {
    if (!normalizedData.value.length) return [];
    
    const segmentWidth = 100 / Math.max(1, normalizedData.value.length - 1);
    
    return normalizedData.value.map((y, index) => ({
      x: index * segmentWidth,
      y
    }));
  });
  
  const linePath = computed(() => {
    if (!points.value.length) return '';
    
    return points.value.reduce((path, point, index) => {
      return path + (index === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`);
    }, '');
  });
  
  const areaPath = computed(() => {
    if (!points.value.length) return '';
    
    const path = linePath.value;
    const lastPoint = points.value[points.value.length - 1];
    const firstPoint = points.value[0];
    
    return `${path} L ${lastPoint.x},40 L ${firstPoint.x},40 Z`;
  });
  
  // Resize handling
  const handleResize = () => {
    if (chartContainer.value) {
      width.value = chartContainer.value.clientWidth;
      height.value = chartContainer.value.clientHeight;
    }
  };
  
  // Lifecycle hooks
  onMounted(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  });
  
  watch(() => props.chartData, () => {
    handleResize();
  }, { deep: true });
  
  // Clean up
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
  </script>
  
  <style scoped>
  .trend-chart-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 40px;
  }
  
  .trend-chart {
    width: 100%;
    height: 100%;
  }
  
  .loading-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
  }
  
  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-top: 2px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>