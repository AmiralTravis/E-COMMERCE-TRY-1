const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Get all reviews for a product
router.get('/product/:productId', reviewController.getReviewsByProduct);

// Add a review to a product
router.post('/product/:productId', reviewController.addReview);

// Update a review by ID
router.put('/:id', reviewController.updateReview);

// Delete a review by ID
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
