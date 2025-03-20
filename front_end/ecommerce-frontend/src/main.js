// // src/main.js

// import { createApp } from 'vue';
// import { createPinia } from 'pinia';
// import App from './App.vue';
// import router from './router';
// import api from './services/api';
// import { useAuthStore } from './stores/auth';
// import 'vue-advanced-cropper/dist/style.css';
// // import './main.css'; // Import Tailwind styles
// // import './output.css';
// import './index.css'


// const app = createApp(App);
// const pinia = createPinia();

// app.use(pinia);
// app.use(router);

// // Set up api as a global property
// app.config.globalProperties.$api = api;

// // Initialize auth state
// const authStore = useAuthStore(pinia);

// // Add global navigation guard
// router.beforeEach(async (to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     try {
//       const isAuthenticated = await authStore.checkAuth();
//       if (!isAuthenticated) {
//         next({ 
//           name: 'Login', 
//           query: { redirect: to.fullPath }
//         });
//       } else {
//         next();
//       }
//     } catch (error) {
//       console.error('Navigation guard error:', error);
//       next({ 
//         name: 'Login', 
//         query: { redirect: to.fullPath }
//       });
//     }
//   } else {
//     next();
//   }
// });

// app.mount('#app');


import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import api from './services/api';
import { useAuthStore } from './stores/auth';
// import { createToastifyPlugin } from 'vue3-toastify'; // Import vue3-toastify
// import { toast, createToastifyPlugin } from 'vue3-toastify';
// import 'vue3-toastify/dist/index.css'; // Import toastify styles
import Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'vue-advanced-cropper/dist/style.css'; // Import cropper styles
import './index.css'; // Import your custom styles

// Create the Vue app
const app = createApp(App);
const pinia = createPinia();

// Use Pinia for state management
app.use(pinia);

// Use Vue Router
app.use(router);

// Configure vue3-toastify
// app.use(createToastifyPlugin, {
//   position: 'top-right', // Toast position
//   autoClose: 3000, // Auto-close after 3 seconds
//   hideProgressBar: true, // Hide the progress bar
//   closeOnClick: true, // Close on click
//   pauseOnHover: true, // Pause on hover
//   transition: 'slide', // Transition animation
// });
app.use(Toastify, {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  transition: 'slide',
});

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

// Mount the app
app.mount('#app');