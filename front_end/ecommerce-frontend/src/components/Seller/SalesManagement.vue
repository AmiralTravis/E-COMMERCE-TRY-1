<!-- /components/Seller/SalesManagement.vue -->

<template>
  <div class="sales-dashboard">
    <header class="dashboard-header">
      <h1 class="text-2xl font-bold">Sales Dashboard</h1>
      <div class="date-filter">
        <button 
          v-for="filter in dateFilters" 
          :key="filter.value"
          :class="['filter-btn', { active: currentDateFilter === filter.value }]"
          @click="setDateFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
        <div class="custom-date-picker">
          <input 
            type="date" 
            v-model="customStartDate" 
            class="form-input date-input"
            @change="setDateFilter('custom')"
          />
          <span>to</span>
          <input 
            type="date" 
            v-model="customEndDate" 
            class="form-input date-input"
            @change="setDateFilter('custom')"
          />
          <button 
            class="filter-btn" 
            :class="{ active: currentDateFilter === 'custom' }"
            @click="fetchData"
          >
            Apply
          </button>
        </div>
      </div>
    </header>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-icon bg-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="card-content">
          <h3 class="text-gray-500">Total Sales</h3>
          <p class="text-2xl font-bold">{{ formatCurrency(totalSales) }}</p>
          <p class="text-sm" :class="salesTrend.color">
            <span v-if="salesTrend.icon === 'up'" class="trend-icon">↑</span>
            <span v-else class="trend-icon">↓</span>
            {{ salesTrend.percentage }}% from previous period
          </p>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="card-icon bg-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="card-content">
          <h3 class="text-gray-500">Total Profit</h3>
          <p class="text-2xl font-bold">{{ formatCurrency(totalProfit) }}</p>
          <p class="text-sm" :class="profitTrend.color">
            <span v-if="profitTrend.icon === 'up'" class="trend-icon">↑</span>
            <span v-else class="trend-icon">↓</span>
            {{ profitTrend.percentage }}% from previous period
          </p>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="card-icon bg-purple-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div class="card-content">
          <h3 class="text-gray-500">Orders</h3>
          <p class="text-2xl font-bold">{{ totalOrders }}</p>
          <p class="text-sm" :class="ordersTrend.color">
            <span v-if="ordersTrend.icon === 'up'" class="trend-icon">↑</span>
            <span v-else class="trend-icon">↓</span>
            {{ ordersTrend.percentage }}% from previous period
          </p>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="card-icon bg-amber-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <div class="card-content">
          <h3 class="text-gray-500">Conversion Rate</h3>
          <p class="text-2xl font-bold">{{ conversionRate }}%</p>
          <p class="text-sm" :class="conversionTrend.color">
            <span v-if="conversionTrend.icon === 'up'" class="trend-icon">↑</span>
            <span v-else class="trend-icon">↓</span>
            {{ conversionTrend.percentage }}% from previous period
          </p>
        </div>
      </div>
    </div>

    <!-- Main Charts -->
    <div class="main-charts">
      <div class="chart-container">
        <div class="chart-header">
          <h2 class="chart-title">Sales Performance</h2>
          <!-- <div class="chart-controls">
            <button 
              v-for="view in chartViews" 
              :key="view.value"
              :class="['view-btn', { active: currentChartView === view.value }]"
              @click="setChartView(view.value)"
            >
              {{ view.label }}
            </button>
          </div> -->
        </div>
        <SalesChart 
          :chart-data="chartData.sales" 
          :view="currentChartView" 
          :time-frame="currentDateFilter" 
          :start-date="customStartDate"
  :end-date="customEndDate"
          :loading="isLoading"
        />
      </div>
      
      <div class="chart-container">
        <div class="chart-header">
          <h2 class="chart-title">Profit After Platform Cut</h2>
          <div class="chart-info">
            <span class="text-sm text-gray-500">Platform Fee: {{ platformFeePercentage }}%</span>
          </div>
        </div>
        <ProfitChart 
          :chart-data="chartData.profit" 
          :view="currentChartView"
          :time-frame="currentDateFilter" 
          :start-date="customStartDate"
  :end-date="customEndDate"
          :loading="isLoading"
        />
      </div>
    </div>

    <!-- Product Specific Analytics -->
    <div class="product-analytics">
      <h2 class="section-title">Product Performance</h2>
      
      <div class="product-selector">
        <label for="productSelect" class="text-gray-700">Select Product:</label>
        <div v-if="isProductLoading" class="loading-message">
          Loading products...
        </div>
        <select 
          id="productSelect" 
          v-model="selectedProductId"
          class="form-select"
        >
          <option value="">All Products</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
      </div>

      
      <div v-if="selectedProductId" class="product-detail">
  <div class="product-info">
    <h3 class="product-name">{{ selectedProduct.name }}</h3>
    <div class="product-metrics">
      <div class="metric">
        <span class="metric-label">Total Sales:</span>
        <span class="metric-value">{{ formatCurrency(selectedProduct.totalSales) }}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Units Sold:</span>
        <span class="metric-value">{{ selectedProduct.unitsSold }}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Current Stock:</span>
        <span class="metric-value">{{ selectedProduct.stock }}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Profit Margin:</span>
        <span class="metric-value">{{ selectedProduct.profitMargin }}%</span>
      </div>
    </div>
  </div>

  <div class="product-charts">
    <div class="product-chart">
      <h4 class="chart-subtitle">Sales Trend</h4>
      <ProductSalesChart 
        :chart-data="productChartData.sales" 
        :loading="isProductLoading"
        :start-date="customStartDate"
  :end-date="customEndDate"
  
      />
    </div>

    <div class="product-chart">
      <h4 class="chart-subtitle">Profit Trend</h4>
      <ProductProfitChart 
        :chart-data="productChartData.profit" 
        :loading="isProductLoading"
        :start-date="customStartDate"
  :end-date="customEndDate"
      />
    </div>
  </div>
