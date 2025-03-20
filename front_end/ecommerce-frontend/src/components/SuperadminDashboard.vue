<!-- /components/SuperAdminDashboard.vue -->

<template>
    <div class="superadmin-dashboard">
      <!-- Main Header -->
      <h1 class="text-center text-2xl font-bold my-8 text-gray-800">
        {{ isSuperAdmin ? 'Superadmin' : 'Admin' }} Dashboard
      </h1>
  
      <!-- Navigation Bar -->
      <nav class="dashboard-nav bg-gray-50 rounded-lg p-2 mb-8">
        <router-link 
          to="/admin/manage-admins" 
          class="nav-link flex-1 text-center py-3 text-gray-500 relative z-10 transition-colors duration-300"
          :class="{ 'text-blue-500': $route.path.includes('manage-admins') }"
        >
          Manage Admins
        </router-link>
        <router-link 
          to="/admin/manage-users" 
          class="nav-link flex-1 text-center py-3 text-gray-500 relative z-10 transition-colors duration-300"
          :class="{ 'text-blue-500': $route.path.includes('manage-users') }"
        >
          Manage Users
        </router-link>
        <router-link 
          to="/admin/manage-products" 
          class="nav-link flex-1 text-center py-3 text-gray-500 relative z-10 transition-colors duration-300"
          :class="{ 'text-blue-500': $route.path.includes('manage-products') }"
        >
          Manage Products
        </router-link>
        <router-link 
          to="/admin/manage-orders" 
          class="nav-link flex-1 text-center py-3 text-gray-500 relative z-10 transition-colors duration-300"
          :class="{ 'text-blue-500': $route.path.includes('manage-orders') }"
        >
          Manage Orders
        </router-link>
        <div class="nav-indicator" :style="indicatorStyle"></div>
      </nav>
  
      <!-- Dynamic Content with Transition -->

      <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    </div>
  </template>
  
  <script setup>
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  
  const authStore = useAuthStore();
  const route = useRoute();
  const indicatorStyle = ref({});
  
  const isSuperAdmin = computed(() => {
    return authStore.user?.role === 'superadmin'; // Update based on your role system
  });
  
  // Animation logic for nav indicator
  watch(route, () => {
    const activeIndex = ['manage-admins', 'manage-users', 'manage-products', 'manage-orders']
      .findIndex(path => route.path.includes(path));
    
    indicatorStyle.value = {
      transform: `translateX(${activeIndex * 100}%)`,
      width: '25%'
    };
  }, { immediate: true });
  </script>
  
  <style scoped>
  /* Custom CSS for the sliding animation */
  .dashboard-nav {
    position: relative;
    display: flex;
  }
  
  .nav-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: #3b82f6; /* Tailwind's blue-500 */
    transition: all 0.3s ease;
    z-index: 0;
  }
  
  /* Transition styles for smooth page changes */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>