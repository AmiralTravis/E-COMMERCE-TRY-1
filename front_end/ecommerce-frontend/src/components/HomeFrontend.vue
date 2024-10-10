<!-- components/HomeFrontend.vue
<template>
  <div class="home"> -->
    <!-- Hero Banner Section -->
    <!-- <section class="hero-banner">
      <div class="hero-content">
        <h1>Welcome to Our E-Shop</h1>
        <p>Discover amazing products at unbeatable prices!</p>
        <router-link to="/products" class="cta-button">Shop Now</router-link>
      </div>
    </section> -->

    <!-- Featured Categories Section -->
    <!-- <section class="categories">
      <h2>Featured Categories</h2>
      <div class="category-grid">
        <div v-for="category in categories" :key="category.id" class="category-card">
          <img :src="`/api/placeholder/${category.imageWidth}/${category.imageHeight}`" :alt="category.name" />
          <h3>{{ category.name }}</h3>
          <router-link :to="`/products?category=${category.id}`" class="category-link">
            Explore {{ category.name }}
          </router-link>
        </div>
      </div>
    </section> -->

    <!-- Featured Products Section -->
    <!-- <section class="featured-products">
      <h2>Featured Products</h2>
      <div class="product-grid">
        <div v-for="product in featuredProducts" :key="product.id" class="product-card">
          <img :src="`/api/placeholder/${product.imageWidth}/${product.imageHeight}`" :alt="product.name" />
          <h3>{{ product.name }}</h3>
          <p class="price">${{ product.price.toFixed(2) }}</p>
          <button @click="addToCart(product)" class="add-to-cart">Add to Cart</button>
          <router-link :to="`/products/${product.id}`" class="view-details">View Details</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

export default defineComponent({
  name: 'HomeFrontend',
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();

    // Categories can be fetched from an API in a real-world scenario.
    const categories = [
      { id: 1, name: "Electronics", imageWidth: 300, imageHeight: 200 },
      { id: 2, name: "Fashion", imageWidth: 300, imageHeight: 200 },
      { id: 3, name: "Home & Garden", imageWidth: 300, imageHeight: 200 },
      { id: 4, name: "Sports", imageWidth: 300, imageHeight: 200 }
    ];

    // Use store state to get featured products if necessary
    const featuredProducts = [
      { id: 1, name: "Smart Watch", price: 199.99, imageWidth: 200, imageHeight: 200 },
      { id: 2, name: "Wireless Earbuds", price: 89.99, imageWidth: 200, imageHeight: 200 },
      { id: 3, name: "Laptop Pro", price: 999.99, imageWidth: 200, imageHeight: 200 },
      { id: 4, name: "4K Monitor", price: 299.99, imageWidth: 200, imageHeight: 200 }
    ];

    const addToCart = (product) => {
      // Check if the user is authenticated before adding to cart
      if (authStore.isAuthenticated) {
        cartStore.addToCart(product);
      } else {
        alert('Please log in to add items to your cart.');
      }
    };

    return {
      categories,
      featuredProducts,
      addToCart
    };
  }
});
</script>

<style scoped>
.hero-banner {
  background-color: #f5f5f5;
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #2980b9;
}

.categories, .featured-products {
  margin-bottom: 3rem;
}

.category-grid, .product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.category-card, .product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.category-card:hover, .product-card:hover {
  transform: translateY(-5px);
}

.category-card img, .product-card img {
  width: 100%;
  height: auto;
}

.category-link, .add-to-cart, .view-details {
  display: block;
  padding: 0.5rem;
  text-align: center;
  text-decoration: none;
  color: white;
}

.category-link {
  background-color: #2ecc71;
}

.add-to-cart {
  background-color: #3498db;
  border: none;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.view-details {
  background-color: #34495e;
}

.price {
  font-weight: bold;
  color: #e74c3c;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .category-grid, .product-grid {
    grid-template-columns: 1fr;
  }
}
</style> -->


