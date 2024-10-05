  <!-- <template>
    <div class="login">
      <h1>Log In</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" v-model="username" id="username" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit" :disabled="loading">{{ loading ? 'Logging in...' : 'Log In' }}</button>
      </form>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p>Don't have an account? <router-link to="/signup">Sign up</router-link></p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const loading = ref(false);
  
  const login = async () => {
    loading.value = true;
    error.value = '';
    try {
      await authStore.login({
        username: username.value,
        password: password.value
      });
      router.push('/dashboard');
    } catch (err) {
      error.value = err.message || 'Invalid credentials. Please try again.';
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .login {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .error-message {
    color: red;
  }
  </style> -->

  <template>
    <div class="login">
      <h1>Log In</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" v-model="username" id="username" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit" :disabled="loading">{{ loading ? 'Logging in...' : 'Log In' }}</button>
      </form>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p>Don't have an account? <router-link to="/signup">Sign up</router-link></p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const loading = ref(false);
  
  const login = async () => {
    console.log('Login attempt initiated');
    loading.value = true;
    error.value = '';
    try {
      console.log('Calling authStore.login with:', { username: username.value });
      await authStore.login({
        username: username.value,
        password: password.value
      });
      console.log('Login successful, redirecting to dashboard');
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      error.value = err.message || 'Invalid credentials. Please try again.';
    } finally {
      loading.value = false;
      console.log('Login attempt completed');
    }
  };
  </script>
  
  <style scoped>
  .login {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .error-message {
    color: red;
  }
  </style>