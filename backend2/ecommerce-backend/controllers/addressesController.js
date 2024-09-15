const db = require('../config/db');

// Get all addresses for a user
exports.getAddresses = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM addresses WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

// Add a new address
exports.addAddress = async (req, res) => {
  const { userId, address } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO addresses (user_id, address) VALUES ($1, $2) RETURNING *',
      [userId, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add address' });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  const { id } = req.params;
  const { address } = req.body;
  try {
    const result = await db.query(
      'UPDATE addresses SET address = $1 WHERE id = $2 RETURNING *',
      [address, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update address' });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM addresses WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};
