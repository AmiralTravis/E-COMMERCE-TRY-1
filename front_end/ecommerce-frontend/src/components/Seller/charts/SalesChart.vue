<!-- /components/Seller/charts/SalesChart.vue -->

<!-- <template>
    <div class="chart-wrapper">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
      <div class="chart-container" ref="chartContainer"></div>
    </div>
  </template> -->
  <template>
    <div class="chart-wrapper">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
      <div v-else-if="!chartData || chartData.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="text-gray-500 mt-2">No data available for selected period</p>
      </div>
      <div v-else class="chart-container" ref="chartContainer"></div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
  import * as d3 from 'd3';
  
  
  const props = defineProps({
    chartData: {
      type: Array,
      required: true,
    },
    view: {
      type: String,
      default: 'daily',
    },
    timeFrame: {
      type: String,
      default: 'today',
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });
  
  const chartContainer = ref(null);
  let chart = null;
  let resizeObserver = null;
  
  
  const generateDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  };
  
  
  const drawChart = () => {
    if (!chartContainer.value) return;
    d3.select(chartContainer.value).selectAll('*').remove();

    // if (!chartContainer.value || props.chartData.length === 0) return;
    if (!props.chartData?.length) return;
    
    // Clear previous chart
    d3.select(chartContainer.value).selectAll('*').remove();
    
    // Set dimensions
    const margin = { top: 20, right: 50, bottom: 50, left: 70 };
    const width = chartContainer.value.clientWidth - margin.left - margin.right;
    const height = chartContainer.value.clientHeight - margin.top - margin.bottom;
    
    console.log("chart container height:", chartContainer.value.clientHeight); //add this line
  
    // Create SVG with responsive attributes
    const svg = d3.select(chartContainer.value)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    // Generate full date range
    const startDate = new Date(props.startDate);
    const endDate = new Date(props.endDate);
    const fullDateRange = generateDateRange(startDate, endDate);
    
    // Format the data and make sure dates are actual Date objects
    const formattedData = fullDateRange.map(date => {
      // Filter all sales entries for the current date
      // const salesOnDate = props.chartData.filter(d => {
      //   const saleDate = new Date(d.date);
      //   return saleDate.toDateString() === date.toDateString();
      // });
      // Use ISO date comparison to avoid timezone issues
  const targetDate = date.toISOString().split('T')[0];
  const salesOnDate = props.chartData.filter(d => {
    const saleDate = new Date(d.date);
    return saleDate.toISOString().split('T')[0] === targetDate;
  });

      // Sum the amounts for this date
      const totalAmount = salesOnDate.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
      
      return {
        date,
        amount: totalAmount,
        // If needed for tooltips, sum other fields like orderCount
        orderCount: salesOnDate.length
      };
    });
  
    console.log("Formatted Data:", formattedData);
  
    // Sort data by date
    formattedData.sort((a, b) => a.date - b.date);
    
    // X scale with proper domain padding
    const xExtent = d3.extent(formattedData, d => d.date);
    // Add 5% padding to the domain
    const xDomainPadding = (xExtent[1] - xExtent[0]) * 0.05;
    
    const x = d3.scaleTime()
      .domain([
        new Date(xExtent[0] - xDomainPadding),
        new Date(xExtent[1].getTime() + xDomainPadding)
      ])
      .range([0, width]);
    
    // Y scale with proper domain padding
    const yMax = d3.max(formattedData, d => d.amount);
    console.log("Y Max:", yMax); // Add this line
  
    const y = d3.scaleLinear()
      .domain([0, yMax * 1.15]) // Add 15% padding to the top
      .range([height, 0]);
    
    
    // Determine appropriate number of ticks based on container width
    const xTicks = Math.max(2, Math.floor(width / 100));
    const yTicks = Math.max(3, Math.floor(height / 50));
    
    // Add X axis with proper formatting based on the view
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .attr('class', 'x-axis');
    
    let xTickFormat;
    if (props.view === 'daily') {
      xTickFormat = d3.timeFormat('%b %d');
    } else if (props.view === 'weekly') {
      xTickFormat = d3.timeFormat('%b %d');
    } else if (props.view === 'monthly') {
      xTickFormat = d3.timeFormat('%b %Y');
    } else {
      xTickFormat = d3.timeFormat('%b %d');
    }
    
    xAxis.call(
      d3.axisBottom(x)
        .ticks(xTicks)
        .tickFormat(xTickFormat)
    );
    
    // Rotate x-axis labels if there are many data points
    if (formattedData.length > 10) {
      xAxis.selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    }
    
    // Add Y axis with appropriate formatting
    svg.append('g')
      .attr('class', 'y-axis')
      .call(
        d3.axisLeft(y)
          .ticks(yTicks)
          .tickFormat(d => `$${d3.format(',.0f')(d)}`)
      );
    
    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(y)
          .ticks(yTicks)
          .tickSize(-width)
          .tickFormat('')
      )
      .attr('stroke-opacity', 0.1);
    
    // Area generator with proper curve
    const area = d3.area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.amount))
      .curve(d3.curveMonotoneX);
    
    // Line generator with proper curve
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.amount))
      .curve(d3.curveMonotoneX);
    
    // Create a clip path for the animation
    svg.append('clipPath')
      .attr('id', 'clip-path')
      .append('rect')
      .attr('width', width)
      .attr('height', height);
    
    // Add the area with animation
    const areaPath = svg.append('path')
      .datum(formattedData)
      .attr('clip-path', 'url(#clip-path)')
      .attr('fill', 'rgba(59, 130, 246, 0.2)')
      .attr('d', area);
    
    // Add the line with animation
    const linePath = svg.append('path')
      .datum(formattedData)
      .attr('clip-path', 'url(#clip-path)')
      .attr('fill', 'none')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 2)
      .attr('d', line);
    
    // Create the rising animation clip rect
    const clipRect = svg.select('#clip-path rect')
      .attr('height', 0)
      .attr('width', width)
      .attr('y', height);
    
    // Add dots with animation (conditionally based on data points)
    let dots;
    if (formattedData.length <= 60) { // Only show dots if we have a reasonable number of data points
      dots = svg.selectAll('.dot')
        .data(formattedData)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.amount))
        .attr('r', 0) // Start with radius 0
        .attr('fill', '#3B82F6')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);
    }
    
    // Set up animation
    // clipRect.transition()
    //   .duration(1500)
    //   .ease(d3.easeExpOut)
    //   .attr('height', height)
    //   .attr('y', 0)
    //   .on('end', function() {
    //     // Remove clip path after animation completes
    //     areaPath.attr('clip-path', null);
    //     linePath.attr('clip-path', null);
        
    //     // Animate the dots appearance
    //     if (dots) {
    //       dots.transition()
    //         .duration(100)
    //         .delay((d, i) => i * 50)
    //         .attr('r', 4);
    //     }
    //   });
    // Instead of waiting for the clip rect animation to complete:
