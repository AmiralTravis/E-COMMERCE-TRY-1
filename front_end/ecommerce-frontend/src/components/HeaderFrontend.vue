<!-- components/HeaderFrontend.vue-->
<template>
  <header class="header">
    <nav class="nav">
      <router-link to="/" class="logo">E-Shop</router-link>
      <!-- <SearchBar /> Add this line -->
      <div class="nav-links">
        <router-link to="/products">Products</router-link>
        <router-link to="/cart" class="cart-link">
          Cart
          <span v-if="cartItemCount" class="cart-count">{{ cartItemCount }}</span>
        </router-link>
        <template v-if="isAuthenticated">
          <router-link v-if="isSuperAdmin || isAdmin" to="/admin">
            {{ isSuperAdmin ? 'Superadmin' : 'Admin' }} Dashboard
          </router-link>
          <div class="user-nav-container" @mouseover="showDropdown = true" @mouseleave="showDropdown = false">
            <div class="user-nav">
              <div class="avatar">
                <span class="avatar-initials">{{ userInitials }}</span>
              </div>
              <span class="username">{{ username }}</span>
            </div>
            <!-- Dropdown Menu -->
            <div v-show="showDropdown" class="dropdown-menu">
              <router-link to="/profile" class="dropdown-item">
                <span class="icon">👤</span> My Profile
              </router-link>
              <router-link to="/orders" class="dropdown-item">
                <span class="icon">📦</span> Orders
              </router-link>
              <router-link to="/wishlist" class="dropdown-item">
                <span class="icon">❤️</span> Wishlist
              </router-link>
              <button @click="handleLogout" class="dropdown-item logout-item">
                <span class="icon">🚪</span> Logout
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="user-nav">
            <div class="avatar">
              <span class="avatar-initials">G</span>
            </div>
            <span class="username">Guest</span>
          </div>
          <router-link to="/login" class="login-btn">Login</router-link>
        </template>
        <!-- Notifications Button -->
        <div class="notifications" @click="toggleNotifications">
          <div class="notification-icon">
            🔔
            <span v-if="unreadNotifications" class="notification-badge">
              {{ unreadNotifications }}
            </span>
          </div>
          <!-- Notifications Dropdown -->
          <div v-show="showNotifications" class="notifications-dropdown">
            <div class="notifications-header">
              <h3>Notifications</h3>
              <button @click="markAllAsRead" class="mark-read-btn">Mark all as read</button>
            </div>
            <div class="notifications-list">
              <div v-if="!notifications.length" class="no-notifications">
                No new notifications
              </div>
              <div v-else v-for="notification in notifications" 
                   :key="notification.id" 
                   :class="['notification-item', { unread: !notification.read }]">
                {{ notification.message }}
                <span class="notification-time">{{ notification.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
// import SearchBar from './SearchBar.vue';
import { defineComponent, computed, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'HeaderFrontend',
  components: {
    // SearchBar, // Include the SearchBar component
  },
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const router = useRouter();

    const showDropdown = ref(false);
    const showNotifications = ref(false);
    
    // Mock notifications data - replace with your actual notifications system
    const notifications = ref([
      { id: 1, message: 'Your order has been shipped!', time: '2 hours ago', read: false },
      { id: 2, message: 'New products available', time: '1 day ago', read: true }
    ]);

    const unreadNotifications = computed(() => 
      notifications.value.filter(n => !n.read).length
    );

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const isAdmin = computed(() => authStore.isAdmin);
    const isSuperAdmin = computed(() => authStore.isSuperAdmin);
    const cartItemCount = computed(() => cartStore.itemCount);
    const username = computed(() => authStore.user?.username || '');
    const userInitials = computed(() => {
      const name = username.value;
      return name ? name.charAt(0).toUpperCase() : '';
    });

    const handleLogout = async () => {
      showDropdown.value = false;
      authStore.logout();
      router.push('/');
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const markAllAsRead = () => {
      notifications.value = notifications.value.map(n => ({ ...n, read: true }));
    };

    return {
      isAuthenticated,
      isAdmin,
      isSuperAdmin,
      cartItemCount,
      handleLogout,
      username,
      userInitials,
      showDropdown,
      showNotifications,
      notifications,
      unreadNotifications,
      toggleNotifications,
      markAllAsRead
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

/* New styles for user navigation */
.user-nav-container {
  position: relative;
  cursor: pointer;
}

.user-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: #ffffff;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initials {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.username {
  color: #333;
  font-size: 14px;
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

/* New styles for dropdown menu */
.user-nav {
  position: relative;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0px); /* Position it right below with minimal gap */
  left: 0; /* Align with the left edge of user-nav */
  background-color: hsl(0, 0%, 100%);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 200px;
  z-index: 1000;
  /* Remove margin-top since we're using calc() for positioning */
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.icon {
  margin-right: 0.5rem;
}

.logout-item {
  border-top: 1px solid #eee;
  color: #e74c3c;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

/* Notifications styles */
.notifications {
  position: relative;
  cursor: pointer;
}

.notification-icon {
  position: relative;
  padding: 0.5rem;
  font-size: 1.25rem;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  min-width: 20px;
  text-align: center;
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 300px;
  margin-top: 0.5rem;
  z-index: 1000;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.notifications-header h3 {
  margin: 0;
  font-size: 1rem;
}

.mark-read-btn {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 0.875rem;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background-color: white;
  transition: background-color 0.2s;
}

.notification-item.unread {
  background-color: #f8f9fa;
}

.notification-item:hover {
  background-color: #f5f5f5;
}

.notification-time {
  display: block;
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
}

.no-notifications {
  padding: 1rem;
  text-align: center;
  color: #666;
}
</style>