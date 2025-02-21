// // /routes/captureOrder.js

// const express = require('express');
// const router = express.Router();
// const paypal = require('@paypal/checkout-server-sdk');
// const Order = require('../models/orders.Models'); // Adjust this import based on your Order model location

// // PayPal client configuration (make sure you have this set up)
// const client = () => {
//   return new paypal.core.SandboxEnvironment(YOUR_CLIENT_ID, YOUR_CLIENT_SECRET);
// };

// router.post('/capture-order', async (req, res) => {
//   const { orderID } = req.body;
//   const request = new paypal.orders.OrdersCaptureRequest(orderID);
//   request.requestBody({});

//   try {
//     const capture = await client().execute(request);
//     const shippingDetails = capture.result.purchase_units[0].shipping;
//     const payerEmail = capture.result.payer.email_address;

//     // Prepare order data to save in the database
//     const orderData = {
//       email: payerEmail,
//       fullName: shippingDetails.name.full_name,
//       address: `${shippingDetails.address.address_line_1}, ${shippingDetails.address.admin_area_2}, ${shippingDetails.address.admin_area_1}, ${shippingDetails.address.postal_code}`,
//       country: shippingDetails.address.country_code,
//       total: capture.result.purchase_units[0].amount.value,
//     };

//     // Save orderData to your database (using your Order model)
//     await Order.create(orderData); // Ensure you have this method in your Order model

//     res.json({ capture });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error capturing PayPal order');
//   }
// });

// module.exports = router;



// /routes/captureOrder.js

const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const Order = require('../models/orders.Models'); // Adjust this import based on your Order model location
const Cart = require('../models/cartModels'); // Import your Cart model
const Product = require('../models/productsModels'); // Import your Product model
const { authenticateToken } = require('../middleware/authMiddleware'); // Import your auth middleware

// PayPal client configuration (make sure you have this set up)
const client = () => {
  return new paypal.core.SandboxEnvironment(YOUR_CLIENT_ID, YOUR_CLIENT_SECRET);
};

router.post('/capture-order', authenticateToken, async (req, res) => { // Add auth middleware
  const { orderID } = req.body;
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    // Verify cart belongs to user
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [Product] // Include Product model for potential use later
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }


    const capture = await client().execute(request);
    const shippingDetails = capture.result.purchase_units[0].shipping;
    const payerEmail = capture.result.payer.email_address;
    const purchaseUnits = capture.result.purchase_units; // Capture purchase units

    // Prepare order data to save in the database
    const orderData = {
      userId: req.user.id, // Associate order with user
      email: payerEmail,
      fullName: shippingDetails.name.full_name,
      address: `${shippingDetails.address.address_line_1}, ${shippingDetails.address.admin_area_2}, ${shippingDetails.address.admin_area_1}, ${shippingDetails.address.postal_code}`,
      country: shippingDetails.address.country_code,
      total: purchaseUnits.reduce((sum, unit) => sum + parseFloat(unit.amount.value), 0), // Calculate total from purchase units
      items: cartItems.map(item => ({  // Save cart items with order
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price // Access the product price
      })),
    };

    // Save orderData to your database (using your Order model)
    const order = await Order.create(orderData); // Ensure you have this method in your Order model

    // Clear user's cart after successful payment
    await Cart.destroy({ where: { userId: req.user.id } });

    res.json({ capture, order }); // Include the saved order data in the response

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      error: 'Payment processing failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;