clipRect.transition()
  .duration(1500)
  .ease(d3.easeExpOut)
  .attr('height', height)
  .attr('y', 0);

// Start animating the dots after a shorter delay (e.g., 300ms)
if (dots) {
  dots.transition()
    .delay(300)  // Start during the graph rise animation
    .duration(500)
    .delay((d, i) => 300 + i * 30)  // Shorter delay between dots
    .attr('r', 4);
}

// Remove clip path after animation completes
setTimeout(() => {
  areaPath.attr('clip-path', null);
  linePath.attr('clip-path', null);
}, 1500);

    // Create a more robust tooltip
    const tooltip = d3.select(chartContainer.value)
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('box-shadow', '0 2px 5px rgba(0,0,0,0.1)')
      .style('pointer-events', 'none')
      .style('z-index', '10')
      .style('transition', 'opacity 0.2s');
    
    // Overlay for better tooltip experience
    const overlay = svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');
    
    // Create vertical line for tracking mouse position
    const verticalLine = svg.append('line')
      .attr('class', 'vertical-line')
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5,5')
      .style('opacity', 0);
    
    // Enhanced tooltip behavior
    if (formattedData.length > 0) {
      overlay.on('mousemove', function(event) {
        const bisect = d3.bisector(d => d.date).left;
        const mouseX = d3.pointer(event)[0];
        const x0 = x.invert(mouseX);
        const i = bisect(formattedData, x0, 1);
        const d0 = formattedData[i - 1];
        const d1 = formattedData[i] || d0;
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        
        // Update line position
        verticalLine
          .attr('x1', x(d.date))
          .attr('x2', x(d.date))
          .style('opacity', 1);
        
        // Highlight the nearest dot
        svg.selectAll('.dot')
          .attr('r', 4)
          .attr('stroke-width', 2);
        
        const activeDot = svg.selectAll('.dot')
          .filter(dot => dot.date.getTime() === d.date.getTime());
        
        if (!activeDot.empty()) {
          activeDot
            .attr('r', 6)
            .attr('stroke-width', 3);
        }
        
        // Position and show tooltip
        const tooltipPosition = chartContainer.value.getBoundingClientRect();
        const mousePosition = d3.pointer(event, chartContainer.value);
        
        tooltip
          .style('visibility', 'visible')
          .style('opacity', 1)
          .html(`
            <div>
              <strong>${d.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong><br>
              Sales: $${d.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
              Orders: ${d.orderCount}
            </div>
          `)
          .style('left', `${mousePosition[0] + 15}px`)
          .style('top', `${mousePosition[1] - 15}px`);
      })
      .on('mouseleave', function() {
        // Hide tooltip and vertical line
        tooltip.style('visibility', 'hidden').style('opacity', 0);
        verticalLine.style('opacity', 0);
        
        // Reset dots
        svg.selectAll('.dot')
          .attr('r', 4)
          .attr('stroke-width', 2);
      });
    }
  
    
    return svg;
  };
  
  // Improved resize handler with debounce
  const handleResize = () => {
  if (props.chartData?.length) {
    drawChart();
  }
};
  
  // Set up efficient resize observer
  const setupResizeObserver = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    
    resizeObserver = new ResizeObserver(debounce(() => {
      handleResize();
    }, 100));
    
    if (chartContainer.value) {
      resizeObserver.observe(chartContainer.value);
    }
  };
  
  // Simple debounce function
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
  
  // Watch for changes in data and redraw chart
  watch(() => props.chartData, (newData) => {
  if (!newData?.length) {
    d3.select(chartContainer.value)?.selectAll('*').remove();
  } else {
    drawChart();
  }
}, { deep: true });
  
  watch(() => props.view, () => {
    drawChart();
  });
  
  onMounted(() => {
    chart = drawChart();
    setupResizeObserver();
    
    // Fallback for browsers without ResizeObserver
    if (!window.ResizeObserver) {
      window.addEventListener('resize', debounce(handleResize, 100));
    }
  });
  
  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    
    // Remove fallback listener if it was added
    if (!window.ResizeObserver) {
      window.removeEventListener('resize', handleResize);
    }
  });
  </script>
  
  <!-- <style scoped>
