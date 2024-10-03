import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/auth.js';

// Import components
import HomeFrontend from '../components/HomeFrontend.vue';
import ProductList from '../views/ProductList.vue';
import ProductDetails from '../views/ProductDetails.vue';
import CartFrontend from '../views/CartFrontend.vue';
import CheckoutFrontend from '../components/CheckoutFrontend.vue';
import SignUp from '../components/SignUp.vue';
import Login from '../components/LogIn.vue';
import Dashboard from '../components/DashboardFrontend.vue'; // Assuming you have a Dashboard component

const routes = [
  { path: '/', name: 'Home', component: HomeFrontend },
  { 
    path: '/products', 
    name: 'ProductList', 
    component: ProductList,
    beforeEnter: (to, from, next) => {
      store.dispatch('products/fetchProducts').then(() => next());
    },
  },
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
    component: Dashboard,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/isAuthenticated']) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;