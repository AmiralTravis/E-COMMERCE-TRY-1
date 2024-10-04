  <!-- <template>
    <div>
      <form @submit.prevent="login">
        <div>
          <label for="username">Username:</label>
          <input type="text" v-model="username" id="username" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit">Log In</button>
      </form>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        errorMessage: ''
      };
    },
    methods: {
      async login() {
        try {
          await this.$store.dispatch('auth/login', {
            username: this.username,
            password: this.password
          });
          // Redirect to cart or checkout page instead of dashboard
          this.$router.push('/cart');
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
        }
      }
    }
  };
  </script> -->


<!-- 
  <template>
    <div>
      <form @submit.prevent="login">
        <div>
          <label for="username">Username:</label>
          <input type="text" v-model="username" id="username" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit">Log In</button>
      </form>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import { nextTick } from 'vue';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        errorMessage: ''
      };
    },
    methods: {
      async login() {
        try {
          await this.$store.dispatch('auth/login', {
            username: this.username,
            password: this.password
          });
          // Force a re-render of the entire app
          await nextTick();
          // Redirect to cart or checkout page
          this.$router.push('/checkout');
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
        }
      }
    }
  };
  </script> -->














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
  </style>