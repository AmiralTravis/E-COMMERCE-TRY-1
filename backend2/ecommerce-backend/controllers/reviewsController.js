const db = require('../config/db');

// Get all reviews for a product
exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    const result = await db.query('SELECT * FROM reviews WHERE product_id = $1', [productId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  const { productId, userId, rating, comment } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [productId, userId, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    const result = await db.query(
      'UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3 RETURNING *',
      [rating, comment, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
