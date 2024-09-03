const { query } = require('pg');
const pool = require('../models/db'); // Import your database connection

// Handle the request to get all products
const getProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Server error');
    }
};

module.exports = { getProducts };
