<!-- <template>
    <div class="home"> -->
      <!-- Hero Banner Section -->
      <!-- <div class="hero-banner">
        <img src="@/assets/hero-banner.jpg" alt="Hero Banner" />
        <h1>Welcome to Our Store</h1>
        <p>Find the best products at unbeatable prices!</p>
        <router-link to="/products" class="shop-now-btn">Shop Now</router-link>
      </div> -->
  
      <!-- Featured Categories Section -->
      <!-- <section class="categories">
        <h2>Featured Categories</h2>
        <div class="category-list">
          <div class="category" v-for="category in categories" :key="category.id">
            <img :src="category.image" :alt="category.name" />
            <router-link :to="`/category/${category.id}`">{{ category.name }}</router-link>
          </div>
        </div>
      </section> -->
  
      <!-- Featured Products Section -->
      <!-- <section class="featured-products">
        <h2>Featured Products</h2>
        <div class="product-list">
          <div class="product" v-for="product in featuredProducts" :key="product.id">
            <img :src="product.image" :alt="product.name" />
            <h3>{{ product.name }}</h3>
            <p>\${{ product.price }}</p>
            <router-link :to="`/products/${product.id}`" class="view-details-btn">View Details</router-link>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        categories: [
          // Replace with real data or API call
          { id: 1, name: "Electronics", image: "@/assets/electronics.jpg" },
          { id: 2, name: "Fashion", image: "@/assets/fashion.jpg" },
          // Add more categories as needed
        ],
        featuredProducts: [
          // Replace with real data or API call
          { id: 1, name: "Smartphone", price: 299, image: "@/assets/smartphone.jpg" },
          { id: 2, name: "Laptop", price: 999, image: "@/assets/laptop.jpg" },
          // Add more products as needed
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add styles for the home page */
  .hero-banner {
    text-align: center;
    padding: 20px;
    background-color: #f5f5f5;
    margin-bottom: 20px;
  }
  
  .categories,
  .featured-products {
    margin: 20px 0;
  }
  
  .category-list,
  .product-list {
    display: flex;
    gap: 20px;
  }
  
  .category,
  .product {
    text-align: center;
    width: 200px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
  }
  </style>
   -->



   <template>
    <div class="home">
      <!-- Sign Up Button in the top right -->
      <div class="top-nav">
        <router-link to="/signup" class="signup-btn">Sign Up</router-link>
      </div>
  
      <!-- Hero Banner Section -->
      <div class="hero-banner">
        <img src="@/assets/hero-banner.jpg" alt="Hero Banner" />
        <h1>Welcome to Our Store</h1>
        <p>Find the best products at unbeatable prices!</p>
        <router-link to="/products" class="shop-now-btn">Shop Now</router-link>
      </div>
  
      <!-- Featured Categories Section -->
      <section class="categories">
        <h2>Featured Categories</h2>
        <div class="category-list">
          <div class="category" v-for="category in categories" :key="category.id">
            <img :src="category.image" :alt="category.name" />
            <router-link :to="`/category/${category.id}`">{{ category.name }}</router-link>
          </div>
        </div>
      </section>
  
      <!-- Featured Products Section -->
      <section class="featured-products">
        <h2>Featured Products</h2>
        <div class="product-list">
          <div class="product" v-for="product in featuredProducts" :key="product.id">
            <img :src="product.image" :alt="product.name" />
            <h3>{{ product.name }}</h3>
            <p>\${{ product.price }}</p>
            <router-link :to="`/products/${product.id}`" class="view-details-btn">View Details</router-link>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        categories: [
          // Replace with real data or API call
          { id: 1, name: "Electronics", image: "@/assets/electronics.jpg" },
          { id: 2, name: "Fashion", image: "@/assets/fashion.jpg" },
          // Add more categories as needed
        ],
        featuredProducts: [
          // Replace with real data or API call
          { id: 1, name: "Smartphone", price: 299, image: "@/assets/smartphone.jpg" },
          { id: 2, name: "Laptop", price: 999, image: "@/assets/laptop.jpg" },
          // Add more products as needed
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add styles for the home page */
  .top-nav {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    background-color: #f5f5f5;
  }
  
  .signup-btn {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border-radius: 5px;
    text-decoration: none;
  }
  
  .signup-btn:hover {
    background-color: #0056b3;
  }
  
  .hero-banner {
    text-align: center;
    padding: 20px;
    background-color: #f5f5f5;
    margin-bottom: 20px;
  }
  
  .categories,
  .featured-products {
    margin: 20px 0;
  }
  
  .category-list,
  .product-list {
    display: flex;
    gap: 20px;
  }
  
  .category,
  .product {
    text-align: center;
    width: 200px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
  }
  </style>
  