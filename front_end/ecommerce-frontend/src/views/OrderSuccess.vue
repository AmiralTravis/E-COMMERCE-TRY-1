<template>
    <div class="order-success">
      <h1>Thank you for your order!</h1>
      <p>Your payment was successful. You will receive a confirmation email shortly.</p>
      <router-link to="/">Return to Home</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'OrderSuccess',
  };
  </script>
  
  <style scoped>
  /* Add any styles for the OrderSuccess page here */
  </style>
  