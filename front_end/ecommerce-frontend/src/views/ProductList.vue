<!-- <template>
  <div>
    <h1>Product List</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <ul v-if="!loading && !error">
      <li v-for="product in products" :key="product.id">
        <router-link :to="`/products/${product.id}`">{{ product.name }}</router-link> -->
        <!-- Add to Cart Button for each product -->
        <!-- <button @click="handleAddToCart(product)">Add to Cart</button>
      </li>
    </ul>
  </div>
</template> -->
  
  <!-- <script>
  import api from '../services/api'; // Import Axios instance
  import { mapActions } from 'vuex';

  
  export default {
    data() {
      return {
        products: [],
        loading: true,
        error: null
      };
    },
    created() {
      this.fetchProducts();
    },
    methods: {
      async fetchProducts() {
        try {
          const response = await api.get('/products');
          this.products = response.data;
        } catch (error) {
          console.error('Error fetching products:', error);
          this.error = 'Failed to load products';
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script> -->
  
<!-- this version was added bcz i couldnt figure out how to incorporate vuex stuff on the script code -->
<!-- <script>
import api from '../services/api'; // Import Axios instance -->
<!-- import { mapActions } from 'vuex'; // Import Vuex actions -->

<!-- export default {
  data() {
    return {
      products: [],
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchProducts(); // Fetch products when the component is created
  },
  methods: {
    // Fetch products from backend API
    async fetchProducts() {
      try {
        const response = await api.get('/products'); // Replace '/products' with your actual endpoint if different
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'Failed to load products';
      } finally {
        this.loading = false;
      }
    },
    
    ...mapActions(['addToCart']), // Incorporate Vuex actions for cart management

    // Add product to cart method (triggered by clicking the "Add to Cart" button)
    handleAddToCart(product) {
      this.addToCart(product); // Call Vuex action to add the product to the cart
    },
  },
};
</script> -->



<template>
  <div>
    <h1>Product List</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <ul v-if="!loading && !error">
      <li v-for="product in products" :key="product.id">
        <router-link :to="`/products/${product.id}`">{{ product.name }}</router-link>
        <button @click="handleAddToCart(product)">Add to Cart</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  created() {
    this.fetchProducts();
  },
  computed: {
    ...mapGetters('products', ['products', 'loading', 'error']),
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
    ...mapActions('cart', ['addToCart']),
    handleAddToCart(product) {
      this.addToCart(product);
    },
  },
};
</script>
