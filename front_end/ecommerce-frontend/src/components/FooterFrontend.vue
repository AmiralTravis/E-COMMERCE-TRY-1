<!-- <template>
    <footer>
      <p>&copy; 2024 E-commerce Platform. All rights reserved.</p>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'FooterFrontend'
  };
  </script>
  
  <style scoped>
  footer {
    background-color: #333;
    padding: 1rem;
    color: white;
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  </style>
  -->


  <!-- <template>
    <footer>
      <p>&copy; 2024 E-commerce Platform. All rights reserved.</p>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'FooterFrontend'
  };
  </script>
  
  <style scoped>
  footer {
    background-color: #333;
    padding: 1rem;
    color: white;
    text-align: center;
    /* Removed fixed positioning */
    position: relative; /* Ensure it follows the normal document flow */
    width: 100%;
  }
  </style>
   -->



   <template>
    <footer>
      <p>&copy; {{ currentYear }} E-commerce Platform. All rights reserved.</p>
    </footer>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const currentYear = computed(() => new Date().getFullYear());
  </script>
  
  <style scoped>
  footer {
    background-color: #333;
    padding: 1rem;
    color: white;
    text-align: center;
    position: relative;
    width: 100%;
  }
  </style>