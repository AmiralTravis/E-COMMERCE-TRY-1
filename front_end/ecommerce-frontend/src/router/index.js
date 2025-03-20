// front_end/ecommerce-frontend/src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Import components
import HomeFrontend from '../components/homepage_components/HomeFrontend.vue';
import ProductList from '../views/ProductList.vue';
import ProductDetails from '../views/ProductDetails.vue';
import CartFrontend from '../views/CartFrontend.vue';

import SignUp from '../components/SignUp.vue';
import Login from '../components/LogIn.vue';
import SellerRegistration from '@/components/SellerRegistration.vue';

import OrderSuccess from '../views/OrderSuccess.vue';
import PaymentPage from '@/components/PaymentPage.vue';

import OrderHistory from '../components/OrdersHistory.vue';
import CheckoutWrapper from '@/components/CheckoutWrapper.vue';
import AddressSelection from '@/components/AddressSelection.vue';


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
      searchQuery: route.query.search || '',
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
    path: '/seller-registration',
    name: 'SellerRegistration',
    component: SellerRegistration
  },

  {
    path: '/seller',
    component: () => import('@/components/SellerDashboard.vue'),
    meta: { requiresAuth: true, requiresSeller: true },
    children: [
      {
        path: 'manage-products',
        component: () => import('@/components/Seller/ProductManagement.vue')
      },
      {
        path: 'manage-sales',
        component: () => import('@/components/Seller/SalesManagement.vue')
      },
      {
        path: '',
        redirect: '/seller/manage-sales'
      }
    ]
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
  component: () => import('@/components/SuperadminDashboard.vue'),
  meta: { requiresAuth: true, requiresAdmin: true },
  children: [
    {
      path: 'manage-admins',
      component: () => import('@/components/AdminDashboard.vue'), 
    },
    {
      path: 'manage-users',
      component: () => import('@/components/UserManagement.vue'),
    },
    {
      path: 'manage-products',
      component: () => import('@/components/Admin/ProductsManager.vue'),
    },
    {
      path: 'manage-orders',
      component: () => import('../components/AdminOrderManagament.vue'),
    },
    {
      path: '',
      redirect: '/admin/manage-admins'
    }
  ]
},
  {
    path: '/admin/products/edit/:id',
    component: () => import('@/components/Admin/ProductEdit.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/seller/products/edit/:id',
    component: () => import('@/components/Seller/ProductEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/products/add',
    component: () => import('@/components/Admin/ProductAdd.vue'), 
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/seller/products/add',
    component: () => import('@/components/Seller/ProductAdd.vue'), 
    meta: { requiresAuth: true }
  },

  {
    path: '/payment',
    name: 'PaymentPage',
    component: PaymentPage,
    meta: { requiresAuth: true }
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
  },

  {
    path: '/checkout',
    component: CheckoutWrapper,
    children: [
      { 
        path: '', 
        redirect: 'address' 
      },
      { 
        path: 'address', 
        component: AddressSelection,
        meta: { 
          requiresAuth: true,
          shouldCheckAddress: true 
        }
      },
      { 
        path: 'payment', 
        component: PaymentPage,
        meta: { 
          requiresAuth: true,
          preserveState: true 
        }
      }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/components/ForgotPassword.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/components/ResetPassword.vue')
  },
  
];



const router = createRouter({
  history: createWebHistory(),
  routes 
});





router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If not authenticated, attempt to check auth (may refresh token)
    if (!authStore.isAuthenticated) {
      const isAuthenticated = await authStore.checkAuth();
      if (!isAuthenticated) {
        next({ name: 'Login' });
        return;
      }
    }

    // Check admin privileges if required
    if (to.matched.some(record => record.meta.requiresAdmin) && !authStore.isAdmin) {
      next({ name: 'Home' });
      return;
    }
  }

  next();
});



export default router;