</div>
      <div v-else class="top-products">
        <h3 class="subsection-title">Top Performing Products</h3>
        <div class="products-grid">
          <div v-for="product in topProducts" :key="product.id" class="product-card">
            <div class="product-card-header">
              <img :src="product.image || '/images/placeholder.png'" alt="Product" class="product-image" />
              <div class="product-stats">
                <h4 class="product-name">{{ product.name }}</h4>
                <div class="product-numbers">
                  <div class="stat">
                    <span class="stat-label">Sales</span>
                    <span class="stat-value">{{ formatCurrency(product.totalSales) }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Units</span>
                    <span class="stat-value">{{ product.unitsSold }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="product-trend">
              <!-- <ProductTrendChart 
                :chart-data="product.trendData" 
                :color="product.trendColor"
              /> -->
              <ProductTrendChart 
              :chart-data="salesData" 

  

  :loading="isLoading"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Inventory Status -->
    <div class="inventory-status">
      <div class="inventory-header">
        <h2 class="section-title">Inventory Status</h2>
        <button class="btn-primary" @click="goToInventory">Manage Inventory</button>
      </div>
      
      <div class="inventory-cards">
        <div class="inventory-card">
          <div class="card-header bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="text-red-600">Low Stock Items</h3>
          </div>
          <div class="card-body">
            <p class="text-2xl font-bold">{{ lowStockCount }}</p>
            <p class="text-sm text-gray-500">Products below threshold</p>
          </div>
        </div>
        
        <div class="inventory-card">
          <div class="card-header bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 class="text-green-600">Healthy Stock</h3>
          </div>
          <div class="card-body">
            <p class="text-2xl font-bold">{{ healthyStockCount }}</p>
            <p class="text-sm text-gray-500">Products with adequate stock</p>
          </div>
        </div>
        
        <div class="inventory-card">
          <div class="card-header bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <h3 class="text-blue-600">Total SKUs</h3>
          </div>
          <div class="card-body">
            <p class="text-2xl font-bold">{{ totalSkus }}</p>
            <p class="text-sm text-gray-500">Active products</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <script setup>

import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import SalesChart from './charts/SalesChart.vue';
import ProfitChart from './charts/ProfitChart.vue';
import ProductSalesChart from './charts/ProductSalesChart.vue';
import ProductProfitChart from './charts/ProductProfitChart.vue';
import ProductTrendChart from './charts/ProductTrendChart.vue';

const router = useRouter();

// State Management
const isLoading = ref(true);
const isProductLoading = ref(false);
const currentDateFilter = ref('week');
const currentChartView = ref('daily');
const customStartDate = ref('');
const customEndDate = ref('');
const selectedProductId = ref('');
const platformFeePercentage = ref(15); // Example platform fee

// Data storage
const salesData = ref([]);
const profitData = ref([]);
const products = ref([]);
const productSalesData = ref({});

// Date filters
const today = new Date().toISOString().split('T')[0];
const dateFilters = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' }
];

// Chart views
const chartViews = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
];

