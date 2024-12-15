<!-- views/OrdersPage.vue -->
<!-- <template>
    <div class="orders-container">
      <h1>My Orders</h1>
      <div class="orders-content"> -->
        <!-- Add your orders list here -->
        <!-- <p v-if="!orders.length">No orders found.</p>
        <div v-else class="orders-list"> -->
          <!-- Add orders list implementation -->
        <!-- </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'OrdersPage',
    setup() {
      const orders = ref([]);
      // Add your orders fetching logic here
  
      return {
        orders
      };
    }
  });
  </script>
  
  <style scoped>
  .orders-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  
  .orders-content {
    background-color: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .orders-list {
    margin-top: 1rem;
  }
  
  h1 {
    margin-bottom: 2rem;
  }
  </style> -->

  <template>
    <div class="orders-container">
      <h1>My Orders</h1>
      <div class="orders-content">
        <p v-if="loading">Loading orders...</p>
        <p v-else-if="error">{{ error }}</p>
        <div v-else-if="!orders.length">No orders found.</div>
        <div v-else class="orders-list">
          <div v-for="order in orders" :key="order.id" class="order-card">
            <div class="order-header">
              <span>Order #{{ order.id }}</span>
              <span>{{ formatDate(order.createdAt) }}</span>
            </div>
            
            <div class="order-tracking">
              <div class="tracking-steps">
                <div 
                  v-for="(step, index) in orderStatuses" 
                  :key="step"
                  class="tracking-step"
                  :class="{
                    'active': getStepStatus(order.status, step, index),
                    'completed': isPreviousStep(order.status, step, index)
                  }"
                >
                  {{ step }}
                </div>
              </div>
            </div>
  
            <div class="order-details">
              <p>Total: ${{ order.totalAmount }}</p>
              <p>Status: {{ order.status }}</p>
              <p v-if="order.trackingNumber">
                Tracking Number: {{ order.trackingNumber }}
              </p>
              <p v-if="order.estimatedDeliveryDate">
                Estimated Delivery: {{ formatDate(order.estimatedDeliveryDate) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import api from '../services/api';
  
  const orders = ref([]);
  const loading = ref(true);
  const error = ref(null);
  
  const orderStatuses = [
    'Order Placed', 
    'Processing', 
    'Shipped', 
    'Delivering', 
    'Delivered'
  ];
  
  onMounted(async () => {
    try {
      const response = await api.get('/orders');
      orders.value = response.data;
    } catch (err) {
      error.value = 'Failed to load orders';
    } finally {
      loading.value = false;
    }
  });
  
  function formatDate(date) {
    return new Date(date).toLocaleDateString();
  }
  
  function getStepStatus(currentStatus, step, index) {
    const statusIndex = orderStatuses.indexOf(currentStatus);
    return statusIndex === index;
  }
  
  function isPreviousStep(currentStatus, step, index) {
    const statusIndex = orderStatuses.indexOf(currentStatus);
    return index < statusIndex;
  }
  </script>
  
  <style scoped>
  .order-card {
    border: 1px solid #e0e0e0;
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 8px;
  }
  
  .tracking-steps {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
  }
  
  .tracking-step {
    flex: 1;
    text-align: center;
    padding: 0.5rem;
    background-color: #f0f0f0;
    position: relative;
  }
  
  .tracking-step.active {
    background-color: #4a90e2;
    color: white;
  }
  
  .tracking-step.completed {
    background-color: #2ecc71;
    color: white;
  }
  
  .order-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  </style>