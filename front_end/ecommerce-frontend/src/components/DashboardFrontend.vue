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
  

  <template>
    <div>
      <h1>Welcome to your Dashboard</h1>
      <!-- Display user-specific information here -->
      <p v-if="user">Hello, {{ user.username }}!</p>
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
  </script>