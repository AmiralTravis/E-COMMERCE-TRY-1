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
  </script>