// Computed properties

const totalSales = computed(() => {
  return salesData.value.reduce((sum, item) => sum + parseFloat(item.amount), 0);
});

const totalProfit = computed(() => {
  return profitData.value.reduce((sum, item) => sum + parseFloat(item.amount), 0);
});

const totalOrders = computed(() => {
  return salesData.value.length; // Use the length of salesData as the total number of orders
});

const conversionRate = computed(() => {
  const totalVisitors = 1000; // Replace with actual visitor count if available
  const totalOrders = salesData.value.length;

  return totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(2) : 0;
});

const chartData = computed(() => {
  return {
    sales: processChartData(salesData.value, currentChartView.value),
    profit: processChartData(profitData.value, currentChartView.value)
  };
});

const productChartData = computed(() => {
  if (!selectedProductId.value) return { sales: [], profit: [] };
  
  const productData = productSalesData.value[selectedProductId.value] || { sales: [], profit: [] };
  return {
    sales: processChartData(productData.sales, currentChartView.value),
    profit: processChartData(productData.profit, currentChartView.value)
  };
});



const topProducts = computed(() => {
  // Get top 6 products by sales
  const sortedProducts = [...products.value]
    .map(product => {
      const productData = productSalesData.value[product.id] || { sales: [] };
      const totalSales = productData.sales.reduce((sum, item) => sum + item.amount, 0);
      const unitsSold = productData.sales.reduce((sum, item) => sum + item.quantity, 0);
      
      // Generate trend data for small chart
      const trendData = productData.sales.slice(-7).map(item => item.amount);
      const trendColor = trendData[trendData.length - 1] > trendData[0] ? '#10B981' : '#EF4444';
      
      return {
        ...product,
        totalSales,
        unitsSold,
        trendData,
        trendColor
      };
    })
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 6);
    
  return sortedProducts;
});

// Inventory stats

const lowStockCount = ref(0);
const healthyStockCount = ref(0);
const totalSkus = ref(0);

// Trend calculations
const salesTrend = computed(() => {
  return calculateTrend(salesData.value);
});

const profitTrend = computed(() => {
  return calculateTrend(profitData.value);
});

const ordersTrend = computed(() => {
  if (salesData.value.length < 2) return { percentage: 0, icon: 'up', color: 'text-gray-500' };

  // Split data into two halves
  const midPoint = Math.floor(salesData.value.length / 2);
  const previousPeriod = salesData.value.slice(0, midPoint);
  const currentPeriod = salesData.value.slice(midPoint);

  // Calculate sums for each period
  const previousOrders = previousPeriod.length;
  const currentOrders = currentPeriod.length;

  if (previousOrders === 0) return { percentage: 100, icon: 'up', color: 'text-green-500' };

  // Calculate percentage change
  const percentageChange = ((currentOrders - previousOrders) / previousOrders) * 100;
  const roundedPercentage = Math.abs(percentageChange).toFixed(1);

  return {
    percentage: roundedPercentage,
    icon: percentageChange >= 0 ? 'up' : 'down',
    color: percentageChange >= 0 ? 'text-green-500' : 'text-red-500',
  };
});


const conversionTrend = computed(() => {
  if (salesData.value.length < 2) return { percentage: 0, icon: 'up', color: 'text-gray-500' };

  // Split data into two halves
  const midPoint = Math.floor(salesData.value.length / 2);
  const previousPeriod = salesData.value.slice(0, midPoint);
  const currentPeriod = salesData.value.slice(midPoint);

  // Calculate conversion rates for each period
  const previousVisitors = 1000; // Replace with actual visitor count if available
  const currentVisitors = 1000; // Replace with actual visitor count if available

  const previousConversion = (previousPeriod.length / previousVisitors) * 100;
  const currentConversion = (currentPeriod.length / currentVisitors) * 100;

  if (previousConversion === 0) return { percentage: 100, icon: 'up', color: 'text-green-500' };

  // Calculate percentage change
  const percentageChange = ((currentConversion - previousConversion) / previousConversion) * 100;
  const roundedPercentage = Math.abs(percentageChange).toFixed(1);

  return {
    percentage: roundedPercentage,
    icon: percentageChange >= 0 ? 'up' : 'down',
    color: percentageChange >= 0 ? 'text-green-500' : 'text-red-500',
  };
});

// Methods

const setChartView = (view) => {
  currentChartView.value = view;
};

const goToInventory = () => {
  router.push('/seller/manage-products');
};


