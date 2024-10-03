<!-- <template>
    <div v-if="isOpen" class="auth-popup">
      <div class="auth-popup-content">
        <button @click="close" class="close-button">&times;</button>
        <h2>{{ isLogin ? 'Login' : 'Sign Up' }}</h2>
        <form @submit.prevent="submitForm">
          <div>
            <label for="username">Username:</label>
            <input type="text" v-model="username" id="username" required />
          </div>
          <div v-if="!isLogin">
            <label for="email">Email:</label>
            <input type="email" v-model="email" id="email" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" v-model="password" id="password" required />
          </div>
          <button type="submit">{{ isLogin ? 'Login' : 'Sign Up' }}</button>
        </form>
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
        <p>
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <a href="#" @click.prevent="toggleAuthMode">
            {{ isLogin ? 'Sign Up' : 'Login' }}
          </a>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    name: 'AuthPopup',
    props: {
      isOpen: Boolean
    },
    data() {
      return {
        isLogin: true,
        username: '',
        email: '',
        password: '',
        errorMessage: ''
      };
    },
    methods: {
      ...mapActions('auth', ['login', 'register']),
      close() {
        this.$emit('close');
      },
      toggleAuthMode() {
        this.isLogin = !this.isLogin;
        this.errorMessage = '';
      },
      async submitForm() {
        try {
          if (this.isLogin) {
            await this.login({ username: this.username, password: this.password });
          } else {
            await this.register({ username: this.username, email: this.email, password: this.password });
          }
          this.close();
          this.$router.push('/dashboard');
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .auth-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .auth-popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    position: relative;
    width: 300px;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
  </style> -->





  <template>
    <div v-if="isOpen" class="auth-popup">
      <div class="auth-popup-content">
        <button @click="close" class="close-button">&times;</button>
        <h2>{{ isLogin ? 'Login' : 'Sign Up' }}</h2>
        <form @submit.prevent="submitForm">
          <div>
            <label for="username">Username:</label>
            <input type="text" v-model="username" id="username" required />
          </div>
          <div v-if="!isLogin">
            <label for="email">Email:</label>
            <input type="email" v-model="email" id="email" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" v-model="password" id="password" required />
          </div>
          <button type="submit">{{ isLogin ? 'Login' : 'Sign Up' }}</button>
        </form>
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
        <p>
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <a href="#" @click.prevent="toggleAuthMode">
            {{ isLogin ? 'Sign Up' : 'Login' }}
          </a>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    name: 'AuthPopup',
    props: {
      isOpen: Boolean
    },
    data() {
      return {
        isLogin: true,
        username: '',
        email: '',
        password: '',
        errorMessage: ''
      };
    },
    methods: {
      ...mapActions('auth', ['login', 'register']),
      close() {
        this.$emit('close');
      },
      toggleAuthMode() {
        this.isLogin = !this.isLogin;
        this.errorMessage = '';
      },
      async submitForm() {
         try {
           if (this.isLogin) {
             await this.login({ username: this.username, password: this.password });
           } else {
             await this.register({ username: this.username, email: this.email, password: this.password });
           }
           this.close();
           this.$router.push('/dashboard');
         } catch (error) {
           console.error('Auth error:', error.response?.data || error.message);
           this.errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
         }
        }
    }
  };
  </script>
  
  <style scoped>
  .auth-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .auth-popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    position: relative;
    width: 300px;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
  </style>