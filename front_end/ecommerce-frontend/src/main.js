


























// import { createApp } from 'vue';
// import { createPinia } from 'pinia';
// import App from './App.vue';
// import router from './router';
// import axios from 'axios';
// import api from './services/api';
// import { useAuthStore } from './stores/auth';

// const app = createApp(App);
// const pinia = createPinia();

// app.use(pinia);
// app.use(router);

// // Set up axios
// app.config.globalProperties.$api = api;

// // Initialize auth state
// const authStore = useAuthStore();
// const token = localStorage.getItem('authToken');
// if (token) {
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   authStore.setAuth({ 
//     token, 
//     user: JSON.parse(localStorage.getItem('user') || '{}')
//   });
// }

// // Add global navigation guard
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!authStore.isAuthenticated) {
//       next({ name: 'Login' });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

// app.mount('#app');



// import { createApp } from 'vue';
// import { createPinia } from 'pinia';
// import App from './App.vue';
// import router from './router';
// import axios from 'axios';
// import api from './services/api';
// import { useAuthStore } from './stores/auth';

// const app = createApp(App);
// const pinia = createPinia();

// app.use(pinia);
// app.use(router);

// // Set up axios
// app.config.globalProperties.$api = api;

// // Initialize auth state
// const authStore = useAuthStore(pinia);
// const token = localStorage.getItem('authToken');
// if (token) {
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   authStore.setAuth({ 
//     token, 
//     user: JSON.parse(localStorage.getItem('user') || '{}')
//   });
// }

// // Add global navigation guard
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!authStore.isAuthenticated) {
//       next({ name: 'Login' });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

// app.mount('#app');









// import { createApp } from 'vue'
// import Test from './Test.vue'

// createApp(Test).mount('#app')







import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import api from './services/api';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Set up axios
app.config.globalProperties.$api = api;

// Initialize auth state
const authStore = useAuthStore(pinia);
const token = localStorage.getItem('authToken');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  authStore.setAuth({ 
    token, 
    user: JSON.parse(localStorage.getItem('user') || '{}')
  });
}

// Add global navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

app.mount('#app');