const formatCurrency = (value) => {
  const numericValue = parseFloat(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(isNaN(numericValue) ? 0 : numericValue);
};

const processChartData = (data, view) => {
  // This would transform your raw data based on the selected view (daily, weekly, monthly)
  // For demonstration, we'll just return the data as is
  return data;
};

const calculateTrend = (data) => {
  if (data.length < 2) return { percentage: 0, icon: 'up', color: 'text-gray-500' };

  // Split data into two halves
  const midPoint = Math.floor(data.length / 2);
  const previousPeriod = data.slice(0, midPoint);
  const currentPeriod = data.slice(midPoint);

  // Calculate sums for each period
  const previousSum = previousPeriod.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const currentSum = currentPeriod.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  if (previousSum === 0) return { percentage: 100, icon: 'up', color: 'text-green-500' };

  // Calculate percentage change
  const percentageChange = ((currentSum - previousSum) / previousSum) * 100;
  const roundedPercentage = Math.abs(percentageChange).toFixed(1);

  return {
    percentage: roundedPercentage,
    icon: percentageChange >= 0 ? 'up' : 'down',
    color: percentageChange >= 0 ? 'text-green-500' : 'text-red-500'
  };
};

const fetchData = async () => {
  isLoading.value = true;

  try {
    // Extend the date range by one day on either side
    const extendedStartDate = new Date(customStartDate.value);
    extendedStartDate.setDate(extendedStartDate.getDate() - 1); // Subtract one day

    const extendedEndDate = new Date(customEndDate.value);
    extendedEndDate.setDate(extendedEndDate.getDate() + 1); // Add one day

    const [salesResponse, inventoryResponse] = await Promise.all([
      api.get('/seller/sales', {
        params: {
          startDate: extendedStartDate.toISOString().split('T')[0], // Send extended start date
          endDate: extendedEndDate.toISOString().split('T')[0], // Send extended end date
        },
      }),
      api.get('/seller/inventory-status'),
    ]);

    salesData.value = salesResponse.data;
    profitData.value = salesResponse.data.map((item) => ({
      date: item.date,
      amount: item.profit,
    }));

    // Update refs instead of computed properties
    lowStockCount.value = inventoryResponse.data.lowStockCount;
    healthyStockCount.value = inventoryResponse.data.healthyStockCount;
    totalSkus.value = inventoryResponse.data.totalSkus;
  } catch (error) {
    console.error('Error fetching sales data:', error);
  } finally {
    isLoading.value = false;
  }
};


const fetchProducts = async () => {
  isProductLoading.value = true;
  try {
    const response = await api.get('/seller/products');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    isProductLoading.value = false;
  }
};

const fetchProductData = async (productId) => {
  if (!productId) return;

  isProductLoading.value = true;

  try {
    const response = await api.get(`/seller/products/${productId}/performance`, {
      params: {
        startDate: customStartDate.value,
        endDate: customEndDate.value,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token
      },
    });

    // Transform data for charts
    const transformedData = response.data.map((item) => ({
      date: new Date(item.date),
      amount: parseFloat(item.amount),
      quantity: item.quantity,
      profit: item.profit,
    }));

    // Store transformed data
    productSalesData.value[productId] = {
      sales: transformedData,
      profit: transformedData,
      trend: transformedData.map((item) => item.amount),
    };

    console.log('End Date:', customEndDate.value);
// console.log('Seller ID:', sellerId);
console.log('Product ID:', productId);
  } catch (error) {
    console.error('Error fetching product data:', error);
  } finally {
    isProductLoading.value = false;
  }
};


const selectedProduct = computed(() => {
  if (!selectedProductId.value) return null;

  const product = products.value.find((p) => p.id === selectedProductId.value);
  if (!product) return null;

  // Calculate product-specific metrics
  const productData = productSalesData.value[selectedProductId.value];
  if (!productData) return product;

  const totalSales = productData.sales.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const totalProfit = productData.profit.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const unitsSold = productData.sales.reduce((sum, item) => sum + item.quantity, 0);
  const profitMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(2) : 0;

  return {
    ...product,
    totalSales,
    unitsSold,
    profitMargin,
  };
});

const generateMockSalesData = () => {
  const days = 30;
  const result = [];
  
  let date = new Date();
  date.setDate(date.getDate() - days);
  
  for (let i = 0; i < days; i++) {
    date.setDate(date.getDate() + 1);
    
    // Generate random sales amount between 500 and 5000
    const amount = Math.random() * 4500 + 500;
    // Generate random order count between 5 and 50
    const orderCount = Math.floor(Math.random() * 45) + 5;
    
    result.push({
      date: new Date(date),
      amount,
      orderCount
    });
  }
  
  return result;
};

const generateMockProfitData = (salesData) => {
  // Calculate profit as a percentage of sales (after platform cut)
  return salesData.map(item => {
    const platformFee = item.amount * (platformFeePercentage.value / 100);
    const profit = item.amount - platformFee;
    
    return {
      date: item.date,
      amount: profit,
      orderCount: item.orderCount
    };
  });
};

const generateMockProducts = () => {
  // Generate 20 mock products
  const products = [];
  
  for (let i = 1; i <= 20; i++) {
    products.push({
      id: `product-${i}`,
      name: `Product ${i}`,
      stock: Math.floor(Math.random() * 100),
      price: Math.random() * 200 + 10,
      costPrice: Math.random() * 100 + 5,
      image: i <= 6 ? `/images/product-${i}.jpg` : null
    });
  }
  
  return products;
};

const generateMockProductSalesData = () => {
  const result = {};
  
  // For each product, generate sales and profit data
  products.value.forEach(product => {
    const productSales = generateMockSalesData().map(item => ({
      ...item,
      amount: item.amount * (Math.random() * 0.5 + 0.1), // 10% to 60% of total sales
      quantity: Math.floor(Math.random() * 20) + 1
    }));
    
    const productProfit = productSales.map(item => {
      const platformFee = item.amount * (platformFeePercentage.value / 100);
      const costTotal = product.costPrice * item.quantity;
      const profit = item.amount - platformFee - costTotal;
      
      return {
        date: item.date,
        amount: profit,
        quantity: item.quantity
      };
    });
    
    result[product.id] = {
      sales: productSales,
      profit: productProfit
    };
  });
  
  return result;
};

// Watchers
// Add this watch in your <script setup> section
watch([customStartDate, customEndDate], () => {
  if (selectedProductId.value) {
    fetchProductData(selectedProductId.value);
  }
});

watch(selectedProductId, (newValue) => {
  if (newValue) {
    fetchProductData(newValue);
  }
});
onMounted(() => {
  // Set default time frame to "Today"
  currentDateFilter.value = 'today';
  setDateFilter('today'); // Trigger the "Today" button and fetch data
  fetchProducts();
});

const setDateFilter = (filter) => {
  currentDateFilter.value = filter;

  const today = new Date();
  let startDate, endDate;

  switch (filter) {
    case 'today':
      startDate = new Date(today);
      endDate = new Date(today);
      break;
    case 'week':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
      endDate = new Date(today);
      endDate.setDate(today.getDate() + (6 - today.getDay())); // End of the week (Saturday)
      break;
    case 'month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the month
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of the month
      break;
    case 'quarter':
      const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
      startDate = new Date(today.getFullYear(), quarterStartMonth, 1); // Start of the quarter
      endDate = new Date(today.getFullYear(), quarterStartMonth + 3, 0); // End of the quarter
      break;
    case 'year':
      startDate = new Date(today.getFullYear(), 0, 1); // Start of the year
      endDate = new Date(today.getFullYear(), 11, 31); // End of the year
      break;
    default:
      // For custom dates, do nothing (user will click "Apply")
      return;
  }

  // Update the custom date inputs
  customStartDate.value = startDate.toISOString().split('T')[0];
  customEndDate.value = endDate.toISOString().split('T')[0];

  // Fetch data for the new date range
  fetchData();

  // Fetch product data if a product is selected
  if (selectedProductId.value) {
    fetchProductData(selectedProductId.value);
  }
};


</script> -->
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import SalesChart from './charts/SalesChart.vue';
import ProfitChart from './charts/ProfitChart.vue';
import ProductSalesChart from './charts/ProductSalesChart.vue';
import ProductProfitChart from './charts/ProductProfitChart.vue';
import ProductTrendChart from './charts/ProductTrendChart.vue';

const router = useRouter();

// State Management
const isLoading = ref(true);
const isProductLoading = ref(false);
const currentDateFilter = ref('week');
const currentChartView = ref('daily');
const customStartDate = ref('');
const customEndDate = ref('');
const selectedProductId = ref('');
const platformFeePercentage = ref(15); // Example platform fee

// Data storage
const salesData = ref([]);
const profitData = ref([]);
const products = ref([]);
const productSalesData = ref({});

// Date filters
const today = new Date().toISOString().split('T')[0];
const dateFilters = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' }
];

