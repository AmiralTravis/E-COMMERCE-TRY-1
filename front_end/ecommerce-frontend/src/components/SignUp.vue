   <!-- <template>
    <div class="signup">
      <h1>Sign Up</h1>
      <form @submit.prevent="submitSignupForm">
        <div>
          <label for="username">Username:</label>
          <input type="text" v-model="username" id="username" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" id="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit">Sign Up</button>
      </form> -->
      <!-- Display a message based on success or failure -->
      <!-- <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      <p>Already have an account? <router-link to="/login">Log in</router-link></p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        successMessage: '',
        errorMessage: ''
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
      }
    }
  };
  </script>
  
  <style scoped>
  .signup {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  form div {
    margin-bottom: 10px;
  }
  
  button {
    margin-top: 10px;
  }
  </style>
   -->

   <!-- <template>
    <div class="signup">
      <h1>Sign Up</h1>
      <form @submit.prevent="submitSignupForm">
        <div>
          <label for="username">Username:</label>
          <input type="text" v-model="username" id="username" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" id="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      <p>Already have an account? <router-link to="/login">Log in</router-link></p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        successMessage: '',
        errorMessage: ''
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
  
          await this.$store.dispatch('auth/register', signupData);
          this.successMessage = 'User registered successfully!';
          this.errorMessage = '';
          this.$router.push('/dashboard');
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Error registering user. Please try again.';
          this.successMessage = '';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .signup {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  form div {
    margin-bottom: 10px;
  }
  
  button {
    margin-top: 10px;
  }
  </style> -->



  <template>
    <div class="signup">
      <h1>Sign Up</h1>
      <form @submit.prevent="submitSignupForm">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" v-model="username" id="username" required />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" v-model="email" id="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit" :disabled="loading">{{ loading ? 'Signing up...' : 'Sign Up' }}</button>
      </form>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p>Already have an account? <router-link to="/login">Log in</router-link></p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const successMessage = ref('');
  const errorMessage = ref('');
  const loading = ref(false);
  
  const submitSignupForm = async () => {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';
    try {
      const signupData = {
        username: username.value,
        email: email.value,
        password: password.value
      };
      await authStore.register(signupData);
      successMessage.value = 'User registered successfully!';
      router.push('/dashboard');
    } catch (error) {
      errorMessage.value = error.message || 'Error registering user. Please try again.';
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .signup {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .success-message {
    color: green;
  }
  .error-message {
    color: red;
  }
  </style>