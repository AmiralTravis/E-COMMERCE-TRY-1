<!-- /components/OrderManagement.vue -->
<template>
  <div class="orders-dashboard">
    <div class="dashboard-header">
      <h1 class="text-center text-2xl font-bold text-gray-800">Order Management</h1>
    </div>

    <div class="filters-container">
      <div class="filters">
        <div class="filter-group">
          <label>
            <input 
              type="checkbox" 
              v-model="hidePendingOrders" 
            />
            Hide Pending Orders
          </label>
        </div>

        <div class="filter-group">
          <label>
            <input 
              type="checkbox" 
              v-model="hideDeliveredOrders" 
            />
            Hide Delivered Orders
          </label>
        </div>

        <div class="filter-group">
          <label>Search:</label>
          <input 
            v-model="searchQuery" 
            placeholder="Search by Order ID or Username"
            class="search-input"
          />
        </div>

        <div class="filter-group">
          <label>Sort By:</label>
          <select v-model="sortBy" class="sort-select">
            <option value="id">Order ID (Asc)</option>
            <option value="-id">Order ID (Desc)</option>
            <option value="totalAmount">Total Amount (Low to High)</option>
            <option value="-totalAmount">Total Amount (High to Low)</option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th class="order-id">Order ID</th>
            <th class="user">User</th>
            <th class="total-amount">Total Amount</th>
            <th class="status">Status</th>
            <th class="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="order in filteredOrders" 
            :key="order.id"
            :class="getStatusClass(order.status)"
          >
            <td class="order-id">{{ order.id }}</td>
            <td class="user">{{ order.User?.username || 'Unknown User' }}</td>
            <td class="total-amount">${{ order.totalAmount.toFixed(2) }}</td>
            <td class="status">
              <span class="status-badge">
                {{ order.status }}
              </span>
            </td>
            <td class="actions">
              <div class="action-buttons">
                <template v-if="order.status === 'Processing'">
                  <button 
                    @click.stop="updateToShipping(order)"
                    class="action-button"
                  >
                    Update to Shipping
                  </button>
                  <input 
                    type="date" 
                    v-model="shippingDates[order.id]" 
                    placeholder="Estimated Shipping Date"
                    class="date-input"
                    @click.stop
                  />
                </template>
                <template v-if="order.status === 'Shipping'">
                  <button 
                    @click.stop="updateToDelivering(order)"
                    class="action-button"
                  >
                    Update to Delivering
                  </button>
                  <input 
                    type="datetime-local" 
                    v-model="deliveryDates[order.id]" 
                    placeholder="Exact Delivery Time"
                    class="date-input"
                    @click.stop
                  />
                </template>
                <template v-if="order.status === 'Delivering'">
                  <button 
                    @click.stop="updateToDelivered(order)"
                    class="action-button"
                  >
                    Update to Delivered
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredOrders.length === 0" class="no-results">
        No orders found matching your criteria.
      </div>
    </div>
  </div>
</template>

<!-- <script setup>
import { ref, computed, onMounted } from 'vue';
import { useOrderManagementStore } from '@/stores/orderManagementStore';
import { toast } from 'vue3-toastify';

const orderManagementStore = useOrderManagementStore();
const hidePendingOrders = ref(false);
const hideDeliveredOrders = ref(false);
const searchQuery = ref('');
const sortBy = ref('id');
const shippingDates = ref({});
const deliveryDates = ref({});

onMounted(async () => {
  await orderManagementStore.fetchOrders();
});

const filteredOrders = computed(() => {
  let orders = orderManagementStore.orders || [];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    orders = orders.filter(order => 
      order.id.toString().includes(query) ||
      order.User?.username?.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (hidePendingOrders.value) {
    orders = orders.filter(order => order.status !== 'Pending');
  }
  if (hideDeliveredOrders.value) {
    orders = orders.filter(order => order.status !== 'Delivered');
  }

  // Apply sorting
  const [field, order] = sortBy.value.startsWith('-') 
    ? [sortBy.value.slice(1), 'desc'] 
    : [sortBy.value, 'asc'];

  return orders.sort((a, b) => {
    if (order === 'asc') {
      return a[field] > b[field] ? 1 : -1;
    }
    return a[field] < b[field] ? 1 : -1;
  });
});

function getStatusClass(status) {
  return {
    'Pending': 'status-pending',
    'Processing': 'status-processing',
    'Shipping': 'status-shipping',
    'Delivered': 'status-delivered',
    'Cancelled': 'status-cancelled'
  }[status] || '';
}

async function updateToShipping(order) {
  const shippingDate = shippingDates.value[order.id];
  if (!shippingDate) {
    toast.error('Please select a shipping date');
    return;
  }
  try {
    await orderManagementStore.updateOrderStatus(order.id, 'Shipping', shippingDate);
    toast.success('Order status updated to Shipping');
  } catch (error) {
    toast.error('Failed to update order status');
  }
}

async function updateToDelivering(order) {
  const deliveryDateTime = deliveryDates.value[order.id];
  if (!deliveryDateTime) {
    toast.error('Please select a delivery date and time');
    return;
  }
  try {
    await orderManagementStore.updateOrderStatus(order.id, 'Delivering', deliveryDateTime);
    toast.success('Order status updated to Delivering');
  } catch (error) {
    toast.error('Failed to update order status');
  }
}

async function updateToDelivered(order) {
  try {
    await orderManagementStore.updateOrderStatus(order.id, 'Delivered');
    toast.success('Order status updated to Delivered');
  } catch (error) {
    toast.error('Failed to update order status');
  }
}
</script> -->

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useOrderManagementStore } from '@/stores/orderManagementStore';
import { toast } from 'vue3-toastify';

