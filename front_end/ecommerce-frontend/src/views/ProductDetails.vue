   <!-- <template>
    <div>
      <h1 v-if="!loading && !error">{{ product.name }}</h1>
      <div v-if="loading">Loading...</div>
      <div v-if="error">{{ error }}</div>
      <p v-if="!loading && !error">{{ product.description }}</p>
      <p v-if="!loading && !error">Price: ${{ product.price }}</p> -->
      <!-- Add to Cart Button -->
      <!-- <button v-if="!loading && !error" @click="handleAddToCart(product)">Add to Cart</button>
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
   -->


   <template>
    <div>
      <h1 v-if="!loading && !error">{{ product.name }}</h1>
      <div v-if="loading">Loading...</div>
      <div v-if="error">{{ error }}</div>
      <p v-if="!loading && !error">{{ product.description }}</p>
      <p v-if="!loading && !error">Price: ${{ product.price }}</p>
      <button v-if="!loading && !error" @click="handleAddToCart(product)">Add to Cart</button>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    created() {
      const productId = this.$route.params.id;
      this.fetchProductDetails(productId);
    },
    computed: {
      ...mapGetters('products', ['product', 'loading', 'error']),
    },
    methods: {
      ...mapActions('products', ['fetchProductDetails']),
      ...mapActions('cart', ['addToCart']),
      handleAddToCart(product) {
        this.addToCart(product);
      },
    },
  };
  </script>
  