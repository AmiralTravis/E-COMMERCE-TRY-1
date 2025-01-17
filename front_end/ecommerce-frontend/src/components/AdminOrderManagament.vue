<!-- components/AdminOrderManagement.vue -->
<template>
  <div class="admin-order-management">
    <h1>Order Management</h1>

    <div class="filters">
      <!-- Checkbox to filter out Pending orders -->
      <label>
        <input 
          type="checkbox" 
          v-model="hidePendingOrders" 
        />
        Hide Pending Orders
      </label>

      <!-- Checkbox to filter out Delivered orders -->
      <label>
        <input 
          type="checkbox" 
          v-model="hideDeliveredOrders" 
        />
        Hide Delivered Orders
      </label>

      <!-- Status filter dropdown -->
      <select v-model="statusFilter">
        <option value="">All Statuses</option>
        <option v-for="status in orderStatuses" :key="status">
          {{ status }}
        </option>
      </select>

      <!-- Search input -->
      <input 
        v-model="searchQuery" 
        placeholder="Search by Order ID or Username"
      />
    </div>

    <!-- Loading state -->
    <div v-if="orderManagementStore.loading" class="loading">
      Loading orders...
    </div>

    <!-- Error state -->
    <div v-else-if="orderManagementStore.error" class="error">
      {{ orderManagementStore.error }}
    </div>

    <!-- Orders table -->
    <table v-else-if="orderManagementStore.orders?.length" class="orders-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User</th>
          <th>Total Amount</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="order in filteredOrders" 
          :key="order.id"
          @click="selectedOrder = order"
        >
          <td>{{ order.id }}</td>
          <td>{{ order.User?.username || 'Unknown User' }}</td>
          <td>${{ order.totalAmount.toFixed(2) }}</td>
          <td>
            <span :class="getStatusClass(order.status)">
              {{ order.status }}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <template v-if="order.status === 'Processing'">
                <button @click.stop="updateToShipping(order)">Update to Shipping</button>
                <input 
                  type="date" 
                  v-model="shippingDates[order.id]" 
                  placeholder="Estimated Shipping Date"
                  @click.stop
                />
              </template>
              <template v-if="order.status === 'Shipping'">
                <button @click.stop="updateToDelivering(order)">Update to Delivering</button>
                <input 
                  type="datetime-local" 
                  v-model="deliveryDates[order.id]" 
                  placeholder="Exact Delivery Time"
                  @click.stop
                />
              </template>
              <template v-if="order.status === 'Delivering'">
                <button @click.stop="updateToDelivered(order)">Update to Delivered</button>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- No orders available -->
    <div v-else>
      <p>No orders available to display.</p>
    </div>

    <!-- Order detail modal -->
    <OrderDetailModal 
      v-if="selectedOrder"
      :order="selectedOrder"
      @close="selectedOrder = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useOrderManagementStore } from '@/stores/orderManagementStore';
import OrderDetailModal from './OrderDetailModal.vue';

const orderManagementStore = useOrderManagementStore();
const selectedOrder = ref(null);
const statusFilter = ref('');
const searchQuery = ref('');
const shippingDates = ref({});
const deliveryDates = ref({});
const hidePendingOrders = ref(true); // Checkbox to hide Pending orders (checked by default)
const hideDeliveredOrders = ref(true); // Checkbox to hide Delivered orders (checked by default)

const orderStatuses = [
  'Pending', 
  'Processing', 
  'Shipping', 
  'Delivering', 
  'Delivered', 
  'Cancelled'
];

// Computed property to filter orders
const filteredOrders = computed(() => {
  const orders = orderManagementStore.orders || []; // Default to empty array
  return orders.filter(order => {
    const matchStatus = !statusFilter.value || 
      order.status === statusFilter.value;

    const matchSearch = !searchQuery.value || 
      order.id.toString().includes(searchQuery.value) ||
      order.User?.username?.toLowerCase().includes(searchQuery.value.toLowerCase());

    // Exclude Pending orders if checkbox is checked
    const excludePending = hidePendingOrders.value ? order.status !== 'Pending' : true;

    // Exclude Delivered orders if checkbox is checked
    const excludeDelivered = hideDeliveredOrders.value ? order.status !== 'Delivered' : true;

    return matchStatus && matchSearch && excludePending && excludeDelivered;
  });
});

// Function to get status class for styling
function getStatusClass(status) {
  const statusClasses = {
    'Pending': 'status-pending',
    'Processing': 'status-processing',
    'Shipping': 'status-shipping',
    'Delivering': 'status-delivering',
    'Delivered': 'status-delivered',
    'Cancelled': 'status-cancelled'
  };
  return statusClasses[status] || '';
}

// Function to update order status to Shipping
const updateToShipping = async (order) => {
  const shippingDate = shippingDates.value[order.id];
  if (!shippingDate) {
    alert('Please select a shipping date');
    return;
  }
  try {
    await orderManagementStore.updateOrderStatus(order.id, 'Shipping', shippingDate);
  } catch (error) {
    alert('Failed to update order status');
    console.error('Error updating to Shipping:', error);
  }
};

// Function to update order status to Delivering
const updateToDelivering = async (order) => {
  const deliveryDateTime = deliveryDates.value[order.id];
  if (!deliveryDateTime) {
    alert('Please select a delivery date and time');
    return;
  }
  try {
    await orderManagementStore.updateOrderStatus(order.id, 'Delivering', deliveryDateTime);
  } catch (error) {
    alert('Failed to update order status');
    console.error('Error updating to Delivering:', error);
  }
};

// Function to update order status to Delivered
const updateToDelivered = async (order) => {
  try {
    await orderManagementStore.updateOrderStatus(order.id, 'Delivered');
  } catch (error) {
    alert('Failed to update order status');
    console.error('Error updating to Delivered:', error);
  }
};

// Fetch orders and initialize WebSocket on component mount
onMounted(() => {
  orderManagementStore.fetchOrders();
  orderManagementStore.initializeWebSocket();
});

// Close WebSocket on component unmount
onUnmounted(() => {
  if (orderManagementStore.socket) {
    orderManagementStore.socket.close();
  }
});
</script>

<style scoped>
.admin-order-management {
  padding: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th, 
.orders-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

/* Status Color Classes */
.status-pending { color: orange; }
.status-processing { color: blue; }
.status-shipping { color: brown; }
.status-delivering { color: rgb(77, 219, 77); }
.status-delivered { color: teal; }
.status-cancelled { color: red; }
</style>