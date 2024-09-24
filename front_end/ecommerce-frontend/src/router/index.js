// import { createRouter, createWebHistory } from 'vue-router';

// // Import components that will be linked to each route
// import HomeFrontend from '../components/HomeFrontend.vue';
// import ProductList from '../views/ProductList.vue';
// import ProductDetails from '../views/ProductDetails.vue';
// import CartFrontend from '../views/CartFrontend.vue';
// import CheckoutFrontend from '../components/CheckoutFrontend.vue';
// import SignUp from '../components/SignUp.vue'; // Import the SignUp component
// import Login from '../components/LogIn.vue'; // Import the Login component

// const routes = [
//   { path: '/', name: 'Home', component: HomeFrontend },
//   { path: '/products', name: 'ProductList', component: ProductList },
//   { path: '/products/:id', name: 'ProductDetails', component: ProductDetails },
//   { path: '/cart', name: 'Cart', component: CartFrontend },
//   { path: '/checkout', name: 'Checkout', component: CheckoutFrontend },
//   { path: '/signup', name: 'SignUp', component: SignUp }, // Add the signup route
//   { path: '/login', name: 'Login', component: Login }, // Add the login route
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// export default router;


import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/index.js'; // Updated path to store

// Import components that will be linked to each route
import HomeFrontend from '../components/HomeFrontend.vue';
import ProductList from '../views/ProductList.vue';
import ProductDetails from '../views/ProductDetails.vue';
import CartFrontend from '../views/CartFrontend.vue';
import CheckoutFrontend from '../components/CheckoutFrontend.vue';
import SignUp from '../components/SignUp.vue';
import Login from '../components/LogIn.vue';

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
  { path: '/checkout', name: 'Checkout', component: CheckoutFrontend },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/login', name: 'Login', component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;