const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a new payment (checkout process)
router.post('/', paymentController.processPayment);

// Get payment details by ID
router.get('/:id', paymentController.getPaymentDetails);

module.exports = router;
