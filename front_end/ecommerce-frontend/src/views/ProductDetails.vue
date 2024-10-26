   <!-- <template>
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
  </script> -->

  <template>
    <div class="product-details" v-if="product">
      <div class="product-image">
        <img :src="product.imageUrl" :alt="product.name">
      </div>
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="price">${{ product.price.toFixed(2) }}</p>
        <p class="description">{{ product.description }}</p>
        <p class="stock" :class="{ 'low-stock': product.stock <= 10 }">
          In stock: {{ product.stock }}
        </p>
        <div class="add-to-cart">
          <input type="number" v-model.number="quantity" min="1" :max="product.stock">
          <button @click="addToCart" :disabled="product.stock === 0">Add to Cart</button>
        </div>
      </div>
      <div class="reviews">
        <h2>Customer Reviews</h2>
        <div v-if="reviews.length">
          <div v-for="review in reviews" :key="review.id" class="review">
            <div class="rating">
              {{ "★".repeat(review.rating) }}{{ "☆".repeat(5 - review.rating) }}
            </div>
            <p class="comment">{{ review.comment }}</p>
            <p class="reviewer">By {{ review.userName }} on {{ formatDate(review.createdAt) }}</p>
          </div>
        </div>
        <p v-else>No reviews yet.</p>
      </div>
    </div>
  </template>
  
  <script>
  // import { ref, onMounted } from 'vue'
  // import { useProductStore } from '@/stores/products'
  // import { useCartStore } from '@/stores/cart'
  
  // export default {
  //   name: 'ProductDetails',
  //   props: {
  //     productId: {
  //       type: Number,
  //       required: true
  //     }
  //   },
  //   setup(props) {
  //     const productStore = useProductStore()
  //     const cartStore = useCartStore()
  //     const product = ref(null)
  //     const reviews = ref([])
  //     const quantity = ref(1)
  
  //     onMounted(async () => {
  //       product.value = await productStore.fetchProduct(props.productId)
  //       reviews.value = await productStore.fetchReviews(props.productId)
  //     })
  
  //     const addToCart = () => {
  //       cartStore.addToCart({
  //         productId: product.value.id,
  //         quantity: quantity.value
  //       })
  //     }
  
  //     const formatDate = (dateString) => {
  //       return new Date(dateString).toLocaleDateString()
  //     }
  
  //     return {
  //       product,
  //       reviews,
  //       quantity,
  //       addToCart,
  //       formatDate
  //     }
  //   }
  // }
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router' // Import useRoute to access route params
  import { useProductStore } from '@/stores/products'
  import { useCartStore } from '@/stores/cart'
  
  export default {
    name: 'ProductDetails',
    setup() {
      const route = useRoute() // Access the route object
      const productId = route.params.id // Get the product ID from route params
    
      const productStore = useProductStore()
      const cartStore = useCartStore()
      const product = ref(null)
      const reviews = ref([])
      const quantity = ref(1)
    
      onMounted(async () => {
        product.value = await productStore.fetchProduct(productId) // Use productId from the route
        reviews.value = await productStore.fetchReviews(productId)
      })
    
      const addToCart = () => {
        cartStore.addToCart({
          productId: product.value.id,
          quantity: quantity.value
        })
      }
    
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString()
      }
    
      return {
        product,
        reviews,
        quantity,
        addToCart,
        formatDate
      }
    }
  }

  </script>
  
  <style scoped>
  .product-details {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
  }
  
  .product-image {
    flex: 1;
    min-width: 300px;
    margin-right: 20px;
  }
  
  .product-image img {
    max-width: 100%;
    height: auto;
  }
  
  .product-info {
    flex: 1;
    min-width: 300px;
  }
  
  .price {
    font-size: 1.5em;
    font-weight: bold;
    color: #4CAF50;
  }
  
  .stock {
    margin-top: 10px;
  }
  
  .low-stock {
    color: #f44336;
  }
  
  .add-to-cart {
    margin-top: 20px;
  }
  
  .add-to-cart input {
    width: 50px;
    margin-right: 10px;
  }
  
  .add-to-cart button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .add-to-cart button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .reviews {
    width: 100%;
    margin-top: 40px;
  }
  
  .review {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
  }
  
  .rating {
    color: #FFD700;
  }
  </style>