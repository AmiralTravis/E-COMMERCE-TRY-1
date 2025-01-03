// stores/OrderUserStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useOrderUserStore = defineStore('userOrderManagement', {
  state: () => ({
    currentOrders: [],
    completedOrders: [],
    orderHistory: [],
    loading: false,
    error: null,
    lastOrder: null,
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0
    }
  }),

  actions: {
    async fetchCurrentOrders() {
      this.error = null;
      this.loading = true;
      
      try {
        const response = await axios.get('/api/orders/current');
        console.log('Current Ordersee:', response.data.orders); // Add this log

        this.currentOrders = response.data.orders || [];
        this.lastOrder = this.currentOrders.length > 0 ? this.currentOrders[0] : null;
      } catch (error) {
        this.handleError(error, 'Fetch Current Orders');
      } finally {
        this.loading = false;
      }
    },

    async fetchCompletedOrders(page = 1, limit = 10) {
      this.error = null;
      this.loading = true;
      
      try {
        const response = await axios.get('/api/orders/completed', {
          params: { page, limit }
        });
        
        this.completedOrders = response.data.orders;
        this.pagination = {
          page: response.data.page,
          totalPages: response.data.totalPages,
          total: response.data.total
        };
      } catch (error) {
        this.handleError(error, 'Fetch Completed Orders');
      } finally {
        this.loading = false;
      }
    },

    // Helper method for error handling
    handleError(error, context) {
      if (error.response) {
        this.error = error.response.data?.message || `Server Error: ${error.response.status}`;
        console.error(`${context} - Server Response Error:`, {
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        this.error = 'No response received from server. Please check your network connection.';
        console.error(`${context} - No Response Error:`, error.message);
      } else {
        this.error = error.message || 'An unexpected error occurred';
        console.error(`${context} - Request Setup Error:`, error);
      }
    },

    // Existing methods remain the same
    getOrderStatusColor(status) {
      const statusColors = {
        'Placed': 'bg-blue-100 text-blue-800',
        'Processing': 'bg-yellow-100 text-yellow-800',
        'Shipping': 'bg-purple-100 text-purple-800',
        'Delivering': 'bg-indigo-100 text-indigo-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800',
      };
      return statusColors[status] || 'bg-gray-100 text-gray-800';
    },

    getOrderStatusStep(status) {
      const statusOrder = [
        'Placed', 
        'Processing', 
        'Shipping', 
        'Delivering', 
        'Delivered'
      ];
      return statusOrder.indexOf(status);
    },

    async fetchCompletedOrders(page = 1, limit = 10) {
      this.error = null;
      this.loading = true;
      
      try {
        const response = await axios.get('/api/orders/completed', {
          params: { 
            page, 
            limit,
            status: 'Delivered' 
          }
        });
        
        return {
          orders: response.data.orders,
          page: response.data.page,
          totalPages: response.data.totalPages,
          total: response.data.total
        };
      } catch (error) {
        this.handleError(error, 'Fetch Completed Orders');
        return null;
      } finally {
        this.loading = false;
      }
    },
  },


  getters: {
    hasCurrentOrders: (state) => state.currentOrders.length > 0,
    hasCompletedOrders: (state) => state.completedOrders.length > 0,
    hasOrderHistory: (state) => state.orderHistory.length > 0
  }
});