<!-- <template>
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
</script> -->





<template>
  <div class="product-list">
    <h1>Our Products</h1>
    
    <!-- Filters -->
    <div class="filters">
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search products..."
          @input="filterProducts"
        >
      </div>
      <div class="category-filter">
        <select v-model="selectedCategory" @change="filterProducts">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="sort-filter">
        <select v-model="sortBy" @change="filterProducts">
          <option value="name">Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <p>Loading products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <!-- Product Grid -->
    <div v-else class="product-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <img :src="`/api/placeholder/200/200`" :alt="product.name" />
        <h2>{{ product.name }}</h2>
        <p class="description">{{ product.description }}</p>
        <p class="price">${{ product.price.toFixed(2) }}</p>
        <div class="card-actions">
          <button @click="addToCart(product)" class="add-to-cart">Add to Cart</button>
          <router-link :to="`/products/${product.id}`" class="view-details">View Details</router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && filteredProducts.length === 0" class="empty-state">
      <p>No products found.</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ProductList',
  setup() {
    const store = useStore();
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const sortBy = ref('name');

    const products = computed(() => store.state.products.products);
    const loading = computed(() => store.state.products.loading);
    const error = computed(() => store.state.products.error);

    const categories = [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Fashion' },
      { id: 3, name: 'Home & Garden' },
      { id: 4, name: 'Sports' }
    ];

    const filteredProducts = computed(() => {
      let result = [...products.value];

      // Apply search filter
      if (searchQuery.value) {
        result = result.filter(product => 
          product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      // Apply category filter
      if (selectedCategory.value) {
        result = result.filter(product => product.categoryId === selectedCategory.value);
      }

      // Apply sorting
      result.sort((a, b) => {
        if (sortBy.value === 'price-low') return a.price - b.price;
        if (sortBy.value === 'price-high') return b.price - a.price;
        return a.name.localeCompare(b.name);
      });

      return result;
    });

    const addToCart = (product) => {
      store.dispatch('cart/addToCart', product);
    };

    onMounted(() => {
      store.dispatch('products/fetchProducts');
    });

    return {
      searchQuery,
      selectedCategory,
      sortBy,
      categories,
      products,
      filteredProducts,
      loading,
      error,
      addToCart
    };
  }
});
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.search-bar input,
.category-filter select,
.sort-filter select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-card img {
  width: 100%;
  height: auto;
}

.product-card h2 {
  font-size: 1.2rem;
  margin: 10px;
}

.description {
  margin: 10px;
  color: #666;
}

.price {
  font-weight: bold;
  color: #e74c3c;
  margin: 10px;
}

.card-actions {
  display: flex;
  padding: 10px;
}

.add-to-cart,
.view-details {
  flex: 1;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  color: white;
}

.add-to-cart {
  background-color: #3498db;
  border: none;
  cursor: pointer;
}

.view-details {
  background-color: #34495e;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 20px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
}
</style>