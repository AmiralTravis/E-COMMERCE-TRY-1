// import axios from 'axios';
// import store from '../store/auth'; // Make sure this path is correct

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   timeout: 10000,
// });

// api.interceptors.request.use(config => {
//   const token = store.state.auth.token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

// api.interceptors.response.use(
//   response => response,
//   error => {
//     console.error('API Error:', error.response);
//     // Handle token expiration
//     if (error.response && error.response.status === 401) {
//       store.dispatch('auth/logout');
//       // Optionally redirect to login page
//       // router.push('/login');
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from 'axios'
import { useAuthStore } from '../stores/auth' // Update this path as needed

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response)
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      // Optionally redirect to login page
      // router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default api