<template>
    <div class="admin-order-management">
      <h1>Order Management</h1>
      
      <div class="filters">
        <select v-model="statusFilter">
          <option value="">All Statuses</option>
          <option v-for="status in orderStatuses" :key="status">
            {{ status }}
          </option>
        </select>
        <input 
          v-model="searchQuery" 
          placeholder="Search by Order ID or Username"
        />
      </div>
  
      <table class="orders-table">
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
            <td>{{ order.username }}</td>
            <td>${{ order.totalAmount.toFixed(2) }}</td>
            <td>
              <span :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button 
                  v-for="action in getAvailableActions(order.status)"
                  :key="action"
                  @click.stop="updateOrderStatus(order, action)"
                >
                  {{ action }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
  
      <OrderDetailModal 
        v-if="selectedOrder"
        :order="selectedOrder"
        @close="selectedOrder = null"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import api from '@/services/api';
  import OrderDetailModal from './OrderDetailModal.vue';
  
  const orders = ref([]);
  const statusFilter = ref('');
  const searchQuery = ref('');
  const selectedOrder = ref(null);
  
  const orderStatuses = [
    'Pending', 
    'Processing', 
    'Shipped', 
    'Delivering', 
    'Delivered', 
    'Cancelled'
  ];
  
  const filteredOrders = computed(() => {
    return orders.value.filter(order => {
      const matchStatus = !statusFilter.value || 
        order.status === statusFilter.value;
      
      const matchSearch = !searchQuery.value || 
        order.id.toString().includes(searchQuery.value) ||
        order.username.toLowerCase().includes(searchQuery.value.toLowerCase());
      
      return matchStatus && matchSearch;
    });
  });
  
  function getStatusClass(status) {
    const statusClasses = {
      'Pending': 'status-pending',
      'Processing': 'status-processing',
      'Shipped': 'status-shipped',
      'Delivering': 'status-delivering',
      'Delivered': 'status-delivered',
      'Cancelled': 'status-cancelled'
    };
    return statusClasses[status] || '';
  }
  
  function getAvailableActions(currentStatus) {
    const actionMap = {
      'Pending': ['Process', 'Cancel'],
      'Processing': ['Ship'],
      'Shipped': ['Start Delivery'],
      'Delivering': ['Mark Delivered'],
      'Delivered': [],
      'Cancelled': []
    };
    return actionMap[currentStatus] || [];
  }
  
  async function updateOrderStatus(order, action) {
    const statusMap = {
      'Process': 'Processing',
      'Ship': 'Shipped',
      'Start Delivery': 'Delivering',
      'Mark Delivered': 'Delivered',
      'Cancel': 'Cancelled'
    };
  
    try {
      await api.put(`/orders/${order.id}/status`, {
        status: statusMap[action]
      });
      
      // Refresh orders or update local state
      await fetchOrders();
    } catch (error) {
      console.error('Failed to update order status', error);
    }
  }
  
  async function fetchOrders() {
    try {
      const response = await api.get('/admin/orders');
      orders.value = response.data;
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  }
  
  // Lifecycle
  fetchOrders();
  </script>
  
  <style scoped>
  .admin-order-management {
    padding: 20px;
  }
  
  .filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
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
  .status-shipped { color: purple; }
  .status-delivering { color: green; }
  .status-delivered { color: green; }
  .status-cancelled { color: red; }
  </style>