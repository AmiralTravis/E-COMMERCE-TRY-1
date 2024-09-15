const db = require('../config/db');

// Get cart items for a user
exports.getCartItems = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [userId, productId, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Update item quantity in cart
exports.updateCartItem = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;
  try {
    const result = await db.query(
      'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, userId, productId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [userId, productId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};
