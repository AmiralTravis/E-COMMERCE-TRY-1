<!-- components/AdminDashboard.vue -->
 
  <!-- <template>
    <div class="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else> -->
        <!-- Product Management Section -->
        <!-- <h2>Product Management</h2>
        <button @click="showAddProductForm = !showAddProductForm">Add New Product</button>
        <div v-if="showAddProductForm">
          <form @submit.prevent="addProduct"> -->
            <!-- Add form fields for product details -->
            <!-- <input v-model="newProduct.name" placeholder="Product Name" required>
            <input v-model.number="newProduct.price" type="number" placeholder="Price" required>
            <input v-model.number="newProduct.stock" type="number" placeholder="Stock" required>
            <button type="submit">Add Product</button>
          </form>
        </div>
        <ul>
          <li v-for="product in products" :key="product.id">
            {{ product.name }} - ${{ product.price }} - Stock: {{ product.stock }}
            <button @click="editProduct(product)">Edit</button>
            <button @click="deleteProduct(product.id)">Delete</button>
            <input v-model.number="product.stockChange" type="number" placeholder="Update Stock">
            <button @click="updateStock(product)">Update Stock</button>
          </li>
        </ul> -->
  
        <!-- Order Management Section -->
        <!-- <h2>Order Management</h2>
        <ul>
          <li v-for="order in orders" :key="order.id">
            Order #{{ order.id }} - Status: {{ order.status }}
            <button @click="fulfillOrder(order.id)" v-if="order.status === 'pending'">Fulfill Order</button>
            <button @click="cancelOrder(order.id)" v-if="order.status === 'pending'">Cancel Order</button>
            <button @click="refundOrder(order.id)" v-if="order.status === 'completed'">Refund Order</button>
          </li>
        </ul>
   -->
        <!-- Sales Report Section -->
        <!-- <h2>Sales Report</h2>
        <select v-model="reportPeriod" @change="generateSalesReport">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <div v-if="salesReport">
          <p>Total Sales: ${{ salesReport.totalSales }}</p>
          <p>Order Count: {{ salesReport.orderCount }}</p>
        </div> -->
  
        <!-- Low Stock Alerts Section -->
        <!-- <h2>Low Stock Alerts</h2>
        <ul>
          <li v-for="product in lowStockProducts" :key="product.id">
            {{ product.name }} - Current Stock: {{ product.stock }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import api from '../services/api';
  
  const loading = ref(true);
  const error = ref(null);
  const products = ref([]);
  const orders = ref([]);
  const salesReport = ref(null);
  const lowStockProducts = ref([]);
  const showAddProductForm = ref(false);
  const reportPeriod = ref('daily');
  const newProduct = ref({ name: '', price: 0, stock: 0 });
  
  onMounted(async () => {
    try {
      await fetchProducts();
      await fetchOrders();
      await generateSalesReport();
      await fetchLowStockAlerts();
    } catch (err) {
      error.value = 'Failed to load admin data. Please try again later.';
    } finally {
      loading.value = false;
    }
  });
  
  async function fetchProducts() {
    const response = await api.get('/admin/products');
    products.value = response.data;
  }
  
  async function fetchOrders() {
    const response = await api.get('/admin/orders');
    orders.value = response.data;
  }
  
  async function generateSalesReport() {
    const response = await api.get(`/admin/sales-report?period=${reportPeriod.value}`);
    salesReport.value = response.data;
  }
  
  async function fetchLowStockAlerts() {
    const response = await api.get('/admin/low-stock-alerts');
    lowStockProducts.value = response.data;
  }
  
  async function addProduct() {
    await api.post('/admin/products', newProduct.value);
    await fetchProducts();
    showAddProductForm.value = false;
    newProduct.value = { name: '', price: 0, stock: 0 };
  }
  
  async function editProduct(product) {
    // Implement edit product logic (e.g., open a modal with a form)
  }
  
  async function deleteProduct(productId) {
    await api.delete(`/admin/products/${productId}`);
    await fetchProducts();
  }
  
  async function updateStock(product) {
    await api.put(`/admin/products/${product.id}/stock`, { stockChange: product.stockChange });
    await fetchProducts();
    product.stockChange = 0;
  }
  
  async function fulfillOrder(orderId) {
    await api.put(`/admin/orders/${orderId}/fulfill`);
    await fetchOrders();
  }
  
  async function cancelOrder(orderId) {
    await api.put(`/admin/orders/${orderId}/cancel`);
    await fetchOrders();
  }
  
  async function refundOrder(orderId) {
    await api.post(`/admin/orders/${orderId}/refund`);
    await fetchOrders();
  }
  </script>
  
  <style scoped>
  .admin-dashboard {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  </style> -->

  <!-- components/AdminDashboard.vue-->
 
<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <!-- Product Management Section -->
      <h2>Product Management</h2>
      <button @click="showAddProductForm = !showAddProductForm">Add New Product</button>
      <div v-if="showAddProductForm">
        <form @submit.prevent="addProduct">
          <!-- Add form fields for product details -->
          <input v-model="newProduct.name" placeholder="Product Name" required>
          <input v-model.number="newProduct.price" type="number" placeholder="Price" required>
          <input v-model.number="newProduct.stock" type="number" placeholder="Stock" required>
          <button type="submit">Add Product</button>
        </form>
      </div>
      <ul>
        <li v-for="product in products" :key="product.id">
          <div v-if="editingProduct && editingProduct.id === product.id">
            <input v-model="editingProduct.name" placeholder="Product Name" required>
            <input v-model.number="editingProduct.price" type="number" placeholder="Price" required>
            <input v-model.number="editingProduct.stock" type="number" placeholder="Stock" required>
            <button @click="saveEditProduct">Save</button>
            <button @click="cancelEdit">Cancel</button>
          </div>
          <div v-else>
            {{ product.name }} - ${{ product.price }} - Stock: {{ product.stock }}
            <button @click="startEditProduct(product)">Edit</button>
            <button @click="deleteProduct(product.id)">Delete</button>
            <input v-model.number="product.stockChange" type="number" placeholder="Update Stock">
            <button @click="updateStock(product)">Update Stock</button>
          </div>
        </li>
      </ul>

      <!-- Order Management Section -->
      <h2>Order Management</h2>
      <ul>
        <li v-for="order in orders" :key="order.id">
          Order #{{ order.id }} - Status: {{ order.status }}
          <button @click="fulfillOrder(order.id)" v-if="order.status === 'pending'">Fulfill Order</button>
          <button @click="cancelOrder(order.id)" v-if="order.status === 'pending'">Cancel Order</button>
          <button @click="refundOrder(order.id)" v-if="order.status === 'completed'">Refund Order</button>
        </li>
      </ul>

      <!-- Sales Report Section -->
      <h2>Sales Report</h2>
      <select v-model="reportPeriod" @change="generateSalesReport">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <div v-if="salesReport">
        <p>Total Sales: ${{ salesReport.totalSales }}</p>
        <p>Order Count: {{ salesReport.orderCount }}</p>
      </div>

      <!-- Low Stock Alerts Section -->
      <h2>Low Stock Alerts</h2>
      <ul>
        <li v-for="product in lowStockProducts" :key="product.id">
          {{ product.name }} - Current Stock: {{ product.stock }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '../services/api';

const loading = ref(true);
const error = ref(null);
const products = ref([]);
const orders = ref([]);
const salesReport = ref(null);
const lowStockProducts = ref([]);
const showAddProductForm = ref(false);
const reportPeriod = ref('daily');
const newProduct = ref({ name: '', price: 0, stock: 0 });
const editingProduct = ref(null);

onMounted(async () => {
  try {
    await fetchProducts();
    await fetchOrders();
    await generateSalesReport();
    await fetchLowStockAlerts();
    setupWebSocket();
  } catch (err) {
    error.value = 'Failed to load admin data. Please try again later.';
  } finally {
    loading.value = false;
  }
});

async function fetchProducts() {
  const response = await api.get('/admin/products');
  products.value = response.data;
}

async function fetchOrders() {
  const response = await api.get('/admin/orders');
  orders.value = response.data;
}

async function generateSalesReport() {
  const response = await api.get(`/admin/sales-report?period=${reportPeriod.value}`);
  salesReport.value = response.data;
}

async function fetchLowStockAlerts() {
  const response = await api.get('/admin/low-stock-alerts');
  lowStockProducts.value = response.data;
}

async function addProduct() {
  await api.post('/admin/products', newProduct.value);
  await fetchProducts();
  showAddProductForm.value = false;
  newProduct.value = { name: '', price: 0, stock: 0 };
}

function startEditProduct(product) {
  editingProduct.value = { ...product };
}

async function saveEditProduct() {
  await api.put(`/admin/products/${editingProduct.value.id}`, editingProduct.value);
  await fetchProducts();
  editingProduct.value = null;
}

function cancelEdit() {
  editingProduct.value = null;
}

async function deleteProduct(productId) {
  await api.delete(`/admin/products/${productId}`);
  await fetchProducts();
}

async function updateStock(product) {
  await api.put(`/admin/products/${product.id}/stock`, { stockChange: product.stockChange });
  await fetchProducts();
  product.stockChange = 0;
}

async function fulfillOrder(orderId) {
  await api.put(`/admin/orders/${orderId}/fulfill`);
  await fetchOrders();
}

async function cancelOrder(orderId) {
  await api.put(`/admin/orders/${orderId}/cancel`);
  await fetchOrders();
}

async function refundOrder(orderId) {
  await api.post(`/admin/orders/${orderId}/refund`);
  await fetchOrders();
}

function setupWebSocket() {
  const socket = new WebSocket('ws://localhost:8080');

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'stock_update') {
      updateProductStock(data.productId, data.newStock);
    }
  };
}

function updateProductStock(productId, newStock) {
  const product = products.value.find(p => p.id === productId);
  if (product) {
    product.stock = newStock;
  }
  
  const lowStockProduct = lowStockProducts.value.find(p => p.id === productId);
  if (lowStockProduct) {
    lowStockProduct.stock = newStock;
  }
  
  if (newStock <= 10) {
    if (!lowStockProduct) {
      lowStockProducts.value.push({ ...product, stock: newStock });
    }
  } else {
    lowStockProducts.value = lowStockProducts.value.filter(p => p.id !== productId);
  }
}

// Watch for changes in products and update low stock alerts
watch(products, (newProducts) => {
  lowStockProducts.value = newProducts.filter(product => product.stock <= 10);
}, { deep: true });
</script>

<style scoped>
.admin-dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>