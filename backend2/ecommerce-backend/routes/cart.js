// ecommerce-backend/routes/cart.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const {authenticateToken} = require('../middleware/authMiddleware'); // Ensure correct import

// Apply authentication middleware to all cart routes
router.use(authenticateToken);

// Get cart for a user
router.get('/', async (req, res) => {
  console.log('Received GET request for cart...');
  try {
    const userId = req.user.id; // Get user ID from the authenticated user
    const cart = await cartController.getCart(req, res, userId); // Pass user ID to the controller
    res.status(200).json(cart); // Ensure you send back the response
  } catch (error) {
    console.error('Error in GET /cart route:', error);
    res.status(500).json({ message: 'An error occurred while fetching the cart' });
  }
});

// Add a product to the cart
router.post('/', async (req, res) => {
  console.log('Received POST request to add item to cart...');
  try {
    const userId = req.user.id; // Get user ID from the authenticated user
    const item = await cartController.addToCart(req, res, userId); // Pass user ID to the controller
    res.status(201).json(item); // Respond with the added item
  } catch (error) {
    console.error('Error in POST /cart route:', error);
    res.status(500).json({ message: 'An error occurred while adding item to the cart' });
  }
});

// Update quantity of a product in the cart
router.put('/:cartItemId', async (req, res) => {
  console.log('Received PUT request to update cart item...');
  try {
    const userId = req.user.id; // Get user ID from the authenticated user
    const cartItemId = req.params.cartItemId; // Get cart item ID from the route parameters
    const updatedItem = await cartController.updateCart(req, res, userId, cartItemId); // Pass user ID and cart item ID
    res.status(200).json(updatedItem); // Respond with the updated item
  } catch (error) {
    console.error('Error in PUT /cart/:cartItemId route:', error);
    res.status(500).json({ message: 'An error occurred while updating the cart item' });
  }
});

// Clear entire cart
router.delete('/', async (req, res) => {
  console.log('Received DELETE request to clear entire cart...');
  await cartController.clearCart(req, res);
});

// Remove an item from the cart
router.delete('/:cartItemId', async (req, res) => {
  console.log('Received DELETE request to remove item from cart...');
  try {
    const userId = req.user.id; // Get user ID from the authenticated user
    const cartItemId = req.params.cartItemId; // Get cart item ID from the route parameters
    await cartController.removeFromCart(req, res, userId, cartItemId); // Pass user ID and cart item ID
    res.status(204).send(); // No content to send back after deletion
  } catch (error) {
    console.error('Error in DELETE /cart/:cartItemId route:', error);
    res.status(500).json({ message: 'An error occurred while removing the item from the cart' });
  }
});


module.exports = router;
