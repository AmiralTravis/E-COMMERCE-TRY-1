import { createStore } from 'vuex';
import products from './modules/products'; // Import the products module
import cart from './modules/cart'; // Import the cart module from cart.js
// import api from '../services/api'; // Import the API instance

// Create the Vuex store instance
const store = createStore({
  modules: {
    products, // Include the products module
    cart, // Use the cart module from cart.js
  },
});

export default store;

