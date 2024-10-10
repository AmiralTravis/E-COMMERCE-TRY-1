   <!-- src/components/LogIn.vue

<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          required
        >
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required
        >
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
  name: 'LogIn',
  data() {
    return {
      username: '',
      password: '',
      error: null,
      isLoading: false,
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        console.log('Login attempt initiated');
        const credentials = {
          username: this.username,
          password: this.password,
        };
        console.log('Calling authStore.login with:', credentials);
        
        const response = await authStore.login(credentials);
        console.log('Login response:', response);

        // Check if a token is received
        if (authStore.token) {
          console.log('Token received:', authStore.token.substring(0, 10) + '...');
          console.log('Redirecting to checkout...');
          this.$router.push('/cart');
        } else {
          console.error('Login succeeded but no token received');
          this.error = 'Login failed - no token received';
        }
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.response?.data?.message || 'Login failed - an unexpected error occurred';
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style> -->

<!-- src/components/LogIn.vue -->

<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          type="text" 
          id="username" 
          v-model.trim="username" 
          required
        >
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model.trim="password" 
          required
        >
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
  name: 'LogIn',
  data() {
    return {
      username: '',
      password: '',
      error: null,
      isLoading: false,
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        const credentials = {
          username: this.username,
          password: this.password,
        };
        
        const response = await authStore.login(credentials);

        // Check if a token is received
        if (authStore.token) {
          this.$router.push('/cart'); // Redirect to the cart page
        } else {
          this.error = 'Login failed - no token received';
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed - an unexpected error occurred';
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>

