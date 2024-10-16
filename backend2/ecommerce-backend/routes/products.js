// routes/product.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {authenticateToken} = require('../middleware/authMiddleware');
const {isAdmin} = require('../middleware/authMiddleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

// Protected routes - Authenticated users
router.use(authenticateToken);
// Add any authenticated user routes here, e.g., adding a review
// router.post('/:id/reviews', productController.addReview);

// Protected routes - Admin only
router.use(isAdmin);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;