<template>
  <div class="home">
    <!-- Sign Up Button in the top right -->
    <div class="top-nav">
      <button @click="showSignUpModal = true" class="signup-btn">Sign Up</button>
    </div>

    <!-- Hero Banner Section -->
    <div class="hero-banner">
      <img src="~@/assets/hero-banner.jpg" alt="Hero Banner" />
      <h1>Welcome to Our Store</h1>
      <p>Find the best products at unbeatable prices!</p>
      <router-link to="/products" class="shop-now-btn">Shop Now</router-link>
    </div>

    <!-- Featured Categories Section -->
    <section class="categories">
      <h2>Featured Categories</h2>
      <div class="category-list">
        <div class="category" v-for="category in categories" :key="category.id">
          <img :src="require(`@/assets/${category.image}`)" :alt="category.name" />
          <router-link :to="`/category/${category.id}`">{{ category.name }}</router-link>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-products">
      <h2>Featured Products</h2>
      <div class="product-list">
        <div class="product" v-for="product in featuredProducts" :key="product.id">
          <img :src="require(`@/assets/${product.image}`)" :alt="product.name" />
          <h3>{{ product.name }}</h3>
          <p>\${{ product.price }}</p>
          <router-link :to="`/products/${product.id}`" class="view-details-btn">View Details</router-link>
        </div>
      </div>
    </section>

    <!-- Sign Up Modal -->
    <Modal v-model:visible="showSignUpModal">
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
import Modal from './Modal.vue'; // Ensure the correct path to Modal.vue
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
  border: none;
  cursor: pointer;
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
}

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
</style>
