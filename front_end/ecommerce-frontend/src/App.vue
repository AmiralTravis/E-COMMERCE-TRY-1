<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <FooterFrontend />
  <HeaderFrontend />
  <ProductList />
  <ProductDetails />
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import FooterFrontend from './components/FooterFrontend.vue';
import HeaderFrontend from './components/HeaderFrontend.vue';
import ProductDetails from './views/ProductDetails.vue';
import ProductList from './views/ProductList.vue';

export default {
  name: 'App',
  components: {
    // HelloWorld,
    FooterFrontend,
    HeaderFrontend,
    ProductList,
    ProductDetails    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