// Chart views
const chartViews = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
];

// Computed properties
const totalSales = computed(() => {
  return salesData.value.reduce((sum, item) => sum + parseFloat(item.amount), 0);
});

const totalProfit = computed(() => {
  return profitData.value.reduce((sum, item) => sum + parseFloat(item.amount), 0);
});

const totalOrders = computed(() => {
  return salesData.value.length; // Use the length of salesData as the total number of orders
});

const conversionRate = computed(() => {
  const totalVisitors = 1000; // Replace with actual visitor count if available
  const totalOrders = salesData.value.length;

  return totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(2) : 0;
});

const chartData = computed(() => {
  return {
    sales: processChartData(salesData.value, currentChartView.value),
    profit: processChartData(profitData.value, currentChartView.value)
  };
});

const productChartData = computed(() => {
  if (!selectedProductId.value) return { sales: [], profit: [] };
  
  const productData = productSalesData.value[selectedProductId.value] || { sales: [], profit: [] };
  return {
    sales: processChartData(productData.sales, currentChartView.value),
    profit: processChartData(productData.profit, currentChartView.value)
  };
});

const topProducts = computed(() => {
  // Get top 6 products by sales
  const sortedProducts = [...products.value]
    .map(product => {
      const productData = productSalesData.value[product.id] || { sales: [] };
      const totalSales = productData.sales.reduce((sum, item) => sum + item.amount, 0);
      const unitsSold = productData.sales.reduce((sum, item) => sum + item.quantity, 0);
      
      // Generate trend data for small chart
      const trendData = productData.sales.slice(-7).map(item => item.amount);
      const trendColor = trendData[trendData.length - 1] > trendData[0] ? '#10B981' : '#EF4444';
      
      return {
        ...product,
        totalSales,
        unitsSold,
        trendData,
        trendColor
      };
    })
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 6);
    
  return sortedProducts;
});

