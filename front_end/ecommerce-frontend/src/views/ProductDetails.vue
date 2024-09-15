<!-- <template>
    <div>
      <h1>{{ product.name }}</h1>
      <p>{{ product.description }}</p>
      <p>Price: ${{ product.price }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        product: {}
      };
    },
    created() {
      this.fetchProductDetails();
    },
    methods: {
      async fetchProductDetails() {
        const productId = this.$route.params.id;
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
          this.product = response.data;
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      }
    }
  };
  </script>
   -->

<!-- 
   <template>
    <div>
      <h1>{{ product.name }}</h1>
      <p>{{ product.description }}</p>
      <p>Price: ${{ product.price }}</p>
    </div>
  </template>
  
  <script>
  import api from '../services/api'; // Import Axios instance
  
  export default {
    data() {
      return {
        product: {},
        loading: true,
        error: null
      };
    },
    created() {
      this.fetchProductDetails();
    },
    methods: {
      async fetchProductDetails() {
        const productId = this.$route.params.id;
        try {
          const response = await api.get(`/products/${productId}`);
          this.product = response.data;
        } catch (error) {
          console.error('Error fetching product details:', error);
          this.error = 'Failed to load product details';
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
   -->



   <template>
    <div>
      <h1 v-if="!loading && !error">{{ product.name }}</h1>
      <div v-if="loading">Loading...</div>
      <div v-if="error">{{ error }}</div>
      <p v-if="!loading && !error">{{ product.description }}</p>
      <p v-if="!loading && !error">Price: ${{ product.price }}</p>
      <!-- Add to Cart Button -->
      <button v-if="!loading && !error" @click="handleAddToCart(product)">Add to Cart</button>
    </div>
  </template>
  
  <script>
  import api from '../services/api'; // Import Axios instance
  import { mapActions } from 'vuex'; // Import Vuex actions
  
  export default {
    data() {
      return {
        product: {},
        loading: true,
        error: null
      };
    },
    created() {
      this.fetchProductDetails();
    },
    methods: {
      async fetchProductDetails() {
        const productId = this.$route.params.id;
        try {
          const response = await api.get(`/products/${productId}`);
          this.product = response.data;
        } catch (error) {
          console.error('Error fetching product details:', error);
          this.error = 'Failed to load product details';
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
  </script>
  