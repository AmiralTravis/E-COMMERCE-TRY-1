const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get cart for a user
router.get('/:userId', cartController.getCart);

// Add a product to the cart
router.post('/:userId', cartController.addToCart);

// Update quantity of a product in the cart
router.put('/:userId/:productId', cartController.updateCart);

// Remove a product from the cart
router.delete('/:userId/:productId', cartController.removeFromCart);

module.exports = router;
