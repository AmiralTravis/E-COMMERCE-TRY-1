// // routes/product.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {authenticateToken, isAdmin} = require('../middleware/authMiddleware');
const reviewRoutes = require('./reviews');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);
router.get('/suggestions', productController.getSuggestions);

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


router.get('/search', productController.searchProducts);

module.exports = router;