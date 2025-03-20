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
      <p>No sales data available for this period</p>
    </div>
    <div v-else ref="chartContainer" class="chart-container"></div>
    
    <div class="chart-legend">
      <div class="legend-item">
        <div class="legend-color" style="background-color: rgba(59, 130, 246, 0.8);"></div>
        <span>Sales Amount</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: rgba(16, 185, 129, 0.8);"></div>
        <span>Units Sold</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, defineProps } from 'vue';
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
let tooltip = null;
let resizeTimeout = null;

// Define tooltip event handlers first
const handleMouseOver = (event, d, element) => {
  d3.select(element)
    .transition()
    .duration(200)
    .attr('r', 6);
  
  tooltip.transition()
    .duration(200)
    .style('opacity', 0.9);
  
  tooltip.html(`
    <div class="tooltip-date">${d3.timeFormat('%B %d, %Y')(d.date)}</div>
    <div class="tooltip-value">Sales: $${d3.format(',.2f')(d.amount)}</div>
    <div class="tooltip-value">Units: ${d.quantity}</div>
    <div class="tooltip-value">Profit: $${d3.format(',.2f')(d.profit || 0)}</div>
  `)
    .style('left', `${event.offsetX + 10}px`)
    .style('top', `${event.offsetY - 28}px`);
};

const handleMouseOut = () => {
  d3.selectAll('.dot-sales, .dot-quantity')
    .transition()
    .duration(200)
    .attr('r', 4);
  
  tooltip.transition()
    .duration(500)
    .style('opacity', 0);
};




// const aggregateDataByDay = (data) => {
//   const dailyData = new Map();
  
//   data.forEach(item => {
//     const dateStr = item.date.toISOString().split('T')[0];
//     if (dailyData.has(dateStr)) {
//       const existing = dailyData.get(dateStr);
//       existing.amount += item.amount;
//       existing.quantity += item.quantity;
//     } else {
//       dailyData.set(dateStr, {
//         date: new Date(dateStr),
//         amount: item.amount,
//         quantity: item.quantity,
//       });
//     }
//   });
  
//   return Array.from(dailyData.values()).sort((a, b) => a.date - b.date);
// };

// const prepareDataWithDateRange = (aggregatedData) => {
//   if (!aggregatedData || aggregatedData.length === 0) return [];
  
//   // Get date range from aggregated data
//   const startDate = new Date(aggregatedData[0].date);
//   const endDate = new Date(aggregatedData[aggregatedData.length - 1].date);
  
//   // Create complete date range
//   const completeData = [];
//   const currentDate = new Date(startDate);
  
//   while (currentDate <= endDate) {
//     const dateStr = currentDate.toISOString().split('T')[0];
//     const existing = aggregatedData.find(d => 
//       d.date.toISOString().split('T')[0] === dateStr
//     );
    
//     completeData.push(existing || {
//       date: new Date(currentDate),
//       amount: 0,
//       quantity: 0
//     });
    
//     currentDate.setDate(currentDate.getDate() + 1);
//   }
  
//   return completeData;
// };


// const drawChart = () => {
//   if (!chartContainer.value || !props.chartData || props.chartData.length === 0) return;
  
//   // Clear previous chart
//   d3.select(chartContainer.value).selectAll('*').remove();
  
//   // // Process data
//   // const processedData = prepareDataWithDateRange(props.chartData);
//   // const aggregatedData = aggregateDataByDay(processedData);
  
//   const aggregatedData = aggregateDataByDay(props.chartData);
//   const processedData = prepareDataWithDateRange(aggregatedData);
  
//   // Set dimensions
//   const margin = { top: 20, right: 60, bottom: 40, left: 70 };
//   const width = chartContainer.value.clientWidth - margin.left - margin.right;
//   const height = 300 - margin.top - margin.bottom;
  
//   // Create SVG
//   const svg = d3.select(chartContainer.value)
//     .append('svg')
//     .attr('width', width + margin.left + margin.right)
//     .attr('height', height + margin.top + margin.bottom)
//     .append('g')
//     .attr('transform', `translate(${margin.left},${margin.top})`);
  
//   // Create tooltip
//   tooltip = d3.select(chartContainer.value)
//     .append('div')
//     .attr('class', 'chart-tooltip')
//     .style('opacity', 0);
  
//   // Set scales
//   const x = d3.scaleTime()
//     .domain(d3.extent(processedData, d => d.date))
//     .range([0, width]);
  
//   const y1 = d3.scaleLinear()
//     .domain([0, d3.max(processedData, d => d.amount) * 1.1 || 1000])
//     .range([height, 0]);
  
//   const y2 = d3.scaleLinear()
//     .domain([0, d3.max(processedData, d => d.quantity) * 1.1 || 10])
//     .range([height, 0]);
  
//   // Add X axis
//   svg.append('g')
//     .attr('transform', `translate(0,${height})`)
//     .attr('class', 'axis x-axis')
//     .call(d3.axisBottom(x)
//       .ticks(Math.min(width > 600 ? 10 : 5, processedData.length))
//       .tickFormat(d3.timeFormat('%b %d')));
  
