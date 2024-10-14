// // stores/auth.js
// import { defineStore } from 'pinia';
// import api from '../services/api';
// import { useCartStore } from './cart';

// export const useAuthStore = defineStore('auth', {
//   state: () => ({
//     user: null,
//     authStatus: 'pending', // Possible values: 'pending', 'authenticated', 'unauthenticated'
//     isRefreshing: false,
//     token: null, // Added to store the JWT token
//   }),

//   getters: {
//     isAuthenticated: (state) => state.authStatus === 'authenticated' && !!state.user,
//   },

//   actions: {
//     // Registration function
//     async register(userData) {
//       try {
//         const response = await api.post('/auth/register', userData); // Assuming this is the correct API endpoint for registration
//         const { user, accessToken, refreshToken } = response.data; // Extract tokens from the response

//         this.setAuth(user);
//         this.token = accessToken; // Store the access token in the store
//         localStorage.setItem('accessToken', accessToken);
//         localStorage.setItem('refreshToken', refreshToken);

//         // Optionally, sync the cart after successful registration
//         const cartStore = useCartStore();
//         await cartStore.syncLocalCartWithServer();
//         await cartStore.fetchCart();

//         return response;
//       } catch (error) {
//         console.error('Registration error:', error);
//         this.clearAuth();
//         throw error;
//       }
//     },

//     async verifyUser() {
//       try {
//         const response = await api.get('/auth/verify');
//         this.setAuth(response.data.user);
//         return true;
//       } catch (error) {
//         if (error.response?.status === 401) {
//           this.clearAuth();
//         }
//         return false;
//       }
//     },

//     async checkAuth() {
//       const tokenExists = localStorage.getItem('accessToken');
//       console.log('Token exists:', tokenExists);
//       if (!tokenExists) {
//         this.authStatus = 'unauthenticated';
//         this.user = null;
//         return false;
//       }

//       try {
//         return await this.verifyUser();
//       } catch (error) {
//         console.error('Error verifying user:', error);
//         this.clearAuth();
//         return false;
//       }
//     },

//     async login(credentials) {
//       try {
//         const response = await api.post('/auth/login', credentials);
//         const { user, accessToken, refreshToken } = response.data;

//         this.setAuth(user);
//         this.token = accessToken;
//         console.log('Access token set:', this.token);

//         localStorage.setItem('accessToken', accessToken);
//         localStorage.setItem('refreshToken', refreshToken);
//         console.log('Access token stored in localStorage:', accessToken);
//         console.log('Refresh token stored in localStorage:', refreshToken);

//         const cartStore = useCartStore();
//         await cartStore.syncLocalCartWithServer();
//         await cartStore.fetchCart();

//         return response;
//       } catch (error) {
//         console.error('Login error:', error);
//         this.clearAuth();
//         throw error;
//       }
//     },

//     async refreshToken() {
//       if (this.isRefreshing) {
//         return new Promise((resolve) => {
//           const checkRefresh = setInterval(() => {
//             if (!this.isRefreshing) {
//               clearInterval(checkRefresh);
//               resolve();
//             }
//           }, 100);
//         });
//       }

//       this.isRefreshing = true;
//       try {
//         const response = await api.post('/auth/refresh', {
//           refreshToken: localStorage.getItem('refreshToken'),
//         });
//         this.setAuth(response.data.user);
//         this.token = response.data.accessToken;
//         localStorage.setItem('accessToken', this.token);
//         return response;
//       } catch (error) {
//         this.clearAuth();
//         throw error;
//       } finally {
//         this.isRefreshing = false;
//       }
//     },

//     async logout() {
//       try {
//         await api.post('/auth/logout');
//       } finally {
//         this.clearAuth();
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         const cartStore = useCartStore();
//         cartStore.clearCart();
//       }
//     },

//     setAuth(user) {
//       this.user = user;
//       this.authStatus = 'authenticated';
//     },

//     clearAuth() {
//       this.user = null;
//       this.authStatus = 'unauthenticated';
//       this.token = null;
//       const cartStore = useCartStore();
//       cartStore.fetchCart();
//     },
//   },
// });

// stores/auth.js
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

    // async login(credentials) {
    //   try {
    //     console.log('Logging in user:', credentials.username);
    //     const response = await api.post('/auth/login', credentials);
    //     console.log('Login response:', response.data);

    //     const { user, accessToken, refreshToken } = response.data;

    //     this.setAuth(user);
    //     this.token = accessToken;
    //     console.log('Access token set:', this.token);

    //     localStorage.setItem('accessToken', accessToken);
    //     localStorage.setItem('refreshToken', refreshToken);
    //     console.log('Tokens stored in localStorage');

    //     const cartStore = useCartStore();
    //     await cartStore.syncLocalCartWithServer();
    //     await cartStore.fetchCart();

    //     return response;
    //   } catch (error) {
    //     console.error('Login error:', error);
    //     this.clearAuth();
    //     throw error;
    //   }
    // },
    async login(credentials) {
      try {
        console.log('Logging in user:', credentials.username);
        console.log('Full login request:', {
          url: '/auth/login',
          method: 'POST',
          data: credentials
        });
        const response = await api.post('/auth/login', credentials);
        console.log('Login response:', response.data);

        const { user, accessToken, refreshToken } = response.data;

        this.setAuth(user);
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
        console.error('Error response:', error.response?.data);
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
        this.setAuth(response.data.user);
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
      this.user = user;
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
  },
});