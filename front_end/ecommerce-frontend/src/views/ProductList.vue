<template>
  <div class="products-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <p>Loading products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <!-- Product List -->
    <div v-else class="products-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.imageUrl" :alt="product.name" class="product-image" />
        <div class="product-info">
          <a :href="`/products/${product.id}`" target="_blank" class="product-name">
            {{ product.name }}
          </a>
          <!-- Star Rating -->
          <div class="star-rating">
            <span v-for="star in 5" :key="star" class="star">
              {{ star <= Math.round(Number(product.avgRating) || 0) ? '★' : '☆' }}
            </span>
            <span class="rating-text">
              ({{ (Number(product.avgRating) || 0).toFixed(1) }})
            </span>
            <span class="review-count">
              {{ product.reviewCount || 0 }} reviews
            </span>
          </div>
          <p class="product-description">{{ product.description }}</p>
          <p class="product-price">${{ product.price.toFixed(2) }}</p>
          <button @click="addToCart(product)" class="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="page-btn"
      >
        Previous
      </button>
      <button 
        v-for="page in totalPages" 
        :key="page"
        :class="['page-btn', { active: page === currentPage }]"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      <button 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="page-btn"
      >
        Next
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && products.length === 0" class="empty-state">
      <p>No products found.</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, watch } from 'vue';
import { useProductStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'ProductList',
  setup() {
    const productStore = useProductStore();
    const cartStore = useCartStore();
    const route = useRoute();
    const router = useRouter();

    const products = computed(() => productStore.getProducts);
    const loading = computed(() => productStore.isLoading);
    const error = computed(() => productStore.getError);
    const currentPage = computed(() => productStore.getPagination.page);
    const totalPages = computed(() => productStore.getPagination.totalPages);

    // const loadProducts = async () => {
    //   // Ensure categories is always an array
    //   const categories = Array.isArray(route.query.categories)
    //     ? route.query.categories
    //     : route.query.categories
    //       ? route.query.categories.split(',').map(Number)
    //       : [];

    //   const searchParams = {
    //     limit: 15,
    //     page: currentPage.value,
    //     query: route.query.search || undefined,
    //     categories: categories.length ? categories : undefined,
    //     minPrice: route.query.minPrice || undefined,
    //     maxPrice: route.query.maxPrice || undefined,
    //     minRating: route.query.minRating || undefined
    //   };

    //   await productStore.fetchProducts(searchParams);

    //   // Save search query to recent searches if it exists
    //   if (route.query.search) {
    //     productStore.saveRecentSearch(route.query.search);
    //   }
    // };
    const loadProducts = async () => {
      const searchParams = {
        limit: 15, // Ensure this is 15
        page: currentPage.value,
        query: route.query.search || undefined,
        categories: route.query.categories?.split(',').map(Number) || [],
        minPrice: route.query.minPrice || undefined,
        maxPrice: route.query.maxPrice || undefined,
        minRating: route.query.minRating || undefined
      };

      await productStore.fetchProducts(searchParams);

      // Save search query to recent searches if it exists
      if (route.query.search) {
        productStore.saveRecentSearch(route.query.search);
      }
    };

    const changePage = (page) => {
      router.push({
        query: {
          ...route.query,
          page
        }
      });
      productStore.setPage(page);
    };

    const addToCart = (product) => {
      cartStore.addToCart(product);
    };

    // Load products on mount
    onMounted(() => {
      productStore.loadRecentSearches(); // Load recent searches from localStorage
      loadProducts();
      console.log('Products:', products.value); // Debugging
    });

    // Watch for route query changes
    watch(() => route.query, (newQuery) => {
      console.log('Route query changed:', newQuery); // Debugging
      loadProducts();
    }, { deep: true });

    return {
      products,
      loading,
      error,
      currentPage,
      totalPages,
      changePage,
      addToCart
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

.products-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-card {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.product-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 20px;
  flex: 1;
}

.product-name {
  font-size: 1.2rem;
  color: #333;
  text-decoration: none;
  margin-bottom: 10px;
  display: block;
}

.product-name:hover {
  color: #3498db;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 10px 0;
}

.star {
  color: #f1c40f;
  font-size: 1.2rem;
}

.rating-text {
  color: #666;
  font-size: 0.9rem;
}

.product-description {
  color: #666;
  margin: 10px 0;
}

.product-price {
  font-size: 1.2em;
  font-weight: bold;
  color: #2ecc71;
  margin: 10px 0;
}

.add-to-cart-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.page-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .product-card {
    flex-direction: column;
  }

  .product-image {
    width: 100%;
  }
}

.review-count {
  margin-left: 8px;
  color: #666;
  font-size: 0.9rem;
}
</style>