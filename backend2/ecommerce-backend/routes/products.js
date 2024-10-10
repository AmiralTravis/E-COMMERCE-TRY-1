// routes/product.js

// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const authenticateToken = require('../middleware/authMiddleware');

// // Get all products (public route)
// router.get('/', productController.getAllProducts);

// // Get a single product by ID (public route)
// router.get('/:id', productController.getProductById);

// // Create a new product (Admin only - protected)
// router.post('/', authenticateToken, productController.createProduct);

// // Update a product by ID (Admin only - protected)
// router.put('/:id', authenticateToken, productController.updateProduct);

// // Delete a product by ID (Admin only - protected)
// router.delete('/:id', authenticateToken, productController.deleteProduct);

// module.exports = router;


const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middleware/authMiddleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes - Admin only
router.use(authenticateToken); // Apply authentication middleware only to routes below
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;