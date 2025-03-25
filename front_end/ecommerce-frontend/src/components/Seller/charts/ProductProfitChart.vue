<template>
  <div class="chart-wrapper">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading chart data...</p>
    </div>
    <div v-else-if="!chartData || chartData.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p>No profit data available for this period</p>
    </div>
    <div v-else ref="chartContainer" class="chart-container"></div>
    
    <div class="chart-legend">
      <div class="legend-item">
        <div class="legend-color" style="background-color: rgba(16, 185, 129, 0.8);"></div>
        <span>Profit</span>
      </div>
      <div class="legend-item">
        <div class="legend-color legend-dashed" style="background-color: rgba(16, 185, 129, 0.2);"></div>
        <span>Profit Trend</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import * as d3 from 'd3';

const props = defineProps({
  chartData: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: String,
    default: null
  },
  endDate: {
    type: String,
    default: null
  }
});

const chartContainer = ref(null);
let resizeTimeout = null;
let tooltip = null;

const aggregateDataByDay = (data) => {
  const dailyData = new Map();
  
  data.forEach(item => {
    const dateStr = item.date.toISOString().split('T')[0];
    if (dailyData.has(dateStr)) {
      const existing = dailyData.get(dateStr);
      existing.amount += item.amount;
    } else {
      dailyData.set(dateStr, {
        date: new Date(dateStr),
        amount: item.amount,
      });
    }
  });
  
  return Array.from(dailyData.values()).sort((a, b) => a.date - b.date);
};

const prepareDataWithDateRange = (aggregatedData) => {
  if (!aggregatedData || aggregatedData.length === 0) return [];
  
  // Use the startDate and endDate from props
  const startDate = new Date(props.startDate);
  const endDate = new Date(props.endDate);
  
  // Create complete date range
  const completeData = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const existing = aggregatedData.find(d => 
      d.date.toISOString().split('T')[0] === dateStr
    );
    
    completeData.push(existing || {
      date: new Date(currentDate),
      amount: 0, // Zero profit for dates without data
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return completeData;
};

const drawChart = () => {
  if (!chartContainer.value || !props.chartData || props.chartData.length === 0) return;
  
  // Clear previous chart
  d3.select(chartContainer.value).selectAll('*').remove();
  
  // Process data
  const aggregatedData = aggregateDataByDay(props.chartData);
  const processedData = prepareDataWithDateRange(aggregatedData);
  
  // Set dimensions
  const margin = { top: 20, right: 20, bottom: 30, left: 60 };
  const width = chartContainer.value.clientWidth - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select(chartContainer.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Set scales
  const x = d3.scaleTime()
    .domain(d3.extent(processedData, d => d.date))
    .range([0, width]);
  
  const y = d3.scaleLinear()
    .domain([0, d3.max(processedData, d => d.amount) * 1.1]) // Start from 0 since profits are non-negative
    .range([height, 0]);
  
  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .attr('class', 'axis x-axis')
    .call(d3.axisBottom(x)
      .ticks(Math.min(processedData.length, width > 500 ? 7 : 5))
      .tickFormat(d3.timeFormat('%d %b')));
  
  // Add Y axis
  svg.append('g')
    .attr('class', 'axis y-axis')
    .call(d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => `$${d3.format(',')(d)}`));
  
  // Add grid lines
  svg.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(y)
      .ticks(5)
      .tickSize(-width)
      .tickFormat(''))
    .attr('stroke-dasharray', '3,3')
    .attr('stroke-opacity', 0.2)
    .select('path')
    .attr('stroke-width', 0);
  
  // Add profit area
  const area = d3.area()
    .x(d => x(d.date))
    .y0(y(0))
    .y1(d => y(d.amount))
    .curve(d3.curveMonotoneX);
  
  svg.append('path')
    .datum(processedData)
    .attr('fill', 'rgba(16, 185, 129, 0.2)')
    .attr('d', area);
  
  // Add profit line
  const profitLine = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.amount))
    .curve(d3.curveMonotoneX);
  
  const line = svg.append('path')
    .datum(processedData)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(16, 185, 129, 0.8)') // Green line for profit
    .attr('stroke-width', 2)
    .attr('d', profitLine);
  
  // Calculate trend line
  if (processedData.length > 1) {
    // Prepare data for trend line
    const xSeries = processedData.map((d, i) => i);
    const ySeries = processedData.map(d => d.amount);
    
    // Calculate trend with simple linear regression
    const xMean = xSeries.reduce((a, b) => a + b, 0) / xSeries.length;
    const yMean = ySeries.reduce((a, b) => a + b, 0) / ySeries.length;
    
    const slope = xSeries.map((x, i) => ({
      x: x - xMean,
      y: ySeries[i] - yMean
    })).reduce((a, b) => a + b.x * b.y, 0) / 
    xSeries.map(x => Math.pow(x - xMean, 2)).reduce((a, b) => a + b, 0);
    
    const intercept = yMean - (slope * xMean);
    
    // Create trend line data
    const trendData = xSeries.map(x => ({
      date: processedData[x].date,
      amount: x * slope + intercept
    }));
    
    // Add trend line
    svg.append('path')
      .datum(trendData)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(16, 185, 129, 0.8)') // Green dashed line for trend
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', profitLine);
  }
  
  // Add dots for data points
  svg.selectAll('.dot')
    .data(processedData)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => x(d.date))
    .attr('cy', d => y(d.amount))
    .attr('r', 4)
    .attr('fill', '#10B981') // Green dots for profit
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 6);
      
      tooltip.transition()
        .duration(200)
        .style('opacity', 0.9);
      
      tooltip.html(`
        <div class="tooltip-date">${d3.timeFormat('%B %d, %Y')(d.date)}</div>
        <div class="tooltip-value">Profit: $${d3.format(',')(d.amount.toFixed(2))}</div>
      `)
        .style('left', `${event.offsetX + 10}px`)
        .style('top', `${event.offsetY - 28}px`);
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 4);
      
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });
  
  // Animate the line
  const totalLength = line.node().getTotalLength();
  line
    .attr('stroke-dasharray', totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(1000)
    .attr('stroke-dashoffset', 0);
};

