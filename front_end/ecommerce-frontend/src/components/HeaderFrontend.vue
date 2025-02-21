<!-- components/HeaderFrontend.vue -->
<!-- components/HeaderFrontend.vue -->
<template>
  <header class="header">
    <nav class="nav">
      <!-- Logo Section -->
      <router-link to="/" class="logo">
        <img src="@/assets/logo.png" alt="Logo" class="logo-image" />
      </router-link>
      <SearchBar :categories="categories" />
      <div class="nav-links">
        <router-link to="/products" class="products-link" @click.native="resetFilters">Products</router-link>
        <router-link to="/cart" class="cart-link flex items-center space-x-2 px-4 py-2 rounded-md">
          <div class="relative">
            <span 
              v-if="cartItemCount" 
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartItemCount }}
            </span>
            <img src="@/assets/cart-icon.png" alt="Cart" class="cart-icon" />
          </div>
          <span class="cart-text font-medium hide-on-mobile">Cart</span>
        </router-link>
        <template v-if="isAuthenticated">
          <router-link v-if="isSuperAdmin || isAdmin" to="/admin" class="admin-link">
            {{ isSuperAdmin ? 'Superadmin' : 'Admin' }}
          </router-link>
          <div class="user-nav-container" @mouseover="showDropdown = true" @mouseleave="showDropdown = false">
            <div class="user-nav">
              <div class="avatar">
                <template v-if="profilePicUrl">
                  <img 
                    :src="profilePicUrl" 
                    alt="User Avatar" 
                    class="avatar-image"
                  />
                </template>
                <template v-else>
                  <span class="avatar-initials">{{ userInitials }}</span>
                </template>
              </div>
              <span class="username hide-on-mobile">{{ authStore.user.username }}</span>
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
          <div class="user-nav-container">
            <div class="user-nav">
              <div class="avatar">
                <img 
                  :src="guestAvatar" 
                  alt="Guest" 
                  class="avatar-image"
                />
              </div>
              <span class="username hide-on-mobile">Guest</span>
            </div>
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
import { defineComponent, computed, ref, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';
import SearchBar from './SearchBar.vue';
import { useCategoryStore } from '../stores/category';
import { useFilterStore } from '../stores/useFilterStore';
import guestAvatar from '@/assets/guest-avatar.png';

export default defineComponent({
  name: 'HeaderFrontend',
  components: {
    SearchBar,
  },
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const router = useRouter();
    const filterStore = useFilterStore();

    const showDropdown = ref(false);
    const showNotifications = ref(false);
    
    const notifications = ref([
      { id: 1, message: 'Your order has been shipped!', time: '2 hours ago', read: false },
      { id: 2, message: 'New products available', time: '1 day ago', read: true }
    ]);

    // Create a ref for profile picture URL
    const profilePicUrl = ref('');

    // Watch for changes in the user's profile picture
    watch(
      () => authStore.user?.profilePicUrl,
      (newUrl) => {
        if (newUrl) {
          // Add a timestamp query parameter to force refresh
          const separator = newUrl.includes('?') ? '&' : '?';
          profilePicUrl.value = `${newUrl}${separator}t=${Date.now()}`;
        } else {
          profilePicUrl.value = '';
        }
      },
      { immediate: true }
    );

    const unreadNotifications = computed(() => 
      notifications.value.filter(n => !n.read).length
    );

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const isAdmin = computed(() => authStore.isAdmin);
    const isSuperAdmin = computed(() => authStore.isSuperAdmin);
    const cartItemCount = computed(() => cartStore.itemCount);

    const userInitials = computed(() => {
      const name = authStore.user?.username || '';
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

    const categoryStore = useCategoryStore();
    const categories = computed(() => categoryStore.categories);

    const resetFilters = () => {
      filterStore.resetFilters();
      router.push({ path: '/products', query: {} });
    };

    return {
      authStore,
      isAuthenticated,
      isAdmin,
      isSuperAdmin,
      cartItemCount,
      handleLogout,
      userInitials,
      showDropdown,
      showNotifications,
      notifications,
      unreadNotifications,
      toggleNotifications,
      markAllAsRead,
      categories,
      resetFilters,
      guestAvatar,
      profilePicUrl
    };
  }
});
</script>

<!-- Keep your existing styles -->

<style scoped>
.header {
  background-color: #04221F;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 5px;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1650px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #b8be5e;
  /* max-width: 185px; */
  text-decoration: none;
}

.logo-image {
  height: 55px; /* Adjust the height as needed */
  width: auto; /* Maintain aspect ratio */
  min-width: 165px;
  /* margin: auto; */
  margin-left: 20px;
  margin-right: 20px;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-links a {
  color: #ebebeb;
  text-decoration: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover {
  background-color: #214e0f;
}

.products-link{
  margin-left: 10px;
}

.cart-link {
  position: relative;
  padding: 2px 6px;
}


.cart-count {
  position: absolute;
  top: -8px;
  right: 0px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}

.cart-icon {
  max-width: 35px; /* Adjust the size as needed */
  height: 35px; /* Adjust the size as needed */
  vertical-align: middle; /* Align the icon properly */
}


.login-btn, .logout-btn {
  background-color: #3498db;
  color: white !important;
}

.signup-btn {
  background-color: #2ecc71;
  color: white !important;
}

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
  background-color: #04221F;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #a18338;
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
  color: #cea532;
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

.user-nav {
  position: relative;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0px);
  left: 0;
  background-color: hsl(0, 0%, 100%);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 150px;
  z-index: 1000;
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

.notifications {
  position: relative;
  cursor: pointer;
}

.notification-icon {
  position: relative;
  padding: 0.5rem;
  font-size: 1.25rem;
  margin-right: 10px;
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


@media (max-width: 1024px) {
  .hide-on-mobile {
    display: none;
  }
  
  .logo-image {
    height: 50px;
    min-width: 150px;
  }

  .cart-link {
    padding: 0.5rem !important;
  }

  .nav-links {
    gap: 0.5rem;
  }

  .products-link {
    margin-left: 5px;
  }

  .notification-icon {
    margin-right: 5px;
  }

  .avatar {
    width: 28px;
    height: 28px;
  }

  .cart-icon {
    min-width: 32px;
    height: 32px;
  }
}

@media (max-width: 768px) {
  .nav {
    padding: 0.5rem;
  }

  .logo-image {
    height: 40px;
    min-width: 120px;
  }

  .cart-icon {
    min-width: 28px;
    height: 28px;
  }

  .avatar {
    width: 24px;
    height: 24px;
  }

  .avatar-initials {
    font-size: 12px;
  }

  .notification-icon {
    font-size: 1rem;
    padding: 0.25rem;
  }

  .admin-link {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
  }
}


.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #795a36;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-initials {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

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
  background-color: #04221F;
}

.username {
  color: #cea532;
  font-size: 14px;
}
</style>