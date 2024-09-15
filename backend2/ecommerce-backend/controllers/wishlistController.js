const db = require('../config/db');

// Get all wishlists for a user
exports.getWishlists = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM wishlists WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch wishlists' });
  }
};

// Add a new item to the wishlist
exports.addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2) RETURNING *',
      [userId, productId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
};

// Remove an item from the wishlist
exports.removeFromWishlist = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM wishlists WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove item from wishlist' });
  }
};
