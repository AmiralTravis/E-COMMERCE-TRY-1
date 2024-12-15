// controllers/orderController.js
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { Order } = require('../models');  // Adjust path as needed
const { createOrderItems } = require('../services/orderItemService');
const { 
  sendOrderConfirmationEmail, 
  sendDeliveryNotificationEmail 
} = require('../utils/emailService');
// const { Op } = require('sequelize');
const sequelize = require('../config/db');

const ReceiptService = require('../services/receiptService');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  }
});

const receiptService = new ReceiptService(transporter);


// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Create a new order
const generateTrackingNumber = () => {
  // Example: Generate a unique tracking number in the format of 'TRACK-XXXXXX'
  const randomDigits = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
  return `TRACK-${randomDigits}`;
};


exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { items, totalAmount } = req.body;
    const trackingNumber = generateTrackingNumber();

    // Round the totalAmount to two decimal places
    const roundedTotalAmount = parseFloat(totalAmount.toFixed(2));  // Ensure it's rounded

    // Create order within transaction
    const order = await Order.create({
      userId: req.user.id,
      totalAmount: roundedTotalAmount,  // Save the rounded value
      status: 'Pending',
      paymentVerified: true,
      completedAt: null,
      trackingNumber: trackingNumber,
      estimatedDeliveryDate: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
    }, { transaction: t });

    // Create order items
    await createOrderItems(order.id, items);
    
    await t.commit();
    console.log('Created order with items:', order);
    res.status(201).json(order);

  } catch (err) {
    await t.rollback();
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};


// Update an order
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    // Fetch user details with the order
    const orderResult = await db.query(
      'SELECT orders.*, users.email, users.username FROM orders JOIN users ON orders.user_id = users.id WHERE orders.id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];
    const user = { email: order.email, username: order.username };

    // Generate tracking number if not exists
    const trackingNumber = order.tracking_number || 
      `TRK-${uuidv4().slice(0,8).toUpperCase()}`;

    // Calculate estimated delivery date
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

    // Update order status and tracking info
    const updateResult = await db.query(
      `UPDATE orders 
       SET status = $1, 
           tracking_number = $2, 
           estimated_delivery_date = $3 
       WHERE id = $4 RETURNING *`,
      [status, trackingNumber, estimatedDeliveryDate, id]
    );

    // Send notifications based on status
    if (status === 'Shipped') {
      await sendOrderConfirmationEmail(user, updateResult.rows[0]);
    }

    if (status === 'Delivering') {
      await sendDeliveryNotificationEmail(user, updateResult.rows[0]);
    }

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};


exports.processPayPalOrder = async (req, res) => {
  try {
    // Your existing PayPal order verification logic
    const { orderId, userEmail } = req.body;

    // Verify PayPal payment
    const paypalOrder = await paypalClient.verifyOrder(orderId);

    if (paypalOrder.status === 'COMPLETED') {
      // Send receipt email
      await receiptService.sendReceiptEmail(orderId, userEmail);

      res.status(200).json({ 
        message: 'Order processed and receipt sent', 
        orderId 
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};