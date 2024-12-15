const express = require('express');
const router = express.Router();
const { client } = require('../paypalClient'); // Import the PayPal client
const paypal = require('@paypal/checkout-server-sdk');
// ------------
const { verifyPaypalOrder } = require('../controllers/paypalController');
const {authenticateToken} = require('../middleware/authMiddleware');

router.post('/verify-order', authenticateToken, verifyPaypalOrder);

// Create PayPal Order
router.post('/create-order', async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");

  // Add order details here
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: '100.00' // Replace with actual order amount
      }
    }]
  });

  try {
    const order = await client().execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating PayPal order');
  }
});

// Capture PayPal Order
router.post('/capture-order', async (req, res) => {
  const { orderID } = req.body;
  const request = new paypal.orders.OrdersCaptureRequest(orderID);

  try {
    const capture = await client().execute(request);
    res.json({ capture });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error capturing PayPal order');
  }
});

module.exports = router;
