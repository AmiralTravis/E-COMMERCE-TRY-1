// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

// import Vue from 'vue';
// import App from './App.vue';
// import router from './router';
// import store from './store'; // Import the Vuex store

// Vue.config.productionTip = false;

// new Vue({
//   router,
//   store, // Add Vuex store here
//   render: (h) => h(App),
// }).$mount('#app');
// ------- we are making changes again to rewrite the code for vue 3-----------


// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Import the Vuex store

const app = createApp(App);

app.use(router);
app.use(store); // Use the Vuex store

app.mount('#app');