<template>
    <div class="login">
      <h1>Log In</h1>
      <form @submit.prevent="submitLoginForm">
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
      <!-- Display a message based on success or failure -->
      <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      <p>Don't have an account? <router-link to="/signup">Sign up</router-link></p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        successMessage: '',
        errorMessage: ''
      };
    },
    methods: {
      async submitLoginForm() {
        try {
          const loginData = {
            username: this.username,
            password: this.password
          };
  
          const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
  
          if (response.status === 200) {
            this.successMessage = 'Login successful!';
            this.errorMessage = '';
            // Redirect or perform any other actions after successful login
          }
        } catch (error) {
          this.errorMessage = 'Error logging in. Please try again.';
          this.successMessage = '';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login {
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
  