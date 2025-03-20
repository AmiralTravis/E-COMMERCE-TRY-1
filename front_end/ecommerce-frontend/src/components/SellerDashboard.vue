<template>
    <div class="seller-dashboard">
      <h1 class="text-center text-2xl font-bold my-8">Seller Dashboard</h1>
      
      <nav class="dashboard-nav">
        <router-link 
          to="/seller/manage-sales" 
          class="nav-link"
          :class="{ 'active': $route.path.includes('manage-sales') }"
        >
          Sales Management
        </router-link>
        <router-link 
          to="/seller/manage-products" 
          class="nav-link"
          :class="{ 'active': $route.path.includes('products') }"
        >
          Product Management
        </router-link>
      </nav>
  
      <router-view></router-view>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/stores/auth';
  const authStore = useAuthStore();
  </script>
  
  <style scoped>
  .dashboard-nav {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    color: #4a5568;
    transition: all 0.3s ease;
  }
  
  .nav-link.active {
    background-color: #3b82f6;
    color: white;
  }
  
  .nav-link:hover:not(.active) {
    background-color: #f0f4f8;
  }
  </style>