const orderManagementStore = useOrderManagementStore();
const hidePendingOrders = ref(true); // Set to true by default
const hideDeliveredOrders = ref(true); // Set to true by default
const searchQuery = ref('');
const sortBy = ref('id');
const shippingDates = ref({});
const deliveryDates = ref({});

onMounted(async () => {
  await orderManagementStore.fetchOrders();
});

const filteredOrders = computed(() => {
  let orders = orderManagementStore.orders || [];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    orders = orders.filter(order => 
      order.id.toString().includes(query) ||
      order.User?.username?.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (hidePendingOrders.value) {
    orders = orders.filter(order => order.status !== 'Pending');
  }
  if (hideDeliveredOrders.value) {
    orders = orders.filter(order => order.status !== 'Delivered');
  }

  // Apply sorting
  const [field, order] = sortBy.value.startsWith('-') 
    ? [sortBy.value.slice(1), 'desc'] 
    : [sortBy.value, 'asc'];

  return orders.sort((a, b) => {
    if (order === 'asc') {
      return a[field] > b[field] ? 1 : -1;
    }
    return a[field] < b[field] ? 1 : -1;
  });
});

function getStatusClass(status) {
  return {
    'Pending': 'status-pending',
    'Processing': 'status-processing',
    'Shipping': 'status-shipping',
    'Delivered': 'status-delivered',
    'Cancelled': 'status-cancelled'
  }[status] || '';
}

async function updateToShipping(order) {
  const shippingDate = shippingDates.value[order.id];
  if (!shippingDate) {
    toast.error('Please select a shipping date');
    return;
  }
  try {
    await orderManagementStore.updateOrderStatus(order.id, 'Shipping', shippingDate);
    toast.success('Order status updated to Shipping');
  } catch (error) {
    toast.error('Failed to update order status');
  }
}

async function updateToDelivering(order) {
  const deliveryDateTime = deliveryDates.value[order.id];
  if (!deliveryDateTime) {
    toast.error('Please select a delivery date and time');
    return;
  }
  try {
    await orderManagementStore.updateOrderStatus(order.id, 'Delivering', deliveryDateTime);
    toast.success('Order status updated to Delivering');
  } catch (error) {
    toast.error('Failed to update order status');
  }
}

async function updateToDelivered(order) {
  try {
    await orderManagementStore.updateOrderStatus(order.id, 'Delivered');
    toast.success('Order status updated to Delivered');
  } catch (error) {
    toast.error('Failed to update order status');
  }
}
</script>

<style scoped>
.orders-dashboard {
  padding: 2rem;
  max-width: 1300px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 1rem;
  border-right: 1px solid #d1d5db;
  border-bottom: 1px solid #d1d5db;
}

.orders-table th:last-child,
.orders-table td:last-child {
  border-right: none;
}

.orders-table th {
  background: #f8fafc;
  font-weight: 600;
  text-align: left;
  border-bottom: 2px solid #9ca3af;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-pending .status-badge {
  background: #fff7ed;
  color: #ea580c;
}

.status-processing .status-badge {
  background: #eff6ff;
  color: #1d4ed8;
}

.status-shipping .status-badge {
  background: #fefce8;
  color: #ca8a04;
}

.status-delivered .status-badge {
  background: #f0fdf4;
  color: #16a34a;
}

.status-cancelled .status-badge {
  background: #fef2f2;
  color: #dc2626;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.action-button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s;
}

.action-button:hover {
  background: #2563eb;
}

.date-input {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}
</style>