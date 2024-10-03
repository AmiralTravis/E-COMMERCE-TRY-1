<!-- <template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/products">Products</router-link></li>
        <li><router-link to="/cart">Cart</router-link></li>
        <template v-if="isAuthenticated">
          <li><router-link to="/checkout">Checkout</router-link></li>
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><a @click.prevent="handleLogout" href="#">Logout</a></li>
        </template>
        <template v-else>
          <li><a @click.prevent="$emit('open-auth-popup')" href="#">Login/Signup</a></li>
        </template>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'HeaderFrontend',
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'currentUser']),
  },
  methods: {
    ...mapActions('auth', ['logout']),
    async handleLogout() {
      console.log('Logout button clicked');
      await this.logout();
      console.log('Logout completed, redirecting to home');
      this.$router.push('/');
    }
  },
  watch: {
    isAuthenticated: {
      handler(newValue) {
        console.log('Authentication status changed:', newValue);
        if (newValue) {
          console.log('User authenticated:', this.currentUser);
        } else {
          console.log('User logged out');
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
  header {
    background-color: #333;
    padding: 1rem;
    color: white;
  }
  nav ul {
    list-style-type: none;
    padding: 0;
  }
  nav ul li {
    display: inline;
    margin-right: 20px;
  }
  a {
    color: white;
    text-decoration: none;
    cursor: pointer;
  }
</style> -->


<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/products">Products</router-link></li>
        <li><router-link to="/cart">Cart</router-link></li>
        <template v-if="isAuthenticated">
          <li><router-link to="/checkout">Checkout</router-link></li>
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><a @click.prevent="handleLogout" href="#">Logout</a></li>
        </template>
        <template v-else>
          <li><a @click.prevent="$emit('open-auth-popup')" href="#">Login/Signup</a></li>
        </template>
      </ul>
    </nav>
  </header>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export default {
  name: 'HeaderFrontend',
  emits: ['open-auth-popup'],
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const currentUser = computed(() => authStore.currentUser);

    const handleLogout = async () => {
      console.log('Logout button clicked');
      await authStore.logout();
      console.log('Logout completed, redirecting to home');
      router.push('/');
    };

    return {
      isAuthenticated,
      currentUser,
      handleLogout
    };
  },
  watch: {
    isAuthenticated: {
      handler(newValue) {
        console.log('Authentication status changed:', newValue);
        if (newValue) {
          console.log('User authenticated:', this.currentUser);
        } else {
          console.log('User logged out');
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
header {
  background-color: #333;
  padding: 1rem;
  color: white;
}
nav ul {
  list-style-type: none;
  padding: 0;
}
nav ul li {
  display: inline;
  margin-right: 20px;
}
a {
  color: white;
  text-decoration: none;
  cursor: pointer;
}
</style>