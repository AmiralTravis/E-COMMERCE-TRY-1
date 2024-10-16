// // front_end/ecommerce-frontend/src/router/index.js

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
import AdminDashboard from '../components/AdminDashboard.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeFrontend },
  { path: '/products', name: 'Products', component: ProductList },
  { path: '/products/:id', name: 'ProductDetails', component: ProductDetails },
  { path: '/cart', name: 'Cart', component: CartFrontend },
  { path: '/checkout', name: 'Checkout', component: CheckoutFrontend, meta: { requiresAuth: true } },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: DashboardFrontend, meta: { requiresAuth: true } },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }, // Admin role required
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Check if the user is authenticated
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    next({ name: 'Login' });
    return;
  }

  // Check if the user has admin privileges
  if (to.matched.some(record => record.meta.requiresAdmin) && !authStore.isAdmin) {
    next({ name: 'Home' });
    return;
  }

  next();
});

export default router;
