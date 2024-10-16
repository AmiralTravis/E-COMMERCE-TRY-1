// // // stores/auth.js

import { defineStore } from 'pinia';
import api from '../services/api';
import { useCartStore } from './cart';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    authStatus: 'pending',
    isRefreshing: false,
    token: null,
  }),

  getters: {
    isAuthenticated: (state) => state.authStatus === 'authenticated' && !!state.user,
    isAdmin: (state) => state.user && state.user.role === 'admin', // Check for admin role
  },

  actions: {
    async register(userData) {
      try {
        console.log('Registering user:', userData.username);
        const response = await api.post('/auth/register', userData);
        console.log('Registration response:', response.data);

        const { user, accessToken, refreshToken } = response.data;

        this.setAuth(user);
        this.token = accessToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        const cartStore = useCartStore();
        await cartStore.syncLocalCartWithServer();
        await cartStore.fetchCart();

        return response;
      } catch (error) {
        console.error('Registration error:', error);
        this.clearAuth();
        throw error;
      }
    },

    async login(credentials) {
      try {
        console.log('Logging in user:', credentials.username);
        const response = await api.post('/auth/login', credentials);
        console.log('Login response:', response.data);

        const { user, accessToken, refreshToken } = response.data;

        // Log the user role to verify if it's admin
        console.log('User role:', user.role);  // <--- Check the role here

        this.setAuth(user); // Set user with role information
        this.token = accessToken;
        console.log('Access token set:', this.token);

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        console.log('Tokens stored in localStorage');

        const cartStore = useCartStore();
        await cartStore.syncLocalCartWithServer();
        await cartStore.fetchCart();

        return response;
      } catch (error) {
        console.error('Login error:', error);
        this.clearAuth();
        throw error;
      }
    },

    async verifyUser() {
      try {
        const response = await api.get('/auth/verify');
        this.setAuth(response.data.user); // Verify user role and status
        return true;
      } catch (error) {
        if (error.response?.status === 401) {
          this.clearAuth();
        }
        return false;
      }
    },
      
    async checkAuth() {
      const tokenExists = localStorage.getItem('accessToken');
      console.log('Token exists:', tokenExists);
      if (!tokenExists) {
        this.authStatus = 'unauthenticated';
        this.user = null;
        return false;
      }
      
      try {
        return await this.verifyUser();
      } catch (error) {
        console.error('Error verifying user:', error);
        this.clearAuth();
        return false;
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
          refreshToken: localStorage.getItem('refreshToken'),
        });
        this.setAuth(response.data.user); // Ensure user is set after refresh
        this.token = response.data.accessToken;
        localStorage.setItem('accessToken', this.token);
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
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        const cartStore = useCartStore();
        cartStore.clearCart();
      }
    },

    setAuth(user) {
      this.user = user;  // Ensure role is part of user data
      this.authStatus = 'authenticated';
      console.log('Auth set:', this.user, this.authStatus);
    },

    clearAuth() {
      this.user = null;
      this.authStatus = 'unauthenticated';
      this.token = null;
      console.log('Auth cleared');
      const cartStore = useCartStore();
      cartStore.fetchCart();
    },

    // New method to fetch user data
    async fetchUserData() {
      try {
        const response = await api.get('/users/me');
        return response.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
    },
  },
});
