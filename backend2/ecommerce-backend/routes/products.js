// // routes/product.js

// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const {authenticateToken} = require('../middleware/authMiddleware');
// const {isAdmin} = require('../middleware/authMiddleware');
// const reviews = require('./reviews')

// // Public routes
// router.get('/', productController.getAllProducts);
// router.get('/search', productController.searchProducts);
// router.get('/:id', productController.getProductById);
// // router.get('/:id/reviews', reviews); // Add this line to route to review routes

// // Protected routes - Authenticated users
// router.use(authenticateToken);
// // Add any authenticated user routes here, e.g., adding a review
// // router.post('/:id/reviews', productController.addReview);

// // Protected routes - Admin only
// router.use(isAdmin);
// router.post('/', productController.createProduct);
// router.put('/:id', productController.updateProduct);
// router.delete('/:id', productController.deleteProduct);

// module.exports = router;
// routes/product.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {authenticateToken, isAdmin} = require('../middleware/authMiddleware');
const reviewRoutes = require('./reviews');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

// Mount review routes - public GET route will work because of the order
router.use('/:productId/reviews', reviewRoutes);

// Protected routes - Authenticated users
router.use(authenticateToken);
// Add protected routes here

// Protected routes - Admin only
router.use(isAdmin);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;