<template>
  <div class="admin-dashboard">
    <h1>{{ isSuperAdmin ? 'Superadmin' : 'Admin' }} Dashboard</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <!-- Product Management Section -->
      <h2>Product Management</h2>
      <button @click="showAddProductForm = !showAddProductForm">Add New Product</button>
      <div v-if="showAddProductForm">
        <form @submit.prevent="addProduct">
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
      <nav>
        <router-link to="/admin/orders">Manage Orders</router-link>
        <!-- Other admin navigation links -->
      </nav>
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

      <!-- User Role Management Section -->
      <h2>Admin Role Management</h2>
      <div class="management-forms">
        <!-- Create New Admin Form -->
        <div class="form-section">
          <h3>Create New Admin</h3>
          <form @submit.prevent="createAdmin">
            <input v-model="newAdmin.username" placeholder="Username" required>
            <input v-model="newAdmin.email" type="email" placeholder="Email" required>
            <input v-model="newAdmin.password" type="password" placeholder="Password" required>
            <button type="submit">Create Admin</button>
          </form>
        </div>

        <!-- Promote Existing User Form -->
        <div class="form-section">
          <h3>Promote Existing User to Admin</h3>
          <form @submit.prevent="promoteToAdmin">
            <input v-model="userToPromote.email" type="email" placeholder="User Email" required>
            <button type="submit">Promote to Admin</button>
          </form>
        </div>
      </div>

      <!-- Superadmin Section -->
      <div v-if="isSuperAdmin" class="superadmin-section">
        <h2>Superadmin-exclusive Function</h2>
        <!-- Any superadmin-specific functions can be added here -->
      </div>
      <!-- Admin List Section (now visible to both admins and superadmins) -->
      <div class="admin-list-section">
        <h3>All Admins</h3>
        <ul>
          <li v-for="admin in allAdmins" :key="admin.id">
            {{ admin.username }} - {{ admin.email }}
            <button v-if="isSuperAdmin" @click="removeAdmin(admin)">Remove Admin</button>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import api from '../services/api';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const isSuperAdmin = computed(() => authStore.isSuperAdmin);

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
const userToPromote = ref({ email: '' });
const newAdmin = ref({ username: '', email: '', password: '' });
const allAdmins = ref([]);

onMounted(async () => {
  try {
    await Promise.all([
      fetchProducts(),
      fetchOrders(),
      generateSalesReport(),
      fetchLowStockAlerts(),
      fetchAllAdmins() // Now fetching for both admins and superadmins
    ]);
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

async function createAdmin() {
  try {
    await api.post('/admin/create-admin', newAdmin.value);
    newAdmin.value = { username: '', email: '', password: '' }; // Reset form
    await fetchAllAdmins(); // Refresh admin list
  } catch (err) {
    error.value = 'Failed to create admin account. Please try again.';
  }
}

async function promoteToAdmin() {
  try {
    await api.post('/admin/promote-to-admin', { email: userToPromote.value.email });
    userToPromote.value.email = ''; // Reset form
    await fetchAllAdmins(); // Refresh admin list
  } catch (err) {
    error.value = 'Failed to promote user to admin. Please verify the email address.';
  }
}

async function fetchAllAdmins() {
  try {
    const response = await api.get('/admin/all-admins');
    allAdmins.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch admins. Please try again later.';
  }
}

async function removeAdmin(admin) {
  if (!isSuperAdmin.value) {
    error.value = 'Only superadmins can remove admins.';
    return;
  }
  
  try {
    const response = await api.post('/admin/remove-admin', {
      username: admin.username,
      email: admin.email
    });
    if (response.data.success) {
      await fetchAllAdmins(); // Refresh admin list
    } else {
      error.value = response.data.message || 'Failed to remove admin. Please try again.';
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      error.value = err.response.data.message || 'Invalid admin details. Please check the username and email.';
    } else {
      error.value = 'Failed to remove admin. Please try again later.';
    }
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

.management-forms {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.form-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background: #4a5568;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #2d3748;
}

.superadmin-section {
  margin-top: 40px;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
}
</style>