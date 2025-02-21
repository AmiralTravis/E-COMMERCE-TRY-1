// // // routes/reviews.js

// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const { authenticateToken } = require('../middleware/authMiddleware');
// const reviewController = require('../controllers/reviewController');

// // Public routes
// router.get('/:productId/top-reviews', reviewController.getTopReviewsByProduct);
// router.get('/:productId', reviewController.getReviewsByProduct);
// // router.get('/:productId/top-reviews', reviewController.getTopReviewsByProduct);

// // Protected routes
// router.get('/:productId/check-eligibility', authenticateToken, reviewController.checkReviewEligibility);
// router.get('/:productId/user-review', authenticateToken, reviewController.getUserReview);
// router.post('/:productId', authenticateToken, reviewController.addReview);
// router.put('/:id', authenticateToken, reviewController.updateReview);
// router.delete('/:id', authenticateToken, reviewController.deleteReview);


// module.exports = router; 

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

// Public routes
// Define the more specific route first
router.get('/top-reviews/:productId', reviewController.getTopReviewsByProduct); // ✅ Corrected route
router.get('/:productId', reviewController.getReviewsByProduct);

// Protected routes
router.get('/:productId/check-eligibility', authenticateToken, reviewController.checkReviewEligibility);
router.get('/:productId/user-review', authenticateToken, reviewController.getUserReview);
router.post('/:productId', authenticateToken, reviewController.addReview);
router.put('/:id', authenticateToken, reviewController.updateReview);
router.delete('/:id', authenticateToken, reviewController.deleteReview);

module.exports = router;