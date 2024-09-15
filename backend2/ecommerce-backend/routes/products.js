const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getAllProducts);

// Get a single product by ID
router.get('/:id', productController.getProductById);

// Create a new product (Admin only)
router.post('/', productController.createProduct);

// Update a product by ID (Admin only)
router.put('/:id', productController.updateProduct);

// Delete a product by ID (Admin only)
router.delete('/:id', productController.deleteProduct);

module.exports = router;