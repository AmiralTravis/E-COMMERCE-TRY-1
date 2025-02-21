<!-- views/OrderSuccess.vue -->
<template>
    <div class="order-success">
      <h1>Thank you for your order!</h1>
      <p>Your payment was successful. </p>
      <p>You will receive a confirmation email with a digital copy of receipt shortly.</p>
      <router-link to="/">Return to Home</router-link>
    </div>
  </template>
  
  <!-- <script>

  
  export default {
    name: 'OrderSuccess',
  };
  </script> -->
  
  <script>
import { onMounted } from 'vue';

export default {
  name: 'OrderSuccess',
  setup() {
    onMounted(() => {
      sessionStorage.removeItem('selectedAddress');
    });

    return {}; // You can return any data needed in the template from setup()
  },
};
</script>


  <style scoped>
  /* Add any styles for the OrderSuccess page here */
  </style>
  