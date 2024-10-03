// // import axios from 'axios';

// // // Create an Axios instance with a base URL
// // const api = axios.create({
// //   baseURL: 'http://localhost:5000', // Your backend base URL
// //   timeout: 10000, // Optional: Request timeout in milliseconds
// // });

// // // Add an interceptor to attach the JWT token
// // api.interceptors.request.use(config => {
// //   const token = localStorage.getItem('authToken'); // Get the token from local storage
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`; // Attach the token in Authorization header
// //   }
// //   return config;
// // }, error => {
// //   return Promise.reject(error);
// // });

// // // Add response interceptor
// // api.interceptors.response.use(
// //   response => response,
// //   error => {
// //     console.error('API Error:', error.response);
// //     return Promise.reject(error);
// //   }
// // );

// // export default api;

// import axios from 'axios';
// import store from '../store'; // Make sure this path is correct

// const api = axios.create({
//   baseURL: 'http://localhost:5000',
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

import axios from 'axios';
import store from '../store'; // Make sure this path is correct

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

api.interceptors.request.use(config => {
  const token = store.state.auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response);
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      store.dispatch('auth/logout');
      // Optionally redirect to login page
      // router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;