//   // Add Y axis for sales amount
//   svg.append('g')
//     .attr('class', 'axis y-axis')
//     .call(d3.axisLeft(y1)
//       .ticks(5)
//       .tickFormat(d => `$${d3.format(',.0f')(d)}`));
  
//   // Add Y axis label
//   svg.append('text')
//     .attr('transform', 'rotate(-90)')
//     .attr('y', -margin.left + 15)
//     .attr('x', -height / 2)
//     .attr('dy', '1em')
//     .attr('class', 'axis-label')
//     .style('text-anchor', 'middle')
//     .text('Sales Amount ($)');
  
//   // Add second Y axis for quantity
//   svg.append('g')
//     .attr('class', 'axis y2-axis')
//     .attr('transform', `translate(${width}, 0)`)
//     .call(d3.axisRight(y2)
//       .ticks(5)
//       .tickFormat(d => d3.format(',.0f')(d)));
  
//   // Add second Y axis label
//   svg.append('text')
//     .attr('transform', 'rotate(90)')
//     .attr('y', -width - margin.right + 15)
//     .attr('x', height / 2)
//     .attr('dy', '1em')
//     .attr('class', 'axis-label')
//     .style('text-anchor', 'middle')
//     .text('Units Sold');
  
//   // Add grid lines
//   svg.append('g')
//     .attr('class', 'grid')
//     .call(d3.axisLeft(y1)
//       .ticks(5)
//       .tickSize(-width)
//       .tickFormat(''))
//     .attr('stroke-dasharray', '3,3')
//     .attr('stroke-opacity', 0.2)
//     .select('path')
//     .attr('stroke-width', 0);
  
//   // Add area for sales amount
//   svg.append('path')
//     .datum(processedData)
//     .attr('fill', 'rgba(59, 130, 246, 0.2)')
//     .attr('stroke', 'none')
//     .attr('d', d3.area()
//       .x(d => x(d.date))
//       .y0(height)
//       .y1(d => y1(d.amount))
//       .curve(d3.curveMonotoneX)
//     );
  
//   // Add line for sales amount
//   const salesLine = svg.append('path')
//     .datum(processedData)
//     .attr('fill', 'none')
//     .attr('stroke', 'rgba(59, 130, 246, 0.8)')
//     .attr('stroke-width', 2)
//     .attr('d', d3.line()
//       .x(d => x(d.date))
//       .y(d => y1(d.amount))
//       .curve(d3.curveMonotoneX)
//     );
  
//   // Add line for quantity
//   const quantityLine = svg.append('path')
//     .datum(processedData)
//     .attr('fill', 'none')
//     .attr('stroke', 'rgba(16, 185, 129, 0.8)')
//     .attr('stroke-width', 2)
//     .attr('stroke-dasharray', '4,4')
//     .attr('d', d3.line()
//       .x(d => x(d.date))
//       .y(d => y2(d.quantity))
//       .curve(d3.curveMonotoneX)
//     );
  
//   // Add animation for lines
//   const animateLine = (line) => {
//     const totalLength = line.node().getTotalLength();
//     line
//       .attr('stroke-dasharray', totalLength)
//       .attr('stroke-dashoffset', totalLength)
//       .transition()
//       .duration(1000)
//       .attr('stroke-dashoffset', 0);
//   };
  
//   animateLine(salesLine);
//   animateLine(quantityLine);
  
//   // Add dots for sales amount
//   svg.selectAll('.dot-sales')
//     .data(processedData.filter(d => d.amount > 0))
//     .enter()
//     .append('circle')
//     .attr('class', 'dot-sales')
//     .attr('cx', d => x(d.date))
//     .attr('cy', d => y1(d.amount))
//     .attr('r', 4)
//     .attr('fill', '#3B82F6')
//     .attr('stroke', 'white')
//     .attr('stroke-width', 2)
//     .on('mouseover', function(event, d) {
//       handleMouseOver(event, d, this);
//     })
//     .on('mouseout', handleMouseOut);
  
