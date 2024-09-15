import { createRouter, createWebHistory } from 'vue-router';

// Import components that will be linked to each route
import HomeFrontend from '../components/HomeFrontend.vue';
import ProductList from '../views/ProductList.vue';
import ProductDetails from '../views/ProductDetails.vue';
import CartFrontend from '../views/CartFrontend.vue';
import CheckoutFrontend from '../components/CheckoutFrontend.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeFrontend },
  { path: '/products', name: 'ProductList', component: ProductList },
  { path: '/products/:id', name: 'ProductDetails', component: ProductDetails },
  { path: '/cart', name: 'Cart', component: CartFrontend },
  { path: '/checkout', name: 'Checkout', component: CheckoutFrontend },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
