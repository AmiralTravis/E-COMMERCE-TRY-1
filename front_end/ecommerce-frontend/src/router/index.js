// front_end/ecommerce-frontend/src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Import components
import HomeFrontend from '../components/HomeFrontend.vue';
import ProductList from '../views/ProductList.vue';
import ProductDetails from '../views/ProductDetails.vue';
import CartFrontend from '../views/CartFrontend.vue';
import CheckoutFrontend from '../components/CheckoutFrontend.vue';
import SignUp from '../components/SignUp.vue';
import Login from '../components/LogIn.vue';
import DashboardFrontend from '../components/DashboardFrontend.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeFrontend },
  { path: '/products', name: 'ProductList', component: ProductList },
  { path: '/products/:id', name: 'ProductDetails', component: ProductDetails },
  { path: '/cart', name: 'Cart', component: CartFrontend },
  { 
    path: '/checkout', 
    name: 'Checkout', 
    component: CheckoutFrontend,
    meta: { requiresAuth: true }
  },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/login', name: 'Login', component: Login },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: DashboardFrontend,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add a global navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If not authenticated, redirect to Login page
    if (!authStore.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
    } else {
      // Verify user token if authenticated
      try {
        await authStore.verifyUser(); // Ensure you have this method in your store
        next();
      } catch (error) {
        // If verification fails, redirect to Login page
        authStore.clearAuth(); // Clear any stale auth state
        next({ name: 'Login', query: { redirect: to.fullPath } });
      }
    }
  } else {
    next();
  }
});

export default router;
