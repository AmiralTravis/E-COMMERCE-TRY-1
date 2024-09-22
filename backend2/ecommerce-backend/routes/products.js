const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middleware/authMiddleware');

// Get all products (public route)
router.get('/', productController.getAllProducts);

// Get a single product by ID (public route)
router.get('/:id', productController.getProductById);

// Create a new product (Admin only - protected)
router.post('/', authenticateToken, productController.createProduct);

// Update a product by ID (Admin only - protected)
router.put('/:id', authenticateToken, productController.updateProduct);

// Delete a product by ID (Admin only - protected)
router.delete('/:id', authenticateToken, productController.deleteProduct);

module.exports = router;
