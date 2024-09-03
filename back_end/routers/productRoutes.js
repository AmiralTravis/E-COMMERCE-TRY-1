const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/productController');

// Define a route to get all products
router.get('/products', getProducts);

module.exports = router;
