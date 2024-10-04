<!-- <template>
  <div class="home"> -->
    <!-- Sign Up Button in the top right
    <div class="top-nav">
      <button @click="showSignUpModal = true" class="signup-btn">Sign Up</button>
    </div> -->

    <!-- Hero Banner Section -->
    <!-- <div class="hero-banner">
      <img src="~@/assets/hero-banner.jpg" alt="Hero Banner" />
      <h1>Welcome to Our Store</h1>
      <p>Find the best products at unbeatable prices!</p>
      <router-link to="/products" class="shop-now-btn">Shop Now</router-link>
    </div> -->

    <!-- Featured Categories Section -->
    <!-- <section class="categories">
      <h2>Featured Categories</h2>
      <div class="category-list">
        <div class="category" v-for="category in categories" :key="category.id">
          <img :src="require(`@/assets/${category.image}`)" :alt="category.name" />
          <router-link :to="`/category/${category.id}`">{{ category.name }}</router-link>
        </div>
      </div>
    </section> -->

    <!-- Featured Products Section -->
    <!-- <section class="featured-products">
      <h2>Featured Products</h2>
      <div class="product-list">
        <div class="product" v-for="product in featuredProducts" :key="product.id">
          <img :src="require(`@/assets/${product.image}`)" :alt="product.name" />
          <h3>{{ product.name }}</h3>
          <p>\${{ product.price }}</p>
          <router-link :to="`/products/${product.id}`" class="view-details-btn">View Details</router-link>
        </div>
      </div>
    </section> -->

    <!-- Sign Up Modal -->
    <!-- <Modal v-model:visible="showSignUpModal">
      <div class="auth-form">
        <template v-if="showSignUp">
          <h1>Sign Up</h1>
          <form @submit.prevent="submitSignupForm">
            <div>
              <label for="signup-username">Username:</label>
              <input type="text" v-model="username" id="signup-username" required />
            </div>
            <div>
              <label for="signup-email">Email:</label>
              <input type="email" v-model="email" id="signup-email" required />
            </div>
            <div>
              <label for="signup-password">Password:</label>
              <input type="password" v-model="password" id="signup-password" required />
            </div>
            <button type="submit">Sign Up</button>
          </form>
          <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
          <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
          <p>Already have an account? <a href="#" @click="toggleForm">Log in</a></p>
        </template>

        <template v-else>
          <h1>Log In</h1>
          <form @submit.prevent="submitLoginForm">
            <div>
              <label for="login-username">Username:</label>
              <input type="text" v-model="loginUsername" id="login-username" required />
            </div>
            <div>
              <label for="login-password">Password:</label>
              <input type="password" v-model="loginPassword" id="login-password" required />
            </div>
            <button type="submit">Log In</button>
          </form>
          <p v-if="loginSuccessMessage" style="color: green">{{ loginSuccessMessage }}</p>
          <p v-if="loginErrorMessage" style="color: red">{{ loginErrorMessage }}</p>
          <p>Don't have an account? <a href="#" @click="toggleForm">Sign up</a></p>
        </template>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from './ModalFrontend.vue'; // Ensure the correct path to Modal.vue
import axios from 'axios';

export default {
  components: {
    Modal
  },
  data() {
    return {
      showSignUpModal: false,
      showSignUp: true,
      username: '',
      email: '',
      password: '',
      loginUsername: '',
      loginPassword: '',
      successMessage: '',
      errorMessage: '',
      loginSuccessMessage: '',
      loginErrorMessage: '',
      categories: [
        { id: 1, name: "Electronics", image: "electronics.jpg" },
        { id: 2, name: "Fashion", image: "fashion.jpg" },
        // Add more categories as needed
      ],
      featuredProducts: [
        { id: 1, name: "Smartphone", price: 299, image: "smartphone.jpg" },
        { id: 2, name: "Laptop", price: 999, image: "laptop.jpg" },
        // Add more products as needed
      ]
    };
  },
  methods: {
    async submitSignupForm() {
      try {
        const signupData = {
          username: this.username,
          email: this.email,
          password: this.password
        };

        const response = await axios.post('http://localhost:5000/api/auth/register', signupData);

        if (response.status === 201) {
          this.successMessage = 'User registered successfully!';
          this.errorMessage = '';
        }
      } catch (error) {
        this.errorMessage = 'Error registering user. Please try again.';
        this.successMessage = '';
      }
    },
    async submitLoginForm() {
      try {
        const loginData = {
          username: this.loginUsername,
          password: this.loginPassword
        };

        const response = await axios.post('http://localhost:5000/api/auth/login', loginData);

        if (response.status === 200) {
          this.loginSuccessMessage = 'Login successful!';
          this.loginErrorMessage = '';
        }
      } catch (error) {
        this.loginErrorMessage = 'Error logging in. Please try again.';
        this.loginSuccessMessage = '';
      }
    },
    toggleForm() {
      this.showSignUp = !this.showSignUp;
    }
  }
};
</script>

<style scoped>
/* Add styles for the home page */
/* .top-nav {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background-color: #f5f5f5;
} */
/* 
.signup-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  border: none;
  cursor: pointer;
} */

/* .signup-btn:hover {
  background-color: #0056b3;
} */

.hero-banner {
  text-align: center;
  padding: 20px;
  background-color: #f5f5f5;
  margin-bottom: 20px;
}

.hero-banner img {
  width: 100%;
  height: auto;
}

.categories,
.featured-products {
  margin: 20px 0;
}

.category-list,
.product-list {
  display: flex;
  flex-wrap: wrap; /* Allows items to wrap onto new lines */
  gap: 20px;
  justify-content: center; /* Center align items */
}

.category,
.product {
  text-align: center;
  width: 100%; /* Full width on smaller screens */
  max-width: 200px; /* Set a maximum width */
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  overflow: hidden; /* Hide overflow to prevent any content from spilling out */
}

.category img,
.product img {
  width: 100%; /* Make images fit within their containers */
  height: auto; /* Maintain aspect ratio */
  object-fit: cover; /* Ensure the image covers the container properly */
}

@media (max-width: 768px) {
  .category,
  .product {
    width: 100%; /* Full width on smaller screens */
    max-width: 100%; /* Ensure it doesn’t exceed container */
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
} -->
<!-- 
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #333;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style> -->






















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
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'HomeFrontend',
  setup() {
    const store = useStore();

    const categories = [
      { id: 1, name: "Electronics", imageWidth: 300, imageHeight: 200 },
      { id: 2, name: "Fashion", imageWidth: 300, imageHeight: 200 },
      { id: 3, name: "Home & Garden", imageWidth: 300, imageHeight: 200 },
      { id: 4, name: "Sports", imageWidth: 300, imageHeight: 200 }
    ];

    const featuredProducts = [
      { id: 1, name: "Smart Watch", price: 199.99, imageWidth: 200, imageHeight: 200 },
      { id: 2, name: "Wireless Earbuds", price: 89.99, imageWidth: 200, imageHeight: 200 },
      { id: 3, name: "Laptop Pro", price: 999.99, imageWidth: 200, imageHeight: 200 },
      { id: 4, name: "4K Monitor", price: 299.99, imageWidth: 200, imageHeight: 200 }
    ];

    const addToCart = (product) => {
      store.dispatch('cart/addToCart', product);
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
</style>