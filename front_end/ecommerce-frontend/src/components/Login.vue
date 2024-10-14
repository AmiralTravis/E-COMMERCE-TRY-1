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
 -->
<!-- src/components/LogIn.vue -->

<!-- <template>
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
      console.log('Login function triggered'); // Add this line to log when the function is called
      
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

<!-- <script>
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
      console.log('Login function triggered');
      
      this.isLoading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        const credentials = {
          username: this.username,
          password: this.password,
        };
        
        console.log('Attempting login with credentials:', { username: credentials.username });
        const response = await authStore.login(credentials);
        console.log('Login response:', response);
        
        if (authStore.token) {
          console.log('Token received, redirecting to cart');
          this.$router.push('/cart');
        } else {
          console.error('No token received after login');
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
</script> -->
<!-- src/components/LogIn.vue -->
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
      console.log('Login function triggered');
      
      this.isLoading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        const credentials = {
          username: this.username,
          password: this.password,
        };
        
        // Debug log - remove in production!
        console.log('Attempting login with credentials:', credentials);
        
        const response = await authStore.login(credentials);
        console.log('Login response:', response);
        
        if (authStore.token) {
          console.log('Token received, redirecting to cart');
          this.$router.push('/cart');
        } else {
          console.error('No token received after login');
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
</style>