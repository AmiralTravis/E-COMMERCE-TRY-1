const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// Get all items in a user's wishlist
router.get('/:userId', wishlistController.getWishlists); // Fixed name

// Add an item to the wishlist
router.post('/:userId', wishlistController.addToWishlist);

// Remove an item from the wishlist
router.delete('/:userId/:productId', wishlistController.removeFromWishlist);

module.exports = router;
