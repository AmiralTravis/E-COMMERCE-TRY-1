<template>
  <header class="header">
    <nav class="nav">
      <router-link to="/" class="logo">E-Shop</router-link>
      <div class="nav-links">
        <router-link to="/products">Products</router-link>
        <router-link to="/cart" class="cart-link">
          Cart
          <span v-if="cartItemCount" class="cart-count">{{ cartItemCount }}</span>
        </router-link>
        <template v-if="isAuthenticated">
          <router-link to="/checkout">Checkout</router-link>
          <router-link to="/dashboard">Dashboard</router-link>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="login-btn">Login</router-link>
          <router-link to="/signup" class="signup-btn">Sign Up</router-link>
        </template>
      </div>
    </nav>
  </header>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'HeaderFrontend',
  setup() {
    const store = useStore();
    const router = useRouter();

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const cartItemCount = computed(() => store.getters['cart/cartItemCount']);

    const handleLogout = async () => {
      await store.dispatch('auth/logout');
      router.push('/');
    };

    return {
      isAuthenticated,
      cartItemCount,
      handleLogout
    };
  }
});
</script>

<style scoped>
.header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover {
  background-color: #f5f5f5;
}

.cart-link {
  position: relative;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}

.login-btn, .logout-btn {
  background-color: #3498db;
  color: white !important;
}

.signup-btn {
  background-color: #2ecc71;
  color: white !important;
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>























<!-- 
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
</style> -->