// Inventory stats
const lowStockCount = ref(0);
const healthyStockCount = ref(0);
const totalSkus = ref(0);

// Trend calculations
const salesTrend = computed(() => {
  return calculateTrend(salesData.value);
});

const profitTrend = computed(() => {
  return calculateTrend(profitData.value);
});

const ordersTrend = computed(() => {
  if (salesData.value.length < 2) return { percentage: 0, icon: 'up', color: 'text-gray-500' };

  // Split data into two halves
  const midPoint = Math.floor(salesData.value.length / 2);
  const previousPeriod = salesData.value.slice(0, midPoint);
  const currentPeriod = salesData.value.slice(midPoint);

  // Calculate sums for each period
  const previousOrders = previousPeriod.length;
  const currentOrders = currentPeriod.length;

  if (previousOrders === 0) return { percentage: 100, icon: 'up', color: 'text-green-500' };

  // Calculate percentage change
  const percentageChange = ((currentOrders - previousOrders) / previousOrders) * 100;
  const roundedPercentage = Math.abs(percentageChange).toFixed(1);

  return {
    percentage: roundedPercentage,
    icon: percentageChange >= 0 ? 'up' : 'down',
    color: percentageChange >= 0 ? 'text-green-500' : 'text-red-500',
  };
});

const conversionTrend = computed(() => {
  if (salesData.value.length < 2) return { percentage: 0, icon: 'up', color: 'text-gray-500' };

  // Split data into two halves
  const midPoint = Math.floor(salesData.value.length / 2);
  const previousPeriod = salesData.value.slice(0, midPoint);
  const currentPeriod = salesData.value.slice(midPoint);

  // Calculate conversion rates for each period
  const previousVisitors = 1000; // Replace with actual visitor count if available
  const currentVisitors = 1000; // Replace with actual visitor count if available

  const previousConversion = (previousPeriod.length / previousVisitors) * 100;
  const currentConversion = (currentPeriod.length / currentVisitors) * 100;

  if (previousConversion === 0) return { percentage: 100, icon: 'up', color: 'text-green-500' };

  // Calculate percentage change
  const percentageChange = ((currentConversion - previousConversion) / previousConversion) * 100;
  const roundedPercentage = Math.abs(percentageChange).toFixed(1);

  return {
    percentage: roundedPercentage,
    icon: percentageChange >= 0 ? 'up' : 'down',
    color: percentageChange >= 0 ? 'text-green-500' : 'text-red-500',
  };
});

// Methods
const setChartView = (view) => {
  currentChartView.value = view;
};

