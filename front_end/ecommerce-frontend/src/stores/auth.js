// stores/auth.js

import { defineStore } from 'pinia';
import api from '../services/api';
import { useCartStore } from './cart';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    authStatus: 'pending', // Possible values: 'pending', 'authenticated', 'unauthenticated'
    isRefreshing: false,
    token: null, // Added to store the JWT token
  }),

  getters: {
    isAuthenticated: (state) => state.authStatus === 'authenticated' && !!state.user,
  },

  actions: {
    async verifyUser() {
      try {
        const response = await api.get('/auth/verify');
        this.setAuth(response.data.user);
        return true; // User is verified and authenticated
      } catch (error) {
        if (error.response?.status === 401) {
          this.clearAuth(); // Clear auth if the user is not authenticated
        }
        return false; // User is not authenticated
      }
    },

    async checkAuth() {
      const tokenExists = localStorage.getItem('accessToken'); // Check localStorage for token
      console.log('Token exists:', tokenExists);
      if (!tokenExists) {
        this.authStatus = 'unauthenticated';
        this.user = null;
        return false;
      }

      // Use try-catch for better error handling
      try {
        return await this.verifyUser();
      } catch (error) {
        console.error('Error verifying user:', error);
        this.clearAuth();
        return false;
      }
    },

    async login(credentials) {
      try {
        const response = await api.post('/auth/login', credentials);
        const { user, accessToken, refreshToken } = response.data; // Update to access correct tokens

        this.setAuth(user);
        this.token = accessToken; // Store the access token in the store
        console.log('Access token set:', this.token);

        // Store the access token and refresh token in localStorage for persistence
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        console.log('Access token stored in localStorage:', accessToken);
        console.log('Refresh token stored in localStorage:', refreshToken);

        // Initialize cart after successful login
        const cartStore = useCartStore();
        await cartStore.syncLocalCartWithServer();
        await cartStore.fetchCart();

        return response;
      } catch (error) {
        console.error('Login error:', error);
        this.clearAuth();
        throw error; // Ensure to throw the error for further handling in the UI
      }
    },

    async refreshToken() {
      if (this.isRefreshing) {
        return new Promise((resolve) => {
          const checkRefresh = setInterval(() => {
            if (!this.isRefreshing) {
              clearInterval(checkRefresh);
              resolve();
            }
          }, 100);
        });
      }

      this.isRefreshing = true;
      try {
        const response = await api.post('/auth/refresh', {
          refreshToken: localStorage.getItem('refreshToken'), // Include the refresh token in the request
        });
        this.setAuth(response.data.user);
        this.token = response.data.accessToken; // Update the stored access token
        localStorage.setItem('accessToken', this.token); // Update access token in localStorage
        return response;
      } catch (error) {
        this.clearAuth();
        throw error;
      } finally {
        this.isRefreshing = false;
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout');
      } finally {
        this.clearAuth();
        localStorage.removeItem('accessToken'); // Remove token from localStorage
        localStorage.removeItem('refreshToken'); // Remove refresh token from localStorage
        const cartStore = useCartStore();
        cartStore.clearCart();
      }
    },

    setAuth(user) {
      this.user = user;
      this.authStatus = 'authenticated';
    },

    clearAuth() {
      this.user = null;
      this.authStatus = 'unauthenticated';
      this.token = null; // Clear the token as well
      const cartStore = useCartStore();
      cartStore.fetchCart(); // Ensure cart data is retained on auth clear
    },
  },
});
