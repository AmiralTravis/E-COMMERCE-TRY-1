  <!-- <template>
    <div>
      <h1>Welcome to your Dashboard</h1> -->
      <!-- Display user-specific information here -->
    <!-- </div>
  </template>
  
  <script>
  import api from '../services/api';
  
  export default {
    async mounted() {
      try {
        const response = await api.get('/user'); // Protected route example
        console.log('User data:', response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };
  </script> -->
  
<!-- 
  <template>
    <div>
      <h1>Welcome to your Dashboard</h1> -->
      <!-- Display user-specific information here -->
      <!-- <p v-if="user">Hello, {{ user.username }}!</p>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import api from '../services/api';
  
  export default {
    setup() {
      const authStore = useAuthStore();
      const user = ref(null);
      const error = ref(null);
  
      onMounted(async () => {
        try {
          const response = await api.get('/user'); // Protected route example
          user.value = response.data;
          console.log('User data:', user.value);
        } catch (err) {
          console.error('Error fetching user data:', err);
          error.value = 'Failed to load user data. Please try again later.';
        }
      });
  
      return {
        user,
        error
      };
    }
  };
  </script> -->


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