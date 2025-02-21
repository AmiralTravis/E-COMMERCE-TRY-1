



// stores/auth.js

import { defineStore } from 'pinia';
import api from '../services/api';
import { useCartStore } from './cart';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    authStatus: 'pending', // 'pending', 'authenticated', 'unauthenticated'
    isRefreshing: false, // To handle token refresh race conditions
  }),

  getters: {
    isAuthenticated: (state) => state.authStatus === 'authenticated' && !!state.user,
    isAdmin: (state) => state.user && (state.user.role === 'admin' || state.user.role === 'superadmin'),
    isSuperAdmin: (state) => state.user && state.user.role === 'superadmin',
  },

  actions: {
    async register(userData) {
      try {
        console.log('Registering user:', userData.username);
        const response = await api.post('/auth/register', userData);
        console.log('Registration response:', response.data);

        const { user } = response.data; // Tokens are handled via cookies
        this.setAuth(user);

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

        const { user } = response.data; // Tokens are handled via cookies
        this.setAuth(user);

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
        this.setAuth(response.data.user);
        return true;
      } catch (error) {
        if (error.response?.status === 401) {
          this.clearAuth();
        }
        return false;
      }
    },


async checkAuth() {
  try {
    if (this.authStatus === 'authenticated') return true;
    
    const success = await this.verifyUser();
    if (!success && !this.isRefreshing) {
      await this.refreshToken();
    }
    return this.isAuthenticated;
  } catch (error) {
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
        const response = await api.post('/auth/refresh');
        this.setAuth(response.data.user); // Tokens are handled via cookies
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
        const cartStore = useCartStore();
        cartStore.clearCart();
      }
    },

    setAuth(user) {
      this.user = user;
      this.authStatus = 'authenticated';
      console.log('Auth set:', this.user, this.authStatus);
    },

    clearAuth() {
      this.user = null;
      this.authStatus = 'unauthenticated';
      console.log('Auth cleared');
      const cartStore = useCartStore();
      cartStore.fetchCart();
    },

    async updateProfile(userData) {
      try {
        console.log('Updating user with ID:', this.user.id);
        console.log('Sending data:', userData);
        const response = await api.put(`/users/${this.user.id}`, userData);
        console.log('Update response:', response.data);
        const updatedUser = response.data;
        this.setAuth(updatedUser);
        return updatedUser;
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    },

    async fetchUserData() {
      try {
        const response = await api.get('/users/me');
        this.user = {
          ...response.data,
          profilePicUrl: response.data.profilePicUrl.includes('://')
            ? response.data.profilePicUrl
            : `${import.meta.env.VITE_API_URL}${response.data.profilePicUrl}`,
        };
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
    },
  },
});