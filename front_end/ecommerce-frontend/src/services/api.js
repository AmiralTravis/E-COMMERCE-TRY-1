// front_end/ecommerce-frontend/src/services/api.js

import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Add request interceptor to include token
api.interceptors.request.use(config => {
  const authStore = useAuthStore();
  const token = authStore.token; // Get token from store

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Include token in the request headers
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Handle specific 401 scenarios
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      
      // If error is due to expired token
      if (error.response.data.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => api(originalRequest))
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await authStore.refreshToken();
          isRefreshing = false;
          processQueue(null);
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError);
          authStore.clearAuth();
          return Promise.reject(refreshError);
        }
      }
      
      // If error is AUTH_EXPIRED, clear auth state
      if (error.response.data.code === 'AUTH_EXPIRED') {
        authStore.clearAuth();
      }
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      // Display a user-friendly message or handle the error accordingly
      console.error('Network error: Please check your internet connection.');
    }

    return Promise.reject(error);
  }
);

export default api;
