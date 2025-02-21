// src/main.js

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import api from './services/api';
import { useAuthStore } from './stores/auth';
import 'vue-advanced-cropper/dist/style.css';
// import './main.css'; // Import Tailwind styles
// import './output.css';
import './index.css'


const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Set up api as a global property
app.config.globalProperties.$api = api;

// Initialize auth state
const authStore = useAuthStore(pinia);

// Add global navigation guard
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      const isAuthenticated = await authStore.checkAuth();
      if (!isAuthenticated) {
        next({ 
          name: 'Login', 
          query: { redirect: to.fullPath }
        });
      } else {
        next();
      }
    } catch (error) {
      console.error('Navigation guard error:', error);
      next({ 
        name: 'Login', 
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next();
  }
});

app.mount('#app');
