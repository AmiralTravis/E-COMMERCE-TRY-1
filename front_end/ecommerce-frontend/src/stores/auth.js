import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    authStatus: {
      status: null,
      lastUpdated: Date.now()
    },
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    authStatus: (state) => state.authStatus.status,
  },
  actions: {
    setAuth({ token, user }) {
      this.token = token;
      this.user = user;
      this.authStatus = {
        status: 'authenticated',
        lastUpdated: Date.now()
      };
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    clearAuth() {
      this.token = null;
      this.user = null;
      this.authStatus = {
        status: 'unauthenticated',
        lastUpdated: Date.now()
      };
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    },
    async register(credentials) {
      try {
        const response = await api.post('/auth/register', credentials);
        this.setAuth({ token: response.data.token, user: response.data.user });
        return response;
      } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        throw error;
      }
    },
    async login(credentials) {
      try {
        const response = await api.post('/auth/login', credentials);
        this.setAuth({ token: response.data.token, user: response.data.user });
        return response;
      } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
      }
    },
    logout() {
      this.clearAuth();
    },
  },
});
