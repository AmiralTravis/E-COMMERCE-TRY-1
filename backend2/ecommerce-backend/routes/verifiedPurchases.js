const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const verifiedPurchaseController = require('../controllers/verifiedPurchaseController');

router.get('/check/:productId', authenticateToken, verifiedPurchaseController.checkReviewEligibility);

module.exports = router;