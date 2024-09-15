const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

exports.createProduct = async (req, res) => {
  // Implement creation logic here
};

exports.updateProduct = async (req, res) => {
  // Implement update logic here
};

exports.deleteProduct = async (req, res) => {
  // Implement deletion logic here
};
