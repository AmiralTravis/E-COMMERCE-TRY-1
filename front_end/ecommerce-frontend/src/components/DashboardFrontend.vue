<!-- components/DashboardFrontend.vue -->
  <template>
    <div class="dashboard">
      <h1>Welcome to your Dashboard</h1>
      <div v-if="loading">Loading user data...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <p>Username: {{ userData.username }}</p>
        <p>Email: {{ userData.email }}</p>
        <!-- Add more user-specific information here -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '../stores/auth';
  
  const authStore = useAuthStore();
  const userData = ref({});
  const loading = ref(true);
  const error = ref(null);
  
  onMounted(async () => {
    try {
      userData.value = await authStore.fetchUserData();
    } catch (err) {
      error.value = 'Failed to load user data. Please try again later.';
    } finally {
      loading.value = false;
    }
  });
  </script>
  
  <style scoped>
  .dashboard {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  </style>