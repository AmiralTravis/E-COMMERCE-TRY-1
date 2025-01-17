// /controllers/categoryController.js
const db = require('../config/db');
const { Category } = require('../models'); // Import the Category model

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.findAll();

    // Separate main categories and subcategories
    const mainCategories = categories.filter(cat => cat.isMainCategory);
    const subCategories = categories.filter(cat => !cat.isMainCategory);

    // Attach subcategories to their respective main categories
    const result = mainCategories.map(mainCat => {
      return {
        ...mainCat.toJSON(),
        subcategories: subCategories.filter(subCat => subCat.name.includes(mainCat.name)),
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await db.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
