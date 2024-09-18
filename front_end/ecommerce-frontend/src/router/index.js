// // import { createRouter, createWebHistory } from 'vue-router';

// // // Import components that will be linked to each route
// // import HomeFrontend from '../components/HomeFrontend.vue';
// // import ProductList from '../views/ProductList.vue';
// // import ProductDetails from '../views/ProductDetails.vue';
// // import CartFrontend from '../views/CartFrontend.vue';
// // import CheckoutFrontend from '../components/CheckoutFrontend.vue';

// // const routes = [
// //   { path: '/', name: 'Home', component: HomeFrontend },
// //   { path: '/products', name: 'ProductList', component: ProductList },
// //   { path: '/products/:id', name: 'ProductDetails', component: ProductDetails },
// //   { path: '/cart', name: 'Cart', component: CartFrontend },
// //   { path: '/checkout', name: 'Checkout', component: CheckoutFrontend },
// // ];

// // const router = createRouter({
// //   history: createWebHistory(),
// //   routes,
// // });

// // export default router;


// import { createRouter, createWebHistory } from 'vue-router';

// // Import components that will be linked to each route
// import HomeFrontend from '../components/HomeFrontend.vue';
// import ProductList from '../views/ProductList.vue';
// import ProductDetails from '../views/ProductDetails.vue';
// import CartFrontend from '../views/CartFrontend.vue';
// import CheckoutFrontend from '../components/CheckoutFrontend.vue';
// import SignUp from '../components/SignUp.vue'; // Import the new SignUp component

// const routes = [
//   { path: '/', name: 'Home', component: HomeFrontend },
//   { path: '/products', name: 'ProductList', component: ProductList },
//   { path: '/products/:id', name: 'ProductDetails', component: ProductDetails },
//   { path: '/cart', name: 'Cart', component: CartFrontend },
//   { path: '/checkout', name: 'Checkout', component: CheckoutFrontend },
//   { path: '/signup', name: 'SignUp', component: SignUp }, // Add route for SignUp
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// export default router;


// import { createRouter, createWebHistory } from 'vue-router';

// // Import components that will be linked to each route
// import HomeFrontend from '../components/HomeFrontend.vue';
// import ProductList from '../views/ProductList.vue';
// import ProductDetails from '../views/ProductDetails.vue';
// import CartFrontend from '../views/CartFrontend.vue';
// import CheckoutFrontend from '../components/CheckoutFrontend.vue';
// import SignUp from '../components/SignUp.vue'; // <-- Import the SignUp component

// const routes = [
//   { path: '/', name: 'Home', component: HomeFrontend },
//   { path: '/products', name: 'ProductList', component: ProductList },
//   { path: '/products/:id', name: 'ProductDetails', component: ProductDetails },
//   { path: '/cart', name: 'Cart', component: CartFrontend },
//   { path: '/checkout', name: 'Checkout', component: CheckoutFrontend },
//   { path: '/signup', name: 'SignUp', component: SignUp }, // <-- Add the signup route
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// export default router;


import { createRouter, createWebHistory } from 'vue-router';

// Import components that will be linked to each route
import HomeFrontend from '../components/HomeFrontend.vue';
import ProductList from '../views/ProductList.vue';
import ProductDetails from '../views/ProductDetails.vue';
import CartFrontend from '../views/CartFrontend.vue';
import CheckoutFrontend from '../components/CheckoutFrontend.vue';
import SignUp from '../components/SignUp.vue'; // Import the SignUp component
import Login from '../components/Login.vue'; // Import the Login component

const routes = [
  { path: '/', name: 'Home', component: HomeFrontend },
  { path: '/products', name: 'ProductList', component: ProductList },
  { path: '/products/:id', name: 'ProductDetails', component: ProductDetails },
  { path: '/cart', name: 'Cart', component: CartFrontend },
  { path: '/checkout', name: 'Checkout', component: CheckoutFrontend },
  { path: '/signup', name: 'SignUp', component: SignUp }, // Add the signup route
  { path: '/login', name: 'Login', component: Login }, // Add the login route
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
