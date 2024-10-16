<template>
  <div class="products-container">
    <h1>Our Products</h1>
    
    <!-- Filters -->
    <div class="filters">
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search products..."
          @input="debounceSearch"
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
    <div v-else class="products-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <img :src="product.imageUrl" :alt="product.name" class="product-image" />
        <div class="product-info">
          <h2>{{ product.name }}</h2>
          <p class="product-description">{{ product.description }}</p>
          <p class="product-price">${{ product.price.toFixed(2) }}</p>
          <div class="card-actions">
            <button @click="addToCart(product)" class="add-to-cart-btn">
              Add to Cart
            </button>
            <router-link :to="`/products/${product.id}`" class="view-details-btn">
              View Details
            </router-link>
          </div>
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
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useProductStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import debounce from 'lodash/debounce';

export default defineComponent({
  name: 'ProductList',
  setup() {
    const productStore = useProductStore();
    const cartStore = useCartStore();
    
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const sortBy = ref('name');

    const categories = [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Fashion' },
      { id: 3, name: 'Home & Garden' },
      { id: 4, name: 'Sports' }
    ];

    const filteredProducts = computed(() => {
      let result = [...productStore.products];

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
      cartStore.addToCart(product);
    };

    const fetchProducts = async () => {
      await productStore.fetchProducts(searchQuery.value);
    };

    const debounceSearch = debounce(() => {
      fetchProducts();
    }, 300);

    const filterProducts = () => {
      fetchProducts();
    };

    onMounted(() => {
      fetchProducts();
    });

    watch(searchQuery, (newValue) => {
      if (newValue === '') {
        fetchProducts();
      }
    });

    return {
      searchQuery,
      selectedCategory,
      sortBy,
      categories,
      filteredProducts,
      loading: computed(() => productStore.loading),
      error: computed(() => productStore.error),
      addToCart,
      debounceSearch,
      filterProducts
    };
  }
});
</script>

<style scoped>
.products-container {
  max-width: 1200px;
  margin: 0 auto;
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
  width: 200px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
  background-color: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-info h2 {
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  color: #333;
}

.product-description {
  color: #666;
  margin: 10px 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.product-price {
  font-size: 1.2em;
  font-weight: bold;
  color: #2ecc71;
  margin: 10px 0;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.add-to-cart-btn,
.view-details-btn {
  flex: 1;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.add-to-cart-btn {
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
}

.add-to-cart-btn:hover {
  background-color: #2980b9;
}

.view-details-btn {
  background-color: #34495e;
  color: white;
}

.view-details-btn:hover {
  background-color: #2c3e50;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 40px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .search-bar input,
  .category-filter select,
  .sort-filter select {
    width: 100%;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>