<!-- <template>
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
    <div v-if="!loading && !error && products.length === 0">No products found.</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  created() {
    console.log('ProductList component created');
    this.fetchProducts();
  },
  computed: {
    ...mapGetters('products', ['products', 'loading', 'error']),
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
    ...mapActions('cart', ['addToCart']),
    handleAddToCart(product) {
      console.log('Adding to cart:', product);
      this.addToCart(product);
    },
  },
  watch: {
    products(newProducts) {
      console.log('Products updated:', newProducts);
    },
    loading(newLoading) {
      console.log('Loading state:', newLoading);
    },
    error(newError) {
      console.log('Error state:', newError);
    },
  },
};
</script> -->

<template>
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
</script>