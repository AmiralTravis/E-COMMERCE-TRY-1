// const db = require('../config/db');

// // Get payment methods for a user
// exports.getPaymentMethods = async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const result = await db.query('SELECT * FROM payments WHERE user_id = $1', [userId]);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch payment methods' });
//   }
// };

// // Add a new payment method
// exports.addPaymentMethod = async (req, res) => {
//   const { userId, paymentMethod } = req.body;
//   try {
//     const result = await db.query(
//       'INSERT INTO payments (user_id, payment_method) VALUES ($1, $2) RETURNING *',
//       [userId, paymentMethod]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to add payment method' });
//   }
// };

// // Update a payment method
// exports.updatePaymentMethod = async (req, res) => {
//   const { id } = req.params;
//   const { paymentMethod } = req.body;
//   try {
//     const result = await db.query(
//       'UPDATE payments SET payment_method = $1 WHERE id = $2 RETURNING *',
//       [paymentMethod, id]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Payment method not found' });
//     }
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to update payment method' });
//   }
// };

// // Delete a payment method
// exports.deletePaymentMethod = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await db.query('DELETE FROM payments WHERE id = $1 RETURNING *', [id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Payment method not found' });
//     }
//     res.status(204).send();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to delete payment method' });
//   }
// };


const db = require('../config/db');

// Get payment methods for a user
exports.getPaymentMethods = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM payments WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
};

// Add a new payment method
exports.addPaymentMethod = async (req, res) => {
  const { userId, paymentMethod } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO payments (user_id, payment_method) VALUES ($1, $2) RETURNING *',
      [userId, paymentMethod]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add payment method' });
  }
};

// Update a payment method
exports.updatePaymentMethod = async (req, res) => {
  const { id } = req.params;
  const { paymentMethod } = req.body;
  try {
    const result = await db.query(
      'UPDATE payments SET payment_method = $1 WHERE id = $2 RETURNING *',
      [paymentMethod, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update payment method' });
  }
};

// Delete a payment method
exports.deletePaymentMethod = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM payments WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete payment method' });
  }
};

// Process a payment (checkout process)
exports.processPayment = async (req, res) => {
  const { userId, amount, paymentMethod } = req.body;
  try {
    // Assuming you have a table for storing payment transactions
    const result = await db.query(
      'INSERT INTO payments (user_id, amount, payment_method) VALUES ($1, $2, $3) RETURNING *',
      [userId, amount, paymentMethod]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process payment' });
  }
};

// Get payment details by ID
exports.getPaymentDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM payments WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
};
