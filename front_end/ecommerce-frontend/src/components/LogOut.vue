   <!-- <template>
    <button @click="logout">Log Out</button>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        this.$store.dispatch('auth/logout');
        this.$router.push('/login');
      }
    }
  };
  </script> -->
<!-- 

  <template>
    <button @click="logout">Log Out</button>
  </template>
  
  <script>
  import { nextTick } from 'vue';
  
  export default {
    methods: {
      async logout() {
        await this.$store.dispatch('auth/logout');
        // Force a re-render of the entire app
        await nextTick();
        this.$router.push('/login');
      }
    }
  };
  </script> -->


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
  </script>