// captureOrder.js

const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const Order = require('../models/orders.Models'); // Adjust this import based on your Order model location

// PayPal client configuration (make sure you have this set up)
const client = () => {
  return new paypal.core.SandboxEnvironment(YOUR_CLIENT_ID, YOUR_CLIENT_SECRET);
};

router.post('/capture-order', async (req, res) => {
  const { orderID } = req.body;
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client().execute(request);
    const shippingDetails = capture.result.purchase_units[0].shipping;
    const payerEmail = capture.result.payer.email_address;

    // Prepare order data to save in the database
    const orderData = {
      email: payerEmail,
      fullName: shippingDetails.name.full_name,
      address: `${shippingDetails.address.address_line_1}, ${shippingDetails.address.admin_area_2}, ${shippingDetails.address.admin_area_1}, ${shippingDetails.address.postal_code}`,
      country: shippingDetails.address.country_code,
      total: capture.result.purchase_units[0].amount.value,
    };

    // Save orderData to your database (using your Order model)
    await Order.create(orderData); // Ensure you have this method in your Order model

    res.json({ capture });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error capturing PayPal order');
  }
});

module.exports = router;
