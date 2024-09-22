<!-- <template>
    <div>
      <h1>Welcome to your Dashboard</h1> -->
      <!-- Display user-specific information here -->
    <!-- </div>
  </template>
  
  <script>
  export default {
    mounted() {
      // Fetch user data or protected resources here
    }
  };
  </script> -->
  

  <template>
    <div>
      <h1>Welcome to your Dashboard</h1>
      <!-- Display user-specific information here -->
    </div>
  </template>
  
  <script>
  import api from '../services/api';
  
  export default {
    async mounted() {
      try {
        const response = await api.get('/api/user'); // Protected route example
        console.log('User data:', response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };
  </script>
  