// stores/orderStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useOrderStore = defineStore('order', {
  state: () => ({
    currentOrder: null,
    loading: false,
    error: null
  }),
  actions: {
    async verifyPaypalOrder(orderID, totalAmount) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/api/paypal/verify-order', { 
          orderID, 
          totalAmount 
        });
        
        if (response.data.success) {
          this.currentOrder = response.data.order;
          this.$router.push('/order-success');
        }
      } catch (error) {
        this.error = 'Order verification failed';
        console.error('Order verification error', error);
      } finally {
        this.loading = false;
      }
    }
  }
});