  <!-- components/SignUp.vue
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
  </style> -->

  <!-- components/SignUp.vue -->
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
    errorMessage.value = error.response?.data?.error || 'Error registering user. Please try again.'; // Updated error handling
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