// Handle resizing
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    drawChart();
  }, 300);
};

// Watch for data changes
watch(() => props.chartData, () => {
  drawChart();
}, { deep: true });

watch(() => [props.startDate, props.endDate], () => {
  drawChart();
}, { deep: true });

watch(() => props.loading, (newVal) => {
  if (!newVal) {
    // Slight delay to ensure the DOM is ready after loading state
    setTimeout(() => {
      drawChart();
    }, 100);
  }
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  // Initial draw after a short delay to ensure container is ready
  setTimeout(() => {
    if (!props.loading) {
      drawChart();
    }
  }, 200);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  clearTimeout(resizeTimeout);
});
</script>

<style scoped>
.chart-wrapper {
  @apply relative w-full h-full min-h-[300px];
}

.chart-container {
  @apply w-full h-full min-h-[300px];
}

.loading-state {
  @apply absolute inset-0 flex flex-col items-center justify-center text-gray-500;
}

.empty-state {
  @apply absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2;
}

.spinner {
  @apply w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2;
}

.chart-tooltip {
  @apply absolute px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none z-10;
}

.tooltip-date {
  @apply font-medium border-b border-gray-700 pb-1 mb-1;
}

.tooltip-value {
  @apply text-gray-200;
}

.chart-legend {
  @apply flex justify-center gap-6 mt-4;
}

.legend-item {
  @apply flex items-center gap-2;
}

.legend-color {
  @apply w-3 h-3 rounded-full;
}

.legend-dashed {
  @apply border border-dashed border-green-600;
}

:deep(.axis path),
:deep(.axis line) {
  stroke: #e5e7eb;
}

:deep(.axis text) {
  fill: #6b7280;
  font-size: 12px;
}

:deep(.grid line) {
  stroke: #e5e7eb;
}
</style>