<!-- components/HomeFrontend.vue -->
<template>
  <div class="home">
    <!-- Hero Banner Section -->
    <section class="hero-banner">
      <div class="hero-content">
        <h1>Welcome to Our E-Shop</h1>
        <p>Discover amazing products at unbeatable prices!</p>
        <router-link to="/products" class="cta-button">Shop Now</router-link>
      </div>
    </section>

    <!-- Featured Categories Section -->
    <section class="categories">
      <h2>Featured Categories</h2>
      <div class="category-grid">
        <div v-for="category in categories" :key="category.id" class="category-card">
          <img :src="`/api/placeholder/${category.imageWidth}/${category.imageHeight}`" :alt="category.name" />
          <h3>{{ category.name }}</h3>
          <router-link :to="`/products?category=${category.id}`" class="category-link">
            Explore {{ category.name }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-products">
      <h2>Featured Products</h2>
      <div class="product-grid">
        <div v-for="product in featuredProducts" :key="product.id" class="product-card">
          <img :src="`/api/placeholder/${product.imageWidth}/${product.imageHeight}`" :alt="product.name" />
          <h3>{{ product.name }}</h3>
          <p class="price">${{ product.price.toFixed(2) }}</p>
          <button @click="addToCart(product)" class="add-to-cart">Add to Cart</button>
          <router-link :to="`/products/${product.id}`" class="view-details">View Details</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

export default defineComponent({
  name: 'HomeFrontend',
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();

    // Categories can be fetched from an API in a real-world scenario.
    const categories = [
      { id: 1, name: "Electronics", imageWidth: 300, imageHeight: 200 },
      { id: 2, name: "Fashion", imageWidth: 300, imageHeight: 200 },
      { id: 3, name: "Home & Garden", imageWidth: 300, imageHeight: 200 },
      { id: 4, name: "Sports", imageWidth: 300, imageHeight: 200 }
    ];

    // Use store state to get featured products if necessary
    const featuredProducts = [
      { id: 1, name: "Smart Watch", price: 199.99, imageWidth: 200, imageHeight: 200 },
      { id: 2, name: "Wireless Earbuds", price: 89.99, imageWidth: 200, imageHeight: 200 },
      { id: 3, name: "Laptop Pro", price: 999.99, imageWidth: 200, imageHeight: 200 },
      { id: 4, name: "4K Monitor", price: 299.99, imageWidth: 200, imageHeight: 200 }
    ];

    const addToCart = (product) => {
      // Check if the user is authenticated before adding to cart
      if (authStore.isAuthenticated) {
        cartStore.addToCart(product);
      } else {
        alert('Please log in to add items to your cart.');
      }
    };

    const fetchUserData = () => {
      // Simulate fetching user-specific data
      if (authStore.isAuthenticated) {
        // Fetch user cart or personalized recommendations if necessary
        console.log("Fetching user-specific data...");
        // Example: cartStore.loadUserCart();
      }
    };

    // Call fetchUserData on component mount
    onMounted(() => {
      fetchUserData();
    });

    return {
      categories,
      featuredProducts,
      addToCart
    };
  }
});
</script>

<style scoped>
.hero-banner {
  background-color: #f5f5f5;
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #2980b9;
}

.categories, .featured-products {
  margin-bottom: 3rem;
}

.category-grid, .product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.category-card, .product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.category-card:hover, .product-card:hover {
  transform: translateY(-5px);
}

.category-card img, .product-card img {
  width: 100%;
  height: auto;
}

.category-link, .add-to-cart, .view-details {
  display: block;
  padding: 0.5rem;
  text-align: center;
  text-decoration: none;
  color: white;
}

.category-link {
  background-color: #2ecc71;
}

.add-to-cart {
  background-color: #3498db;
  border: none;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.view-details {
  background-color: #34495e;
}

.price {
  font-weight: bold;
  color: #e74c3c;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .category-grid, .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
