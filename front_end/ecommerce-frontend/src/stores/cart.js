// stores/cart.js

import { defineStore } from 'pinia';
import api from '../services/api';
import { useAuthStore } from './auth';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),

  getters: {
    itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    shipping: (state) => state.totalPrice >= 100 ? 0 : 10, // Free shipping for orders over $100
    tax: (state) => state.totalPrice * 0.08, // 8% tax
    total: (state) => state.totalPrice + state.shipping + state.tax // Total including shipping and tax
  },

  actions: {
    loadFromLocalStorage() {
      if (useAuthStore().isAuthenticated) return;
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          this.items = JSON.parse(savedCart);
        }
        console.log('Loaded cart from localStorage:', this.items);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        this.items = [];
      }
    },

    saveToLocalStorage() {
      if (useAuthStore().isAuthenticated) return;
      try {
        localStorage.setItem('cart', JSON.stringify(this.items));
        console.log('Saved cart to localStorage:', this.items);
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    },

    async fetchCart() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.loadFromLocalStorage();
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await api.get('/cart');
        console.log('Fetched cart from server:', response.data);
        
        this.items = response.data.map(item => ({
          id: item.id,
          name: item.product?.name || 'Unknown Product',
          price: Number(item.product?.price) || 0,
          quantity: Number(item.quantity) || 0,
          productId: item.productId,
        }));
      } catch (error) {
        console.error('Error fetching cart:', error);
        this.error = 'Failed to fetch cart items';
        
        if (error.response?.status === 401) {
          await authStore.refreshToken();
          return this.fetchCart();
        }
      } finally {
        this.loading = false;
      }
    },

    async updateQuantity(cartItemId, quantity) {
      const authStore = useAuthStore();
      
      if (!authStore.isAuthenticated) {
        const item = this.items.find(item => item.id === cartItemId);
        if (item) {
          item.quantity = Math.max(0, quantity);
          this.saveToLocalStorage();
        }
        return;
      }
    
      this.loading = true;
      this.error = null;
    
      try {
        const response = await api.put(`/cart/${cartItemId}`, { quantity });
        
        const updatedItem = response.data;
        const index = this.items.findIndex(item => item.id === cartItemId);
        
        if (index !== -1) {
          this.items[index] = {
            ...this.items[index],
            quantity: Number(updatedItem.quantity) || 0
          };
        }
        
        console.log('Updated item quantity:', cartItemId, quantity);
      } catch (error) {
        console.error('Error updating quantity:', error);
        this.error = 'Failed to update quantity';
        
        if (error.response?.status === 401) {
          await authStore.refreshToken();
          return this.updateQuantity(cartItemId, quantity);
        }
      } finally {
        this.loading = false;
      }
    },
    
    async removeFromCart(cartItemId) {
      const authStore = useAuthStore();
      
      if (!authStore.isAuthenticated) {
        this.items = this.items.filter(item => item.id !== cartItemId);
        this.saveToLocalStorage();
        return;
      }
    
      this.loading = true;
      this.error = null;
    
      try {
        await api.delete(`/cart/${cartItemId}`);
        this.items = this.items.filter(item => item.id !== cartItemId);
        console.log('Removed item from cart:', cartItemId);
      } catch (error) {
        console.error('Error removing item:', error);
        this.error = 'Failed to remove item';
        
        if (error.response?.status === 401) {
          await authStore.refreshToken();
          return this.removeFromCart(cartItemId);
        }
      } finally {
        this.loading = false;
      }
    },
    
    async addToCart(product) {
      const authStore = useAuthStore();
      
      if (!authStore.isAuthenticated) {
        const existingItem = this.items.find(item => item.productId === product.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          this.items.push({
            id: Date.now(), // Temporary ID for local storage
            name: product.name,
            price: Number(product.price),
            quantity: 1,
            productId: product.id
          });
        }
        this.saveToLocalStorage();
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await api.post('/cart', {
          productId: product.id,
          quantity: 1
        });

        await this.fetchCart();
        
        console.log('Added item to cart:', product.id);
      } catch (error) {
        console.error('Error adding item:', error);
        this.error = 'Failed to add item';
        
        if (error.response?.status === 401) {
          await authStore.refreshToken();
          return this.addToCart(product);
        }
      } finally {
        this.loading = false;
      }
    },

    async syncLocalCartWithServer() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return;

      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('Syncing local cart with server:', localCart);

      this.loading = true;
      this.error = null;

      try {
        for (const item of localCart) {
          await api.post('/cart', {
            productId: item.productId,
            quantity: item.quantity
          });
        }

        localStorage.removeItem('cart');
        await this.fetchCart();
        
        console.log('Successfully synced cart with server');
      } catch (error) {
        console.error('Error syncing cart:', error);
        this.error = 'Failed to sync cart';
      } finally {
        this.loading = false;
      }
    },

    async clearCart() {
      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;
    
      try {
        // If user is authenticated, clear cart on the backend
        if (authStore.isAuthenticated) {
          await api.delete('/cart');
        }
        
        // Clear frontend state
        this.items = [];
        
        // Clear localStorage if it exists
        localStorage.removeItem('cart');
        
        console.log('Cart cleared after order placement');
      } catch (error) {
        console.error('Error clearing cart after order:', error);
        this.error = 'Failed to clear cart';
        
        if (error.response?.status === 401) {
          await authStore.refreshToken();
          return this.clearCartAfterOrder();
        }
      } finally {
        this.loading = false;
      }
    }
  
  }
});