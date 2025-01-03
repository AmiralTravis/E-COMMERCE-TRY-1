// routes/reviews.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

// Public routes
router.get('/:productId', reviewController.getReviewsByProduct);
router.get('/:productId/user-review', authenticateToken, reviewController.getUserReview);

// Protected routes
router.post('/:productId', authenticateToken, reviewController.addReview);
router.put('/:id', authenticateToken, reviewController.updateReview);
router.delete('/:id', authenticateToken, reviewController.deleteReview);

module.exports = router;