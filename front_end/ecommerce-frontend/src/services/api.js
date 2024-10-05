// import axios from 'axios'
// import { useAuthStore } from '../stores/auth' // Update this path as needed

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   timeout: 10000,
// })

// api.interceptors.request.use(
//   (config) => {
//     const authStore = useAuthStore()
//     const token = authStore.token
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error.response)
//     if (error.response && error.response.status === 401) {
//       const authStore = useAuthStore()
//       authStore.logout()
//       // Optionally redirect to login page
//       // router.push('/login')
//     }
//     return Promise.reject(error)
//   }
// )

// export default api


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
    console.log('API Request:', { url: config.url, method: config.method, headers: config.headers });
    return config
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', { url: response.config.url, status: response.status, data: response.data });
    return response
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
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