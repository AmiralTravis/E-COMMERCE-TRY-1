<!-- /components/Admin/ProductManager.vue -->
<template>
  <div class="products-dashboard">
    <div class="dashboard-header">
      <h1 class="text-center text-2xl font-bold text-gray-800">Product Management</h1>
      <div class="header-actions">
        <router-link to="/admin/products/add" class="add-product-button">
          <span>+</span> Add New Product
        </router-link>
      </div>
    </div>

    <div class="filters-container">
      <div class="filters">
        <div class="filter-group">
          <label>
            <input 
              type="checkbox" 
              v-model="showLowStockOnly" 
            />
            Show Low Stock Only (≤ 10)
          </label>
        </div>

        <div class="filter-group">
          <label>Search:</label>
          <input 
            v-model="searchQuery" 
            placeholder="Search by product name..."
            class="search-input"
          />
        </div>

        <div class="filter-group">
          <label>Sort By:</label>
          <select v-model="sortBy" class="sort-select">
            <option value="name">Name (A-Z)</option>
            <option value="-name">Name (Z-A)</option>
            <option value="stock">Stock (Low to High)</option>
            <option value="-stock">Stock (High to Low)</option>
            <option value="price">Price (Low to High)</option>
            <option value="-price">Price (High to Low)</option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="products-table">
        <thead>
          <tr>
            <th class="product-name">Product Name</th>
            <th class="stock-status">Stock Status</th>
            <th class="stock-update">Update Stock</th>
            <th class="product-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="product in filteredProducts" 
            :key="product.id"
            :class="{ 'low-stock-row': product.stock <= 10 }"
          >
            <td class="product-name">
              <div class="product-info">
                <div class="product-name-text">{{ product.name }}</div>
                <div class="product-price">${{ product.price.toFixed(2) }}</div>
              </div>
            </td>

            <td class="stock-status">
              <div class="stock-indicator">
                <div 
                  class="stock-bar"
                  :style="{ width: getStockPercentage(product.stock) + '%' }"
                  :class="getStockBarClass(product.stock)"
                ></div>
                <div class="stock-text">
                  <span>{{ product.stock }} in stock</span>
                  <span 
                    v-if="product.stock <= 10" 
                    class="stock-alert"
                  >
                    (Low Stock!)
                  </span>
                </div>
              </div>
            </td>

            <td class="stock-update">
              <div class="stock-control">
                
                <input
                  v-model.number="product.stockAdjustment"
                  type="number"
                  min="-999"
                  max="999"
                  class="stock-input"
                  @keydown.prevent="handleStockInput($event)"
                >
                <button
                  @click="updateStock(product)"
                  class="update-button"
                  :disabled="!product.stockAdjustment"
                >
                  Update
                </button>
              </div>
            </td>

            <td class="product-actions">
              <div class="action-buttons">
                <router-link 
                  :to="`/admin/products/edit/${product.id}`" 
                  class="edit-button"
                >
                  Edit
                </router-link>
                <button
                  @click="confirmDelete(product.id)"
                  class="delete-button"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredProducts.length === 0" class="no-results">
        No products found matching your criteria.
      </div>
    </div>
    
    
  
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '@/stores/products';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';



const productStore = useProductStore();
const router = useRouter();
const products = ref([]);
const showLowStockOnly = ref(false);
const searchQuery = ref('');
const sortBy = ref('name');

// Fetch products with stock adjustment initialization
onMounted(async () => {
  await fetchProducts();
});

async function fetchProducts() {
  try {
    const response = await api.get('/admin/products');
    products.value = response.data.map(p => ({
      ...p,
      stockAdjustment: 0
    }));
  } catch (error) {
    toast.error('Failed to fetch products');
  }
}

const filteredProducts = computed(() => {
  let filtered = products.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query)
    );
  }

  // Apply low stock filter
  if (showLowStockOnly.value) {
    filtered = filtered.filter(p => p.stock <= 10);
  }

  // Apply sorting
  const [field, order] = sortBy.value.startsWith('-') 
    ? [sortBy.value.slice(1), 'desc'] 
    : [sortBy.value, 'asc'];

  return filtered.sort((a, b) => {
    if (order === 'asc') {
      return a[field] > b[field] ? 1 : -1;
    }
    return a[field] < b[field] ? 1 : -1;
  });
});

