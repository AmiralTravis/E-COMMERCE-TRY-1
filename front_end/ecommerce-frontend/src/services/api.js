import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend base URL
  timeout: 10000, // Optional: Request timeout in milliseconds
});

export default api;
