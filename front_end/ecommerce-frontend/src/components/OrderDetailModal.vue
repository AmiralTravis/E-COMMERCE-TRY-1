<template>
    <div class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <h2>Order #{{ order.id }} Details</h2>
          <button @click="$emit('close')">×</button>
        </div>
        
        <div class="modal-body">
          <div class="order-info">
            <p>User: {{ order.username }}</p>
            <p>Total Amount: ${{ order.totalAmount.toFixed(2) }}</p>
            <p>Status: {{ order.status }}</p>
            
            <div v-if="order.trackingNumber" class="tracking-info">
              <p>Tracking Number: {{ order.trackingNumber }}</p>
              <p>Estimated Delivery: {{ formatDate(order.estimatedDeliveryDate) }}</p>
            </div>
          </div>
  
          <div class="order-items">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.items" :key="item.id">
                  <td>{{ item.productName }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>${{ item.price.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    order: {
      type: Object,
      required: true
    }
  });
  
  defineEmits(['close']);
  
  function formatDate(date) {
    return new Date(date).toLocaleDateString();
  }
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background: white;
    width: 600px;
    max-height: 80%;
    overflow-y: auto;
    border-radius: 8px;
    padding: 20px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }
  
  .modal-body {
    padding: 20px 0;
  }
  
  .order-items table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .order-items th, 
  .order-items td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  </style>