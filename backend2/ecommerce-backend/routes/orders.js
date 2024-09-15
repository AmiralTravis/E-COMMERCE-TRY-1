const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders (Admin only)
router.get('/', orderController.getAllOrders);

// Get a single order by ID
router.get('/:id', orderController.getOrderById);

// Create a new order
router.post('/', orderController.createOrder);

// Update an order by ID
router.put('/:id', orderController.updateOrder);

// Delete an order by ID (Admin only)
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
