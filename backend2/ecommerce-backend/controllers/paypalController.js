// controllers/paypalController.js
const paypalClient = require('../paypalClient');
const { Order, User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const ReceiptService = require('../services/receiptService');

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Initialize Receipt Service
const receiptService = new ReceiptService(transporter);

async function verifyPaypalOrder(req, res) {
  console.log("Entering verifyPaypalOrder func...");
  console.log("Received Request Body:", req.body);
  console.log("User:", req.user); // Verify user information

  try {
    const { orderId, totalAmount } = req.body;

    console.log(`Attempting to verify order: ${orderId}`);
    console.log(`Total Amount: ${totalAmount}`);

    // 1. Get pending order
    const pendingOrder = await Order.findOne({
      where: { 
        userId: req.user.id,
        status: 'Pending'
      }
    });

    if (!pendingOrder) {
      return res.status(404).json({ error: 'No pending order found' });
    }

    // 2. Verify PayPal order
    const request = new paypalClient.orders.OrdersGetRequest(orderId);
    const paypalOrder = await paypalClient.client().execute(request);

    // 3. Validate PayPal response
    if (paypalOrder.result.status !== 'COMPLETED') {
      console.error(`validate paypal respomse error: ${paypalOrder.result.status}`);
      return res.status(400).json({ error: 'Payment not completed' });
      
    }

    // 4. Verify amount matches
    const paypalAmount = parseFloat(paypalOrder.result.purchase_units[0].amount.value);
    if (Math.abs(paypalAmount - pendingOrder.totalAmount) > 0.01) {
      console.error(`Payment amount mismatch: PayPal amount = ${paypalAmount}, Expected = ${pendingOrder.totalAmount}`);
      return res.status(400).json({ error: 'Payment amount mismatch' });
    }

    // 5. Update order status
    const [updatedCount, updatedOrders] = await Order.update(
      { 
        status: 'Processing',
        paypalOrderId: orderId,
        updatedAt: new Date()
      },
      { 
        where: { 
          id: pendingOrder.id,
          status: 'Pending'
        },
        returning: true
      }
    );

    if (updatedCount === 0) {
      return res.status(400).json({ error: 'Order update failed' });
    }

    // 6. Send receipt email after successful order update
    try {
      const user = await User.findByPk(req.user.id); // Get user's email
      if (user && user.email) {
        await receiptService.sendReceiptEmail(
          updatedOrders[0].id,  // Pass the updated order ID
          user.email            // Send receipt to the user's email
        );
        console.log('Receipt email sent successfully');
      } else {
        console.warn('User email not found. Receipt not sent.');
      }
    } catch (emailError) {
      console.error('Error sending receipt email:', emailError);
      // Optional: Log the error but don't block the response
    }

    return res.json({
      success: true,
      order: updatedOrders[0]
    });

  } catch (error) {
    console.error('Full PayPal Verification Error:', error);
    return res.status(500).json({ 
      error: 'Payment verification failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = { verifyPaypalOrder };
