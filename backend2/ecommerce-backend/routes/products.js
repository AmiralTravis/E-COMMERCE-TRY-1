// // // routes/product.js

// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const {authenticateToken, isAdmin} = require('../middleware/authMiddleware');
// const reviewRoutes = require('./reviews');
// const imageRoutes = require('./imageRoutes');


// // Public routes

// // Public routes should come first 
// router.get('/latest', productController.getLatestProducts); // Add this line
// router.get('/top/products', productController.getTopProducts); // Keep this line
// router.get('/', productController.getAllProducts);
// router.get('/search', productController.searchProducts);
// router.use('/:id/images', imageRoutes);

// router.get('/:id', productController.getProductById);
// router.get('/suggestions', productController.getSuggestions);

// // Mount review routes - public GET route will work because of the order
// router.use('/:productId/reviews', reviewRoutes);

// // Protected routes - Authenticated users
// router.use(authenticateToken);
// // Add protected routes here

// // Protected routes - Admin only
// router.use(isAdmin);
// router.post('/', productController.createProduct);
// router.put('/:id', productController.updateProduct);
// router.delete('/:id', productController.deleteProduct);


// router.get('/search', productController.searchProducts);

// module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const reviewRoutes = require('./reviews');
const imageRoutes = require('./imageRoutes');

// PUBLIC ROUTES (Unauthenticated users can access these)
router.get('/latest', productController.getLatestProducts);
router.get('/top/products', productController.getTopProducts);
router.get('/search', productController.searchProducts);
router.get('/', productController.getAllProducts);
router.get('/suggestions', productController.getSuggestions);
router.get('/categories', productController.getAllCategories); // Add this line

router.use('/:id/images', imageRoutes); // Place this before `/:id`
router.get('/:id', productController.getProductById);

// AUTHENTICATED USER ROUTES
router.use(authenticateToken);
router.use('/:productId/reviews', reviewRoutes); // Authenticated users can post reviews

// ADMIN ROUTES (Require both `authenticateToken` and `isAdmin`)
router.use(isAdmin);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
