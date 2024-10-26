// // routes/reviewRoutes.js
// const express = require('express');
// // const { getReviewsByProduct, addReview, updateReview, deleteReview } = require('../controllers/reviewController');
// const { authenticateToken, isAdmin } = require('../middleware/authMiddleware'); // Adjust paths as necessary
// const reviewController = require('../controllers/reviewController');

// const router = express.Router();

// // Route to get all reviews for a specific product
// // console.log("reached reviewroutes file..")
// router.get('/:productId/reviews', reviewController.getReviewsByProduct); // Fetch reviews by product ID
// // console.log("didnt read through this, bcz got passed away from routes")

// router.use(authenticateToken);
// // Route to add a review to a product
// // router.post('/:productId/reviews', authenticateToken, addReview); // Add review for specific product

// router.use(isAdmin);
// // Route to update a review
// // router.put('/:id', authenticateToken, isAdmin, updateReview); // Update review by review ID

// // Route to delete a review
// // router.delete('/:id', authenticateToken, isAdmin, deleteReview); // Delete review by review ID

// module.exports = router;

// // routes/reviewRoutes.js
// const express = require('express');
// const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
// const reviewController = require('../controllers/reviewController');

// const router = express.Router();

// // Public route - should be defined BEFORE any middleware
// router.get('/:productId/reviews', reviewController.getReviewsByProduct);

// // Protected routes - require authentication
// router.post('/:productId/reviews', authenticateToken, reviewController.addReview);

// // Admin routes - require both authentication and admin privileges
// router.put('/:id', authenticateToken, isAdmin, reviewController.updateReview);
// router.delete('/:id', authenticateToken, isAdmin, reviewController.deleteReview);

// module.exports = router;

const express = require('express');
const router = express.Router({ mergeParams: true }); // Add mergeParams: true
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

// Public route
router.get('/', reviewController.getReviewsByProduct);

// Protected routes
router.post('/', authenticateToken, reviewController.addReview);
router.put('/:id', authenticateToken, isAdmin, reviewController.updateReview);
router.delete('/:id', authenticateToken, isAdmin, reviewController.deleteReview);

module.exports = router;