//   // Add dots for quantity
//   svg.selectAll('.dot-quantity')
//     .data(processedData.filter(d => d.quantity > 0))
//     .enter()
//     .append('circle')
//     .attr('class', 'dot-quantity')
//     .attr('cx', d => x(d.date))
//     .attr('cy', d => y2(d.quantity))
//     .attr('r', 4)
//     .attr('fill', '#10B981')
//     .attr('stroke', 'white')
//     .attr('stroke-width', 2)
//     .on('mouseover', function(event, d) {
//       handleMouseOver(event, d, this);
//     })
//     .on('mouseout', handleMouseOut);
// };
const aggregateDataByDay = (data) => {
  const dailyData = new Map();
  
  data.forEach(item => {
    const dateStr = item.date.toISOString().split('T')[0];
    if (dailyData.has(dateStr)) {
      const existing = dailyData.get(dateStr);
      existing.amount += item.amount;
      existing.quantity += item.quantity;
    } else {
      dailyData.set(dateStr, {
        date: new Date(dateStr),
        amount: item.amount,
        quantity: item.quantity,
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
      amount: 0,
      quantity: 0
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
  const margin = { top: 20, right: 60, bottom: 40, left: 70 };
  const width = chartContainer.value.clientWidth - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select(chartContainer.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Create tooltip
  tooltip = d3.select(chartContainer.value)
    .append('div')
    .attr('class', 'chart-tooltip')
    .style('opacity', 0);
  
  // Set scales
  const x = d3.scaleTime()
    .domain(d3.extent(processedData, d => d.date))
    .range([0, width]);
  
  const y1 = d3.scaleLinear()
    .domain([0, d3.max(processedData, d => d.amount) * 1.1 || 1000])
    .range([height, 0]);
  
  const y2 = d3.scaleLinear()
    .domain([0, d3.max(processedData, d => d.quantity) * 1.1 || 10])
    .range([height, 0]);
  
  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .attr('class', 'axis x-axis')
    .call(d3.axisBottom(x)
      .ticks(Math.min(width > 600 ? 10 : 5, processedData.length))
      .tickFormat(d3.timeFormat('%b %d')));
  
  // Add Y axis for sales amount
  svg.append('g')
    .attr('class', 'axis y-axis')
    .call(d3.axisLeft(y1)
      .ticks(5)
      .tickFormat(d => `$${d3.format(',.0f')(d)}`));
  
  // Add Y axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 15)
    .attr('x', -height / 2)
    .attr('dy', '1em')
    .attr('class', 'axis-label')
    .style('text-anchor', 'middle')
    .text('Sales Amount ($)');
  
  // Add second Y axis for quantity
  svg.append('g')
    .attr('class', 'axis y2-axis')
    .attr('transform', `translate(${width}, 0)`)
    .call(d3.axisRight(y2)
      .ticks(5)
      .tickFormat(d => d3.format(',.0f')(d)));
  
  // Add second Y axis label
  svg.append('text')
    .attr('transform', 'rotate(90)')
    .attr('y', -width - margin.right + 15)
    .attr('x', height / 2)
    .attr('dy', '1em')
    .attr('class', 'axis-label')
    .style('text-anchor', 'middle')
    .text('Units Sold');
  
  // Add grid lines
  svg.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(y1)
      .ticks(5)
      .tickSize(-width)
      .tickFormat(''))
    .attr('stroke-dasharray', '3,3')
    .attr('stroke-opacity', 0.2)
    .select('path')
    .attr('stroke-width', 0);
  
  // Add area for sales amount
  svg.append('path')
    .datum(processedData)
    .attr('fill', 'rgba(59, 130, 246, 0.2)')
    .attr('stroke', 'none')
    .attr('d', d3.area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y1(d.amount))
      .curve(d3.curveMonotoneX)
    );
  
  // Add line for sales amount
  const salesLine = svg.append('path')
    .datum(processedData)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(59, 130, 246, 0.8)')
    .attr('stroke-width', 2)
    .attr('d', d3.line()
      .x(d => x(d.date))
      .y(d => y1(d.amount))
      .curve(d3.curveMonotoneX)
    );
  
  // Add line for quantity
  const quantityLine = svg.append('path')
    .datum(processedData)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(16, 185, 129, 0.8)')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '4,4')
    .attr('d', d3.line()
      .x(d => x(d.date))
      .y(d => y2(d.quantity))
      .curve(d3.curveMonotoneX)
    );
  
  // Add animation for lines
  const animateLine = (line) => {
    const totalLength = line.node().getTotalLength();
    line
      .attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1000)
      .attr('stroke-dashoffset', 0);
  };
  
  animateLine(salesLine);
  animateLine(quantityLine);
  
  // Add dots for sales amount
  svg.selectAll('.dot-sales')
    .data(processedData.filter(d => d.amount > 0))
    .enter()
    .append('circle')
    .attr('class', 'dot-sales')
    .attr('cx', d => x(d.date))
    .attr('cy', d => y1(d.amount))
    .attr('r', 4)
    .attr('fill', '#3B82F6')
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .on('mouseover', function(event, d) {
      handleMouseOver(event, d, this);
    })
    .on('mouseout', handleMouseOut);
  
  // Add dots for quantity
  svg.selectAll('.dot-quantity')
    .data(processedData.filter(d => d.quantity > 0))
    .enter()
    .append('circle')
    .attr('class', 'dot-quantity')
    .attr('cx', d => x(d.date))
    .attr('cy', d => y2(d.quantity))
    .attr('r', 4)
    .attr('fill', '#10B981')
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .on('mouseover', function(event, d) {
      handleMouseOver(event, d, this);
    })
    .on('mouseout', handleMouseOut);
};

const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    drawChart();
  }, 300);
};

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

:deep(.axis path),
:deep(.axis line) {
  stroke: #e5e7eb;
}

:deep(.axis text) {
  fill: #6b7280;
  font-size: 12px;
}

:deep(.axis-label) {
  fill: #6b7280;
  font-size: 12px;
}

:deep(.grid line) {
  stroke: #e5e7eb;
}
</style>