function getStockPercentage(stock) {
  const max = 100; // Adjust this based on your maximum stock level
  return Math.min((stock / max) * 100, 100);
}

function getStockBarClass(stock) {
  if (stock <= 10) return 'critical';
  if (stock <= 25) return 'warning';
  return 'healthy';
}

async function updateStock(product) {
  try {
    // Convert to number and validate
    const adjustment = Number(product.stockAdjustment);
    
    if (isNaN(adjustment) || adjustment === 0) {
      toast.error('Please enter a valid stock adjustment');
      product.stockAdjustment = 0;
      return;
    }

    // Calculate max allowed decrease
    const maxDecrease = product.stock;
    const clampedAdjustment = Math.max(adjustment, -maxDecrease);
    
    if (adjustment !== clampedAdjustment) {
      toast.warning(`Adjustment clamped to ${clampedAdjustment} to prevent negative stock`);
      product.stockAdjustment = clampedAdjustment;
      return;
    }

    const newStock = product.stock + clampedAdjustment;
    
    // Final validation
    if (newStock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    // API call
    await api.patch(`/admin/products/${product.id}/stock`, { stock: newStock });
    
    // Update UI
    product.stock = newStock;
    product.stockAdjustment = 0;
    toast.success('Stock updated successfully');
    
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update stock');
  }
}

async function confirmDelete(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await api.delete(`/admin/products/${productId}`);
      products.value = products.value.filter(p => p.id !== productId);
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  }
}

function handleStockInput(event) {
  if (!/[0-9]|-/.test(event.key)) {
    event.preventDefault();
  }
}
</script>

<style scoped>
.products-dashboard {
  padding: 2rem;
  max-width: 1300px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.add-product-button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
}

.add-product-button:hover {
  background: #2563eb;
}

.add-product-button span {
  font-size: 1.25rem;
}

.filters-container {
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-input {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  width: 200px;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}


.table-container {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #d1d5db;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}



.products-table th,
.products-table td {
  padding: 1rem;
  border-right: 1px solid #d1d5db; /* Darker vertical lines */
  border-bottom: 1px solid #d1d5db; /* Darker horizontal lines */
}

.products-table th:last-child,
.products-table td:last-child {
  border-right: none; /* Remove border from last column */
}



.products-table th {
  border-bottom: 2px solid #9ca3af;
  background: #f8fafc;
  font-weight: 600;
  text-align: left;
}

.low-stock-row {
  background: #fff1f2;
}

.product-name {
  width: 30%;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-price {
  color: #64748b;
  font-size: 0.875rem;
}

.stock-status {
  width: 25%;
}

.stock-indicator {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stock-bar {
  height: 8px;
  border-radius: 4px;
  background: #4ade80;
  transition: width 0.3s ease;
}

.stock-bar.critical {
  background: #f87171;
}

.stock-bar.warning {
  background: #fbbf24;
}

.stock-text {
  font-size: 0.875rem;
  color: #64748b;
}

.stock-alert {
  color: #dc2626;
  font-weight: 500;
}

.stock-update {
  width: 25%;
}

.stock-control {
  display: flex;
  gap: 0.5rem;
  max-width: 200px;
}

.stock-input {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  width: 100px;
}

.stock-input.negative {
  color: #dc2626;
}

.update-button {
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s;
}

.update-button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.product-actions {
  width: 20%;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}

.edit-button {
  background: #3b82f6;
  color: white;
}

.delete-button {
  background: #ef4444;
  color: white;
}

.edit-button:hover {
  background: #2563eb;
}

.delete-button:hover {
  background: #dc2626;
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}


/* Custom toast styles */
.Vue-Toastification__container {
  z-index: 9999 !important;
}

.Vue-Toastification__toast {
  font-size: 14px !important;
  padding: 12px 20px !important;
  min-height: auto !important;
  border-radius: 8px !important;
}

.Vue-Toastification__toast--success {
  background: #10B981 !important;
}

.Vue-Toastification__toast--warning {
  background: #FBBF24 !important;
}

.Vue-Toastification__toast--error {
  background: #EF4444 !important;
}
</style>