// routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// User-specific routes BEFORE general routes
// These more specific routes should come first
router.get('/current', orderController.getCurrentUserOrders);
router.get('/history', authenticateToken, orderController.getUserOrderHistory);
router.get('/completed', authenticateToken, orderController.getCompletedOrders);

// Admin-specific routes
// router.get('/admin/user/:userId', authenticateToken, isAdmin, orderController.getOrdersByUser);

// Get all orders (Admin only)
router.get('/', authenticateToken, isAdmin, orderController.getAllOrders);

// Create a new order
router.post('/', authenticateToken, orderController.createOrder);

// Get a single order by ID (authenticated route)
router.get('/:id', authenticateToken, orderController.getOrderById);

// Update an order by ID
router.put('/:id', authenticateToken, orderController.updateOrder);

// Delete an order by ID (Admin only)
router.delete('/:id', authenticateToken, isAdmin, orderController.deleteOrder);

module.exports = router;