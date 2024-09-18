<!-- <template>
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
      </form> -->
      <!-- Display a message based on success or failure -->
      <!-- <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
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
   -->

   <template>
    <div class="modal">
      <div class="modal-content">
        <span class="close" @click="$emit('update:visible', false)">&times;</span>
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
        <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
        <p>Don't have an account? <router-link to="/signup">Sign up</router-link></p>
      </div>
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
  .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 30%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .close:hover {
    color: black;
  }
  </style>
  