.empty-state {
  @apply absolute inset-0 flex flex-col items-center justify-center text-center p-4;
}

  .chart-wrapper {
    /* position: relative;
    height: 300px;
    width: 100%; */
    @apply relative h-[300px] w-full;

  }
  
  .chart-container {
    height: 100%;
    width: 100%;
  }
  
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(59, 130, 246, 0.2);
    border-radius: 50%;
    border-top-color: #3B82F6;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Enhanced styling for axes and tooltip */
  :deep(.x-axis path),
  :deep(.y-axis path),
  :deep(.x-axis line),
  :deep(.y-axis line) {
    stroke: #ccc;
  }
  
  :deep(.x-axis text),
  :deep(.y-axis text) {
    fill: #666;
    font-size: 12px;
  }
  
  .chart-tooltip {
    font-size: 12px;
    line-height: 1.4;
  }
  </style> -->
  <style scoped>
.empty-state {
  @apply absolute inset-0 flex flex-col items-center justify-center p-4 text-center;
}

.empty-state svg {
  @apply h-12 w-12 text-gray-400;
}

.empty-state p {
  @apply text-gray-500 mt-2;
}

.chart-wrapper {
  @apply relative h-[300px] w-full;
}

.chart-container {
  @apply h-full w-full;
}

.loading-overlay {
  @apply absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10;
}

.loading-spinner {
  @apply w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin;
}

/* Enhanced styling for axes and tooltip */
:deep(.x-axis path),
:deep(.y-axis path),
:deep(.x-axis line),
:deep(.y-axis line) {
  stroke: #e5e7eb;
}

:deep(.x-axis text),
:deep(.y-axis text) {
  fill: #6b7280;
  font-size: 12px;
}

.chart-tooltip {
  @apply absolute px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm;
  z-index: 20;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>