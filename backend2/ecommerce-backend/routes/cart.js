// // ecommerce-backend/routes/cart.js

// const express = require('express');
// const router = express.Router();
// const cartController = require('../controllers/cartController');
// const authenticateToken = require('../middleware/authMiddleware');

// // Apply authentication middleware to all cart routes
// router.use(authenticateToken);

// // Get cart for a user
// router.get('/', async (req, res) => {
//   console.log('Received GET request for cart...');
//   try {
//     await cartController.getCart(req, res);
//   } catch (error) {
//     console.error('Error in GET /cart route:', error);
//     res.status(500).json({ message: 'An error occurred while fetching the cart' });
//   }
// });

// // Add a product to the cart
// router.post('/', async (req, res) => {
//   console.log('Received POST request to add item to cart...');
//   try {
//     await cartController.addToCart(req, res);
//   } catch (error) {
//     console.error('Error in POST /cart route:', error);
//     res.status(500).json({ message: 'An error occurred while adding item to the cart' });
//   }
// });

// // Update quantity of a product in the cart
// router.put('/:productId', async (req, res) => {
//   console.log('Received PUT request to update cart item...');
//   try {
//     await cartController.updateCart(req, res);
//   } catch (error) {
//     console.error('Error in PUT /cart/:productId route:', error);
//     res.status(500).json({ message: 'An error occurred while updating the cart item' });
//   }
// });

// // Remove a product from the cart
// router.delete('/:productId', async (req, res) => {
//   console.log('Received DELETE request to remove item from cart...');
//   try {
//     await cartController.removeFromCart(req, res);
//   } catch (error) {
//     console.error('Error in DELETE /cart/:productId route:', error);
//     res.status(500).json({ message: 'An error occurred while removing the item from the cart' });
//   }
// });

// module.exports = router;

// ecommerce-backend/routes/cart.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/authMiddleware');

// Apply authentication middleware to all cart routes
router.use(authenticateToken);

// Get cart for a user
router.get('/', async (req, res) => {
  console.log('Received GET request for cart...');
  try {
    const userId = req.user.id; // Get user ID from the authenticated user
    await cartController.getCart(req, res, userId); // Pass user ID to the controller
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
    await cartController.addToCart(req, res, userId); // Pass user ID to the controller
  } catch (error) {
    console.error('Error in POST /cart route:', error);
    res.status(500).json({ message: 'An error occurred while adding item to the cart' });
  }
});

// Update quantity of a product in the cart
router.put('/:productId', async (req, res) => {
  console.log('Received PUT request to update cart item...');
  try {
    const userId = req.user.id; // Get user ID from the authenticated user
    await cartController.updateCart(req, res, userId); // Pass user ID to the controller
  } catch (error) {
    console.error('Error in PUT /cart/:productId route:', error);
    res.status(500).json({ message: 'An error occurred while updating the cart item' });
  }
});

// Remove a product from the cart
router.delete('/:productId', async (req, res) => {
  console.log('Received DELETE request to remove item from cart...');
  try {
    const userId = req.user.id; // Get user ID from the authenticated user
    await cartController.removeFromCart(req, res, userId); // Pass user ID to the controller
  } catch (error) {
    console.error('Error in DELETE /cart/:productId route:', error);
    res.status(500).json({ message: 'An error occurred while removing the item from the cart' });
  }
});

module.exports = router;
