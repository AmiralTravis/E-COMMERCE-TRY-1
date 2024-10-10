  <!-- LogOut.vue
  <template>
    <button @click="logout">Log Out</button>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const logout = async () => {
    await authStore.logout();
    router.push('/login');
  };
  </script> -->

  <!-- src/components/LogOut.vue -->

<template>
  <button @click="logout" :disabled="isLoading">
    {{ isLoading ? 'Logging out...' : 'Log Out' }}
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);

const logout = async () => {
  isLoading.value = true;
  try {
    await authStore.logout();
    router.push('/login'); // Redirect to the login page
  } catch (error) {
    console.error('Logout error:', error);
    // Optionally, you could show an error message here
  } finally {
    isLoading.value = false;
  }
};
</script>
