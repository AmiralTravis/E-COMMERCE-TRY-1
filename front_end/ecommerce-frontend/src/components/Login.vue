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
  import axios from 'axios';
  
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
          const response = await axios.post('http://localhost:5000/api/auth/login', {
            username: this.username,
            password: this.password
          });
          if (response.status === 200) {
            localStorage.setItem('authToken', response.data.token);
            this.$router.push('/dashboard'); // Redirect to a protected route
          }
        } catch (error) {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      }
    }
  };
  </script>
   -->

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
  import api from '../services/api';
  
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
          const response = await api.post('/api/auth/login', {
            username: this.username,
            password: this.password
          });
          if (response.status === 200) {
            localStorage.setItem('authToken', response.data.token);
            this.$router.push('/dashboard'); // Redirect to a protected route
          }
        } catch (error) {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      }
    }
  };
  </script>
  