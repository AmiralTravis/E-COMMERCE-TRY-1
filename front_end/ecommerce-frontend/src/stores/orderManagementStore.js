// stores/orderManagementStore.js

import { defineStore } from 'pinia';
import api from '@/services/api';

export const useOrderManagementStore = defineStore('adminOrderManagement', {
  state: () => ({
    orders: [], // Ensure orders starts as an empty array
    loading: false,
    error: null,
    socket: null,
  }),

  actions: {
    // Fetch orders from the API
    async fetchOrders() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get('/admin/orders');
        if (Array.isArray(response.data)) {
          this.orders = response.data; // Ensure we only assign valid arrays
        } else {
          throw new Error('Invalid data format: Orders must be an array');
        }
      } catch (error) {
        this.error = 'Failed to fetch orders';
        console.error('Fetch orders error:', error); // Log error for debugging
      } finally {
        this.loading = false;
      }
    },

    // Update the status of an order
    async updateOrderStatus(orderId, status, estimatedDate) {
      this.loading = true;

      console.log('API Request - Updating order status:', {
        orderId,
        status,
        estimatedDate,
      }); // Log the payload before the API call

      try {
        const response = await api.put(`/admin/orders/${orderId}/update-status`, {
          status,
          estimatedDate,
        });

        // Update the order in the local state if it exists
        const index = this.orders.findIndex((order) => order.id === orderId);
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], ...response.data.order };
          this.orders = [...this.orders]; // Trigger reactivity
        }
        return response.data;
      } catch (error) {
        this.error = 'Failed to update order status';
        console.error('Update order status error:', error); // Log error for debugging
        throw error; // Re-throw error to allow handling in calling methods
      } finally {
        this.loading = false;
      }
    },

    // Initialize WebSocket connection
    initializeWebSocket() {
      const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080';
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // Handle specific WebSocket message types
        if (data.type === 'order_status_update') {
          this.handleOrderStatusUpdate(data);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed. Attempting to reconnect...');
        setTimeout(() => this.initializeWebSocket(), 5000);
      };
    },

    // Handle updates from WebSocket messages
    handleOrderStatusUpdate(data) {
      const { orderId, status, estimatedDate } = data;

      if (!this.orders || !Array.isArray(this.orders)) {
        console.error('Orders list is not initialized or invalid.');
        return;
      }

      const index = this.orders.findIndex((order) => order.id === orderId);
      if (index !== -1) {
        // Update the status of the existing order
        this.orders[index] = {
          ...this.orders[index],
          status,
          estimatedDate,
        };
        this.orders = [...this.orders]; // Trigger reactivity
      } else {
        console.warn(`Order with ID ${orderId} not found. Ignoring update.`);
      }
    },
  },
});

