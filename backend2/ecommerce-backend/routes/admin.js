// const express = require('express');
// const router = express.Router();
// const adminController = require('../controllers/adminController');

// // Admin login
// router.post('/login', adminController.login);

// // Get all users (Admin only)
// router.get('/users', adminController.getAllUsers);

// // Get all orders (Admin only)
// router.get('/orders', adminController.getAllOrders);

// // Get all products (Admin only)
// router.get('/products', adminController.getAllProducts);

// module.exports = router;


const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin login
router.post('/login', adminController.login);

// Get all users (Admin only)
router.get('/users', adminController.getAllUsers);

// Get all orders (Admin only)
router.get('/orders', adminController.getAllOrders);

// Get all products (Admin only)
router.get('/products', adminController.getAllProducts);

// Get all categories (Admin only)
router.get('/categories', adminController.getAllCategories);

// Get all reviews (Admin only)
router.get('/reviews', adminController.getAllReviews);

module.exports = router;
