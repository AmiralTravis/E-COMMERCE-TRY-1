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
import AdminDashboard from '../components/AdminDashboard.vue';
import OrderSuccess from '../views/OrderSuccess.vue';
import PaymentPage from '@/components/PaymentPage.vue';
import AdminOrderManagement from '../components/AdminOrderManagament.vue';
import OrderHistory from '../components/OrdersHistory.vue';

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: HomeFrontend 
  },
  { 
    path: '/products', 
    name: 'Products', 
    component: ProductList,
    props: (route) => ({
      searchQuery: route.query.search,
      filters: {
        categories: route.query.categories 
          ? route.query.categories.split(',').map(Number) 
          : [],
        minPrice: route.query.minPrice,
        maxPrice: route.query.maxPrice,
        minRating: route.query.minRating
      }
    })
  },
  { 
    path: '/products/:id', 
    name: 'ProductDetails', 
    component: ProductDetails 
  },
  { 
    path: '/cart', 
    name: 'Cart', 
    component: CartFrontend 
  },
  { 
    path: '/checkout', 
    name: 'Checkout', 
    component: CheckoutFrontend, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/signup', 
    name: 'SignUp', 
    component: SignUp 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login 
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: DashboardFrontend, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/profile', 
    component: () => import('@/components/UserProfile.vue')
  },
  { 
    path: '/orders', 
    component: () => import('@/components/OrdersPage.vue')
  },
  { 
    path: '/wishlist', 
    component: () => import('@/components/WishlistPage.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/payment',
    name: 'PaymentPage',
    component: PaymentPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrderManagement',
    component: AdminOrderManagement,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/order-history',
    component: OrderHistory,
    // meta: { requiresAuth: true }
  },
  { 
    path: '/order-success', 
    name: 'OrderSuccess', 
    component: OrderSuccess 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes // Use the routes array we defined above
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