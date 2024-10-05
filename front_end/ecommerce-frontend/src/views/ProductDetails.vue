   <!-- <template>
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
   -->

   <template>
    <div>
      <h1 v-if="!loading && !error">{{ product?.name }}</h1>
      <div v-if="loading">Loading...</div>
      <div v-if="error">{{ error }}</div>
      <p v-if="!loading && !error">{{ product?.description }}</p>
      <p v-if="!loading && !error">Price: ${{ product?.price }}</p>
      <button v-if="!loading && !error" @click="handleAddToCart(product)">Add to Cart</button>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useProductStore } from '../stores/products';
  import { useCartStore } from '../stores/cart';
  
  const route = useRoute();
  const productStore = useProductStore();
  const cartStore = useCartStore();
  
  const product = ref(null);
  const loading = ref(true);
  const error = ref(null);
  
  onMounted(async () => {
    const productId = route.params.id;
    try {
      product.value = await productStore.fetchProductDetails(productId);
    } catch (err) {
      error.value = 'Failed to load product details';
    } finally {
      loading.value = false;
    }
  });
  
  const handleAddToCart = (product) => {
    cartStore.addToCart(product);
  };
  </script>