import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import api from './services/api';

const app = createApp(App);

// Set up axios
app.config.globalProperties.$api = api;

// Initialize auth state
const token = localStorage.getItem('authToken');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  store.commit('auth/SET_AUTH', { 
    token, 
    user: JSON.parse(localStorage.getItem('user') || '{}')
  });
}

// Add global navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/isAuthenticated']) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use(store);
app.use(router);

app.mount('#app');




























// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router';
// import store from './store';
// import axios from 'axios';
// import api from './services/api';

// const app = createApp(App);

// // Set up axios
// app.config.globalProperties.$api = api;

// // Initialize auth state
// store.dispatch('auth/checkAuth');

// // Add global navigation guard
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!store.getters['auth/isAuthenticated']) {
//       next({ name: 'Login' });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

// app.use(store);
// app.use(router);

// app.mount('#app');




// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router';
// import store from './store';
// import api from './services/api';

// const app = createApp(App);

// // Set up axios
// app.config.globalProperties.$api = api;

// // Initialize auth state
// store.dispatch('auth/checkAuth').then(() => {
//   // Add global navigation guard
//   router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//       if (!store.getters['auth/isAuthenticated']) {
//         next({ name: 'Login' });
//       } else {
//         next();
//       }
//     } else {
//       next();
//     }
//   });

//   app.use(store);
//   app.use(router);

//   app.mount('#app');
// });