// // stores/cart.js

// import { defineStore } from 'pinia';
// import api from '../services/api';
// import { useAuthStore } from './auth';

// export const useCartStore = defineStore('cart', {
//   state: () => ({
//     items: [],
//     loading: false,
//     error: null
//   }),

//   getters: {
//     itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
//     totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
//   },

//   actions: {
//     loadFromLocalStorage() {
//       const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//       this.items = cart;
//     },

//     saveToLocalStorage() {
//       localStorage.setItem('cart', JSON.stringify(this.items));
//     },

//     async fetchCart() {
//       const authStore = useAuthStore();
//       if (!authStore.isAuthenticated) {
//         this.loadFromLocalStorage();
//         return;
//       }

//       this.loading = true;
//       try {
//         const response = await api.get('/cart');
//         this.items = response.data;
//       } catch (error) {
//         if (error.response?.status === 401) {
//           await authStore.refreshToken();
//           await this.fetchCart();
//         }
//         this.error = 'Failed to fetch cart items';
//       } finally {
//         this.loading = false;
//       }
//     },

//     async addToCart(product) {
//       const authStore = useAuthStore();
//       if (!authStore.isAuthenticated) {
//         const existingItem = this.items.find(item => item.id === product.id);
//         if (existingItem) {
//           existingItem.quantity += 1;
//         } else {
//           this.items.push({ ...product, quantity: 1 });
//         }
//         this.saveToLocalStorage();
//         return;
//       }

//       this.loading = true;
//       try {
//         await api.post('/cart', {
//           productId: product.id,
//           quantity: 1
//         });
//         await this.fetchCart();
//       } catch (error) {
//         if (error.response?.status === 401) {
//           await authStore.refreshToken();
//           await this.addToCart(product);
//         }
//         throw error;
//       } finally {
//         this.loading = false;
//       }
//     },

//     async updateQuantity(productId, quantity) {
//       const authStore = useAuthStore();
//       if (!authStore.isAuthenticated) {
//         const item = this.items.find(item => item.id === productId);
//         if (item) {
//           item.quantity = quantity;
//           this.saveToLocalStorage();
//         }
//         return;
//       }

//       this.loading = true;
//       try {
//         await api.put(`/cart/${productId}`, { quantity });
//         await this.fetchCart();
//       } catch (error) {
//         if (error.response?.status === 401) {
//           await authStore.refreshToken();
//           await this.updateQuantity(productId, quantity);
//         }
//         throw error;
//       } finally {
//         this.loading = false;
//       }
//     },

//     async removeFromCart(productId) {
//       const authStore = useAuthStore();
//       if (!authStore.isAuthenticated) {
//         this.items = this.items.filter(item => item.id !== productId);
//         this.saveToLocalStorage();
//         return;
//       }

//       this.loading = true;
//       try {
//         await api.delete(`/cart/${productId}`);
//         await this.fetchCart();
//       } catch (error) {
//         if (error.response?.status === 401) {
//           await authStore.refreshToken();
//           await this.removeFromCart(productId);
//         }
//         throw error;
//       } finally {
//         this.loading = false;
//       }
//     },

//     async syncLocalCartWithServer() {
//       const authStore = useAuthStore();
//       if (!authStore.isAuthenticated) return;

//       const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
//       if (localCart.length === 0) return;

//       for (const item of localCart) {
//         try {
//           await this.addToCart(item);
//         } catch (error) {
//           console.error('Failed to sync cart item with server:', error);
//         }
//       }

//       // Clear local cart after syncing
//       localStorage.removeItem('cart');
//     },

//     clearCart() {
//       this.items = [];
//       localStorage.removeItem('cart');
//     },
//   },
// });

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
  },

  actions: {
    loadFromLocalStorage() {
      console.log('Loading cart items from localStorage...');
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      this.items = cart;
      console.log('Loaded cart items:', this.items);
    },

    saveToLocalStorage() {
      console.log('Saving cart items to localStorage:', this.items);
      localStorage.setItem('cart', JSON.stringify(this.items));
    },

    async fetchCart() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        console.log('User not authenticated, loading cart from localStorage...');
        this.loadFromLocalStorage();
        return;
      }

      this.loading = true;
      console.log('Fetching cart from server...');
      try {
        const response = await api.get('/cart');
        console.log('Fetched cart items from server:', response.data);
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching cart:', error);
        if (error.response?.status === 401) {
          console.log('Unauthorized, attempting to refresh token...');
          await authStore.refreshToken();
          await this.fetchCart();
        }
        this.error = 'Failed to fetch cart items';
      } finally {
        this.loading = false;
      }
    },

    async addToCart(product) {
      const authStore = useAuthStore();
      console.log('Adding product to cart:', product);
      if (!authStore.isAuthenticated) {
        console.log('User not authenticated, updating local cart...');
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
          existingItem.quantity += 1;
          console.log('Updated existing item quantity:', existingItem);
        } else {
          this.items.push({ ...product, quantity: 1 });
          console.log('Added new item to cart:', { ...product, quantity: 1 });
        }
        this.saveToLocalStorage();
        return;
      }

      this.loading = true;
      try {
        await api.post('/cart', {
          productId: product.id,
          quantity: 1
        });
        console.log('Successfully added item to server cart. Fetching updated cart...');
        await this.fetchCart();
      } catch (error) {
        console.error('Error adding item to cart:', error);
        if (error.response?.status === 401) {
          console.log('Unauthorized, attempting to refresh token...');
          await authStore.refreshToken();
          await this.addToCart(product);
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateQuantity(productId, quantity) {
      const authStore = useAuthStore();
      console.log(`Updating quantity for product ID ${productId} to ${quantity}`);
      if (!authStore.isAuthenticated) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
          item.quantity = quantity;
          this.saveToLocalStorage();
        }
        return;
      }

      this.loading = true;
      try {
        await api.put(`/cart/${productId}`, { quantity });
        console.log(`Successfully updated quantity for product ID ${productId}. Fetching updated cart...`);
        await this.fetchCart();
      } catch (error) {
        console.error('Error updating cart item:', error);
        if (error.response?.status === 401) {
          console.log('Unauthorized, attempting to refresh token...');
          await authStore.refreshToken();
          await this.updateQuantity(productId, quantity);
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeFromCart(productId) {
      const authStore = useAuthStore();
      console.log(`Removing product ID ${productId} from cart...`);
      if (!authStore.isAuthenticated) {
        this.items = this.items.filter(item => item.id !== productId);
        console.log('Updated local cart after removal:', this.items);
        this.saveToLocalStorage();
        return;
      }

      this.loading = true;
      try {
        await api.delete(`/cart/${productId}`);
        console.log(`Successfully removed product ID ${productId} from server cart. Fetching updated cart...`);
        await this.fetchCart();
      } catch (error) {
        console.error('Error removing item from cart:', error);
        if (error.response?.status === 401) {
          console.log('Unauthorized, attempting to refresh token...');
          await authStore.refreshToken();
          await this.removeFromCart(productId);
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async syncLocalCartWithServer() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return;

      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('Syncing local cart with server...', localCart);
      if (localCart.length === 0) return;

      for (const item of localCart) {
        try {
          await this.addToCart(item);
        } catch (error) {
          console.error('Failed to sync cart item with server:', error);
        }
      }

      // Clear local cart after syncing
      localStorage.removeItem('cart');
      console.log('Cleared local cart after syncing.');
    },

    clearCart() {
      console.log('Clearing cart...');
      this.items = [];
      localStorage.removeItem('cart');
    },
  },
});
