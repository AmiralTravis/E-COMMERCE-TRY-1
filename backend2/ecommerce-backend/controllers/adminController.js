const db = require('../config/db');

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
    const result = await db.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM reviews');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
