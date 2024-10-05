// import { defineStore } from 'pinia';
// import api from '../services/api';

// export const useAuthStore = defineStore('auth', {
//   state: () => ({
//     token: localStorage.getItem('authToken') || null,
//     user: JSON.parse(localStorage.getItem('user') || 'null'),
//     authStatus: {
//       status: null,
//       lastUpdated: Date.now()
//     },
//   }),
//   getters: {
//     isAuthenticated: (state) => !!state.token,
//     currentUser: (state) => state.user,
//     authStatus: (state) => state.authStatus.status,
//   },
//   actions: {
//     async checkAuth() {
//       if (this.token) {
//         try {
//           const response = await api.get('/auth/verify');
//           this.setAuth({ token: this.token, user: response.data.user });
//         } catch (error) {
//           console.error('Token verification failed:', error);
//           this.clearAuth();
//           throw error; // Rethrow the error so it can be caught in the component
//         }
//       } else {
//         this.clearAuth();
//       }
//     },
//     setAuth({ token, user }) {
//       this.$patch({
//         token,
//         user,
//         authStatus: {
//           status: 'authenticated',
//           lastUpdated: Date.now()
//         }
//       });
//       localStorage.setItem('authToken', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     },
//     clearAuth() {
//       this.$patch({
//         token: null,
//         user: null,
//         authStatus: {
//           status: 'unauthenticated',
//           lastUpdated: Date.now()
//         }
//       });
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('user');
//       delete api.defaults.headers.common['Authorization'];
//     },
//     async login(credentials) {
//       try {
//         const response = await api.post('/auth/login', credentials);
//         this.setAuth({ token: response.data.token, user: response.data.user });
//         return response;
//       } catch (error) {
//         console.error('Login error:', error);
//         throw error;
//       }
//     },
//     async register(credentials) {
//       try {
//         const response = await api.post('/auth/register', credentials);
//         this.setAuth({ token: response.data.token, user: response.data.user });
//         return response;
//       } catch (error) {
//         console.error('Registration error:', error.response?.data || error.message);
//         throw error;
//       }
//     },
//     logout() {
//       this.clearAuth();
//     },
//   },
// });



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
    async checkAuth() {
      if (this.token) {
        try {
          const response = await api.get('/auth/verify');
          this.setAuth({ token: this.token, user: response.data.user });
        } catch (error) {
          console.error('Token verification failed:', error);
          this.clearAuth();
          throw error;
        }
      } else {
        this.clearAuth();
      }
    },
    setAuth({ token, user }) {
      this.$patch({
        token,
        user,
        authStatus: {
          status: 'authenticated',
          lastUpdated: Date.now()
        }
      });
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    clearAuth() {
      this.$patch({
        token: null,
        user: null,
        authStatus: {
          status: 'unauthenticated',
          lastUpdated: Date.now()
        }
      });
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    },
    async login(credentials) {
      console.log('Auth store login called with:', credentials);
      try {
        console.log('Sending login request with:', {
          url: '/auth/login',
          method: 'POST',
          data: credentials
        });
        const response = await api.post('/auth/login', credentials);
        console.log('Login response:', response.data);
        this.setAuth({ token: response.data.token, user: response.data.user });
        return response;
      } catch (error) {
        console.error('Login error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        throw error;
      }
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
    logout() {
      this.clearAuth();
    },
  },
});