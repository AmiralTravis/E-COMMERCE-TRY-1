// controller/adminController.js

const db = require('../config/db');
const { Product, Order, Category, User } = require('../models');
const { Op } = require('sequelize');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }); // Adjust port as needed

// Broadcast stock updates to all connected clients
function broadcastStockUpdate(productId, newStock) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'stock_update', productId, newStock }));
    }
  });
}

// Admin login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Replace with actual authentication logic
    if (username === 'admin' && password === 'admin') {
      res.json({ message: 'Login successful', token: 'admin-token' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log in' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: User,
        attributes: ['id', 'username'], // Adjust attributes as necessary
      }],
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Category,
        attributes: ['id', 'name'], // Specify the attributes you want from the Category model
      }],
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// Edit product
exports.editProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);

    // Broadcast stock update if stock has changed
    if (req.body.stock !== undefined) {
      broadcastStockUpdate(id, req.body.stock);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to edit product' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Fulfill order
exports.fulfillOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = 'fulfilled';
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fulfill order' });
  }
};

// Get sales report
exports.getSalesReport = async (req, res) => {
  const { period } = req.query;
  try {
    let startDate;
    const endDate = new Date();

    switch (period) {
      case 'daily':
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      default:
        return res.status(400).json({ error: 'Invalid period' });
    }

    const salesReport = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        },
        status: 'completed'
      },
      attributes: [
        [db.fn('SUM', db.col('total')), 'totalSales'],
        [db.fn('COUNT', db.col('id')), 'orderCount']
      ]
    });

    res.json(salesReport[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate sales report' });
  }
};

// Get low stock alerts
exports.getLowStockAlerts = async (req, res) => {
  try {
    const lowStockProducts = await Product.findAll({
      where: {
        stock: {
          [Op.lte]: 10
        }
      }
    });
    res.json(lowStockProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch low stock alerts' });
  }
};

// Update stock
exports.updateStock = async (req, res) => {
  const { id } = req.params;
  const { stockChange } = req.body;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const newStock = product.stock + stockChange;
    await product.update({ stock: newStock });
    res.json(product);

    // Broadcast the stock update
    broadcastStockUpdate(id, newStock);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update stock' });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }
    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

// Refund order
exports.refundOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.status !== 'completed') {
      return res.status(400).json({ error: 'Order cannot be refunded' });
    }
    order.status = 'refunded';
    await order.save();
    // Here you would typically integrate with a payment gateway to process the refund
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to refund order' });
  }
};