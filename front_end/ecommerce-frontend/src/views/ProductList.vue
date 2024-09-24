<!-- <template>
  <div>
    <h1>Product List</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <ul v-if="!loading && !error && products.length > 0">
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - ${{ product.price }}
        <button @click="handleAddToCart(product)">Add to Cart</button>
      </li>
    </ul>
    <div v-if="!loading && !error && products.length === 0">No products found.</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  created() {
    console.log('ProductList component created');
    this.loadProducts();
  },
  computed: {
    ...mapGetters('products', ['products', 'loading', 'error']),
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
    ...mapActions('cart', ['addToCart']),
    loadProducts() {
      console.log('Loading products...');
      if (this.products.length === 0) {
        this.fetchProducts();
      } else {
        console.log('Products already loaded:', this.products);
      }
    },
    handleAddToCart(product) {
      console.log('Adding to cart:', product);
      this.addToCart(product);
    },
  },
  watch: {
    products: {
      immediate: true,
      handler(newProducts) {
        console.log('Products updated:', newProducts);
      }
    },
    loading: {
      immediate: true,
      handler(newLoading) {
        console.log('Loading state:', newLoading);
      }
    },
    error: {
      immediate: true,
      handler(newError) {
        console.log('Error state:', newError);
      }
    },
  },
};
</script> -->
<!-- 
<template>
  <div>
    <h1>Product List</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-if="loadError">{{ loadError }}</div>
    <ul v-if="!isLoading && !loadError && displayProducts.length > 0">
      <li v-for="product in displayProducts" :key="product.id">
        {{ product.name }} - ${{ product.price }}
        <button @click="handleAddToCart(product)">Add to Cart</button>
      </li>
    </ul>
    <div v-if="!isLoading && !loadError && displayProducts.length === 0">No products found.</div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      isLoading: true,
      loadError: null,
      displayProducts: [],
    };
  },
  computed: {
    ...mapState('products', ['products']),
    ...mapGetters('products', ['loading', 'error']),
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
    ...mapActions('cart', ['addToCart']),
    async loadProducts() {
      console.log('Loading products...');
      this.isLoading = true;
      this.loadError = null;
      try {
        await this.fetchProducts();
        this.displayProducts = this.products;
      } catch (error) {
        console.error('Error loading products:', error);
        this.loadError = 'Failed to load products. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    handleAddToCart(product) {
      console.log('Adding to cart:', product);
      this.addToCart(product);
    },
  },
  async created() {
    console.log('ProductList component created');
    await this.loadProducts();
  },
  watch: {
    products: {
      immediate: true,
      handler(newProducts) {
        console.log('Products updated:', newProducts);
        this.displayProducts = newProducts;
      }
    },
  },
};
</script> -->



<template>
  <div>
    <h1>Product List</h1>
    <div v-if="loading">Loading products...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else-if="products.length > 0">
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - ${{ product.price }}
        <button @click="handleAddToCart(product)">Add to Cart</button>
      </li>
    </ul>
    <div v-else>No products found.</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ProductList',
  computed: {
    ...mapState('products', ['products', 'loading', 'error']),
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
    handleAddToCart(product) {
      // Implement add to cart functionality
      console.log('Adding to cart:', product);
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>