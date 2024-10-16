<!-- components/HeaderFrontend.vue-->

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
          <router-link v-if="isAdmin" to="/admin">Admin Dashboard</router-link> <!-- Admin link added -->
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
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart'; // You'll need to create this
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'HeaderFrontend',
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const router = useRouter();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const isAdmin = computed(() => authStore.isAdmin); // Admin check added
    const cartItemCount = computed(() => cartStore.itemCount);

    const handleLogout = async () => {
      authStore.logout();
      router.push('/');
    };

    return {
      isAuthenticated,
      isAdmin, // Admin check returned
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
