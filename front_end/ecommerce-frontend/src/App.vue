<!-- <template>
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
</style> -->


<template>
  <div id="app">
    <HeaderFrontend />
    <div class="main-content">
      <router-view />
    </div>
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
/* Ensure the body and html take up the full height */
html, body {
  height: 100%;
  margin: 0;
}

/* Style the root element */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Full viewport height */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0; /* Remove default margin */
}

.main-content {
  flex: 1; /* Take up remaining space */
  padding: 0 20px; /* Add some horizontal padding if needed */
}

header {
  background-color: #f8f9fa; /* Light background color for header */
}

footer {
  background-color: #f8f9fa; /* Light background color for footer */
  height: 60px; /* Adjust height as needed */
  line-height: 60px; /* Center text vertically */
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 10px; /* Adjust padding for smaller screens */
  }
}
</style>
