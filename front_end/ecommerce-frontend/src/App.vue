<template>
  <div id="app">
    <HeaderFrontend />
    <router-view />
    <FooterFrontend />
  </div>
</template>

<script>
import FooterFrontend from './components/FooterFrontend.vue';
import HeaderFrontend from './components/HeaderFrontend.vue';

export default {
  name: 'App',
  components: {
    FooterFrontend,
    HeaderFrontend,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0; /* Ensure there's no margin at the top */
}

header {
  background-color: #f8f9fa; /* Light background color for header */
}

footer {
  background-color: #f8f9fa; /* Light background color for footer */
}
</style>
