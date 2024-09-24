<!-- <template>
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
    handleAddToCart(product) { -->
      <!-- // Implement add to cart functionality
      console.log('Adding to cart:', product);
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script> -->




















<!-- <template>
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
    ...mapActions('cart', ['addToCart']),
    handleAddToCart(product) {
      this.addToCart(product);
      console.log('Added to cart:', product);
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script> -->


<template>
  <div>
    <h1>Product List</h1>
    <div v-if="loading">Loading products...</div>
    <div v-if="error">{{ error }}</div>
    <ul v-if="products.length > 0">
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - ${{ product.price }}
        <button @click="handleAddToCart(product)">Add to Cart</button>
      </li>
    </ul>
    <div v-if="!loading && !error && products.length === 0">No products found.</div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ProductList',
  setup() {
    const store = useStore()

    const products = computed(() => store.state.products.products)
    const loading = computed(() => store.state.products.loading)
    const error = computed(() => store.state.products.error)

    const fetchProducts = () => {
      store.dispatch('products/fetchProducts')
    }

    const handleAddToCart = (product) => {
      store.dispatch('cart/addToCart', product)
      console.log('Added to cart:', product)
    }

    onMounted(fetchProducts)

    return {
      products,
      loading,
      error,
      handleAddToCart
    }
  }
}
</script>