const goToInventory = () => {
  router.push('/seller/manage-products');
};

const formatCurrency = (value) => {
  const numericValue = parseFloat(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(isNaN(numericValue) ? 0 : numericValue);
};

const processChartData = (data, view) => {
  // This would transform your raw data based on the selected view (daily, weekly, monthly)
  // For demonstration, we'll just return the data as is
  return data;
};

const calculateTrend = (data) => {
  if (data.length < 2) return { percentage: 0, icon: 'up', color: 'text-gray-500' };

  // Split data into two halves
  const midPoint = Math.floor(data.length / 2);
  const previousPeriod = data.slice(0, midPoint);
  const currentPeriod = data.slice(midPoint);

  // Calculate sums for each period
  const previousSum = previousPeriod.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const currentSum = currentPeriod.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  if (previousSum === 0) return { percentage: 100, icon: 'up', color: 'text-green-500' };

  // Calculate percentage change
  const percentageChange = ((currentSum - previousSum) / previousSum) * 100;
  const roundedPercentage = Math.abs(percentageChange).toFixed(1);

  return {
    percentage: roundedPercentage,
    icon: percentageChange >= 0 ? 'up' : 'down',
    color: percentageChange >= 0 ? 'text-green-500' : 'text-red-500'
  };
};

const fetchData = async () => {
  isLoading.value = true;

  try {
    // Extend the date range by one day on either side
    const extendedStartDate = new Date(customStartDate.value);
    extendedStartDate.setDate(extendedStartDate.getDate() - 1); // Subtract one day

    const extendedEndDate = new Date(customEndDate.value);
    extendedEndDate.setDate(extendedEndDate.getDate() + 1); // Add one day

    const [salesResponse, inventoryResponse] = await Promise.all([
      api.get('/seller/sales', {
        params: {
          startDate: extendedStartDate.toISOString().split('T')[0], // Send extended start date
          endDate: extendedEndDate.toISOString().split('T')[0], // Send extended end date
        },
      }),
      api.get('/seller/inventory-status'),
    ]);

    salesData.value = salesResponse.data;
    profitData.value = salesResponse.data.map((item) => ({
      date: item.date,
      amount: item.profit,
    }));

    // Update refs instead of computed properties
    lowStockCount.value = inventoryResponse.data.lowStockCount;
    healthyStockCount.value = inventoryResponse.data.healthyStockCount;
    totalSkus.value = inventoryResponse.data.totalSkus;
  } catch (error) {
    console.error('Error fetching sales data:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchProducts = async () => {
  isProductLoading.value = true;
  try {
    const response = await api.get('/seller/products');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    isProductLoading.value = false;
  }
};

const fetchProductData = async (productId) => {
  if (!productId) return;

  isProductLoading.value = true;

  try {
    const response = await api.get(`/seller/sales`, {
      params: {
        productId: productId,
        startDate: customStartDate.value,
        endDate: customEndDate.value,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token
      },
    });

    // Transform data for charts
    const transformedData = response.data.map((item) => ({
      date: new Date(item.date),
      amount: parseFloat(item.amount),
      quantity: item.quantity,
      profit: item.profit,
    }));

    // Store transformed data
    productSalesData.value[productId] = {
      sales: transformedData,
      profit: transformedData,
      trend: transformedData.map((item) => item.amount),
    };

    console.log('End Date:', customEndDate.value);
    console.log('Product ID:', productId);
  } catch (error) {
    console.error('Error fetching product data:', error);
  } finally {
    isProductLoading.value = false;
  }
};

const selectedProduct = computed(() => {
  if (!selectedProductId.value) return null;

  const product = products.value.find((p) => p.id === selectedProductId.value);
  if (!product) return null;

  // Calculate product-specific metrics
  const productData = productSalesData.value[selectedProductId.value];
  if (!productData) return product;

  const totalSales = productData.sales.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const totalProfit = productData.profit.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const unitsSold = productData.sales.reduce((sum, item) => sum + item.quantity, 0);
  const profitMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(2) : 0;

  return {
    ...product,
    totalSales,
    unitsSold,
    profitMargin,
  };
});

// Watchers
watch([customStartDate, customEndDate], () => {
  if (selectedProductId.value) {
    fetchProductData(selectedProductId.value);
  }
});

watch(selectedProductId, (newValue) => {
  if (newValue) {
    fetchProductData(newValue);
  }
});

onMounted(() => {
  // Set default time frame to "Today"
  currentDateFilter.value = 'today';
  setDateFilter('today'); // Trigger the "Today" button and fetch data
  fetchProducts();
});

const setDateFilter = (filter) => {
  currentDateFilter.value = filter;

  const today = new Date();
  let startDate, endDate;

  switch (filter) {
    case 'today':
      startDate = new Date(today);
      endDate = new Date(today);
      break;
    case 'week':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
      endDate = new Date(today);
      endDate.setDate(today.getDate() + (6 - today.getDay())); // End of the week (Saturday)
      break;
    case 'month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the month
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of the month
      break;
    case 'quarter':
      const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
      startDate = new Date(today.getFullYear(), quarterStartMonth, 1); // Start of the quarter
      endDate = new Date(today.getFullYear(), quarterStartMonth + 3, 0); // End of the quarter
      break;
    case 'year':
      startDate = new Date(today.getFullYear(), 0, 1); // Start of the year
      endDate = new Date(today.getFullYear(), 11, 31); // End of the year
      break;
    default:
      // For custom dates, do nothing (user will click "Apply")
      return;
  }

  // Update the custom date inputs
  customStartDate.value = startDate.toISOString().split('T')[0];
  customEndDate.value = endDate.toISOString().split('T')[0];

  // Fetch data for the new date range
  fetchData();

  // Fetch product data if a product is selected
  if (selectedProductId.value) {
    fetchProductData(selectedProductId.value);
  }
};
</script>

<style scoped>
.sales-dashboard {
  @apply max-w-7xl mx-auto px-4 py-6;
}

.dashboard-header {
  @apply flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4;
}

.date-filter {
  @apply flex flex-wrap items-center gap-2;
}

.filter-btn {
  @apply px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors;
}

.filter-btn.active {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.custom-date-picker {
  @apply flex items-center gap-2;
}

.date-input {
  @apply w-32 px-2 py-1 text-sm border border-gray-300 rounded-md;
}

.summary-cards {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8;
}

.summary-card {
  @apply bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4;
}

.card-icon {
  @apply p-3 rounded-full;
}

.card-content {
  @apply flex-1;
}

.trend-icon {
  @apply inline-block mr-1;
}

.main-charts {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8;
}

.chart-container {
  @apply bg-white p-4 rounded-lg shadow-sm border border-gray-200;
}

.chart-header {
  @apply flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2;
}

.chart-title {
  @apply text-lg font-medium;
}

/* .chart-controls {
  @apply flex gap-2;
} */

.view-btn {
  @apply px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors;
}

.view-btn.active {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.chart-info {
  @apply text-right;
}

.product-analytics {
  @apply bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-16;
}

.section-title {
  @apply text-lg font-medium mb-6;
}

.product-selector {
  @apply flex items-center gap-4 mb-6;
}

.form-select {
  @apply px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px];
}

.product-detail {
  @apply space-y-6;
}

.product-info {
  @apply p-4 bg-gray-50 rounded-lg;
}

.product-name {
  @apply text-lg font-medium mb-4;
}

.product-metrics {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

.metric {
  @apply flex flex-col;
}

.metric-label {
  @apply text-sm text-gray-500;
}

.metric-value {
  @apply text-lg font-medium;
}

.product-charts {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.product-chart {
  @apply border border-gray-200 rounded-lg p-4;
}

.chart-subtitle {
  @apply text-base font-medium mb-4;
}

.top-products {
  @apply space-y-6;
}

.subsection-title {
  @apply text-base font-medium mb-4;
}

.products-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.product-card {
  @apply bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md;
}

.product-card-header {
  @apply p-4 flex gap-4;
}

.product-image {
  @apply w-16 h-16 object-cover rounded;
}

.product-stats {
  @apply flex-1;
}

.product-numbers {
  @apply grid grid-cols-2 gap-2 mt-2;
}

.stat {
  @apply flex flex-col;
}

.stat-label {
  @apply text-xs text-gray-500;
}

.stat-value {
  @apply text-sm font-medium;
}

.product-trend {
  @apply h-20 p-2 bg-gray-50;
}

.inventory-status {
  @apply bg-white p-6 rounded-lg shadow-sm border border-gray-200;
}

.inventory-header {
  @apply flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
}

.inventory-cards {
  @apply grid grid-cols-1 sm:grid-cols-3 gap-6;
}

.inventory-card {
  @apply border border-gray-200 rounded-lg overflow-hidden;
}

.card-header {
  @apply p-4 flex items-center gap-2;
}

.card-body {
  @apply p-4;
}
</style>