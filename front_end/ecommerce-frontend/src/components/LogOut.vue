<template>
    <button @click="logout">Log Out</button>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        localStorage.removeItem('authToken'); // Clear the token
        this.$router.push('/login'); // Redirect to login page
      }
    }
  };
  </script>
  