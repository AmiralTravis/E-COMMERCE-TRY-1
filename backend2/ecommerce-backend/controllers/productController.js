// controllers/productController.js

const db = require('../config/db');
exports.getAllProducts = async (req, res) => {
  console.log('Getting all products');
  try {
    console.log('Executing database query...');
    const result = await db.query('SELECT * FROM "Products"');
    console.log('Query executed. Result:', JSON.stringify(result, null, 2));
    
    let products;
    if (Array.isArray(result) && result.length > 0) {
      // If result is an array, assume the first element contains the products
      products = result[0];
    } else if (result && result.rows) {
      // If result has a 'rows' property, use that
      products = result.rows;
    } else {
      console.log('Unexpected query result structure');
      return res.status(500).json({ error: 'Unexpected query result structure' });
    }
    
    if (!Array.isArray(products)) {
      console.log('Products is not an array');
      return res.status(500).json({ error: 'Unexpected product data structure' });
    }
    
    console.log(`Found ${products.length} products`);
    console.log('Products:', JSON.stringify(products, null, 2));
    
    res.json(products);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
};


exports.getProductById = async (req, res) => {
  const { id } = req.params;
  console.log(`Getting product with id: ${id}`);
  try {
    const result = await db.query('SELECT * FROM "Products" WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      console.log(`Product with id ${id} not found`);
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log(`Found product: ${JSON.stringify(result.rows[0])}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error getting product with id ${id}:`, err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price } = req.body;
  console.log('Creating new product');
  try {
    const result = await db.query(
      'INSERT INTO "Products" (name, description, price) VALUES ($1, $2, $3) RETURNING *',
      [name, description, price]
    );
    console.log('Product created successfully');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  console.log(`Updating product with id: ${id}`);
  try {
    const result = await db.query(
      'UPDATE "Products" SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *',
      [name, description, price, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log(`Product with id ${id} updated successfully`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating product with id ${id}:`, err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting product with id: ${id}`);
  try {
    const result = await db.query('DELETE FROM "Products" WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log(`Product with id ${id} deleted successfully`);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(`Error deleting product with id ${id}:`, err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};