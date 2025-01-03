// controllers/productController.js

const db = require('../config/db');
const { Product, Category,ProductCategory, Review, sequelize } = require('../models'); // Adjust according to your project structure
const { Op } = require('sequelize');
// const sequelize = db.sequelize; 

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
  console.log(`ID from params: ${id}`);
  console.log(`Getting product with id: ${id}`);

  // Validate ID
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    // Use Sequelize to find the product by primary key (id)
    const product = await Product.findByPk(id);
    if (!product) {
      console.log(`Product with id ${id} not found`);
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log(`Found product: ${JSON.stringify(product)}`);
    res.json(product);
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


// exports.searchProducts = async (req, res) => {
//   try {
//     const { 
//       query,
//       minPrice,
//       maxPrice,
//       minRating,
//       categories,
//       limit = 15, // Default limit to 15
//       page = 1
//     } = req.query;

//     const offset = (page - 1) * limit;

//     // Base query options
//     // const queryOptions = {
//     //   include: [
//     //     {
//     //       model: Category,
//     //       through: ProductCategory,
//     //       attributes: ['id', 'name']
//     //     },
//     //     {
//     //       model: Review, // Include the Review model
//     //       attributes: [], // No need to fetch review details
//     //     }
//     //   ],
//     //   where: {},
//     //   limit: parseInt(limit),
//     //   offset: parseInt(offset),
//     //   attributes: {
//     //     include: [
//     //       [sequelize.fn('COUNT', sequelize.col('Reviews.id')), 'reviewCount'] // Count reviews
//     //     ]
//     //   },
//     //   group: ['Product.id'], // Group by product ID
//     //   subQuery: false // Disable subqueries to avoid issues with GROUP BY
//     // };
//     const queryOptions = {
//       include: [
//         {
//           model: Category,
//           through: ProductCategory,
//           attributes: ['id', 'name']
//         },
//         {
//           model: Review, // Include the Review model
//           attributes: [], // No need to fetch review details
//         }
//       ],
//       where: {},
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//       attributes: {
//         include: [
//           [sequelize.fn('COUNT', sequelize.col('Reviews.id')), 'reviewCount'] // Count reviews
//         ]
//       },
//       group: [
//         'Product.id', // Group by product ID
//         'Categories.id', // Group by category ID
//         'Categories->ProductCategory.productId', // Group by join table column
//         'Categories->ProductCategory.categoryId' // Group by join table column
//       ],
//       subQuery: false // Disable subqueries to avoid issues with GROUP BY
//     };

//     // Apply search filters
//     if (query) {
//       queryOptions.where[Op.or] = [
//         { 
//           name: {
//             [Op.iLike]: `%${query}%`
//           }
//         },
//         {
//           description: {
//             [Op.iLike]: `%${query}%`
//           }
//         }
//       ];
//     }

//     // Price range filter
//     if (minPrice || maxPrice) {
//       queryOptions.where.price = {};
//       if (minPrice) queryOptions.where.price[Op.gte] = minPrice;
//       if (maxPrice) queryOptions.where.price[Op.lte] = maxPrice;
//     }

//     // Rating filter
//     if (minRating) {
//       queryOptions.where.avgRating = {
//         [Op.gte]: minRating
//       };
//     }

//     // Category filter
//     if (categories) {
//       const categoryIds = categories.split(',').map(Number);
//       queryOptions.include[0].where = {
//         id: {
//           [Op.in]: categoryIds
//         }
//       };
//     }

//     const { count, rows } = await Product.findAndCountAll(queryOptions);

//     // Calculate total pages
//     const totalPages = Math.ceil(count.length / limit);

//     res.json({
//       results: rows,
//       total: count.length,
//       page: parseInt(page),
//       totalPages: totalPages
//     });

//   } catch (error) {
//     console.error('Search error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
exports.searchProducts = async (req, res) => {
  try {
    const { 
      query,
      minPrice,
      maxPrice,
      minRating,
      categories,
      limit = 15, // Ensure this is 15
      page = 1
    } = req.query;

    const offset = (page - 1) * limit;

    // Base query options
    const queryOptions = {
      include: [
        {
          model: Category,
          through: {
            attributes: [] // Exclude join table columns from the result
          },
          attributes: ['id', 'name']
        },
        {
          model: Review, // Include the Review model
          attributes: [], // No need to fetch review details
        }
      ],
      where: {},
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('Reviews.id')), 'reviewCount'] // Count reviews
        ]
      },
      group: ['Product.id', 'Categories.id'], // Group by product ID and category ID
      subQuery: false // Disable subqueries to avoid issues with GROUP BY
    };

    // Apply search filters
    if (query) {
      queryOptions.where[Op.or] = [
        { 
          name: {
            [Op.iLike]: `%${query}%`
          }
        },
        {
          description: {
            [Op.iLike]: `%${query}%`
          }
        },
        // Include category names in the search
        {
          '$Categories.name$': {
            [Op.iLike]: `%${query}%`
          }
        }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      queryOptions.where.price = {};
      if (minPrice) queryOptions.where.price[Op.gte] = minPrice;
      if (maxPrice) queryOptions.where.price[Op.lte] = maxPrice;
    }

    // Rating filter
    if (minRating) {
      queryOptions.where.avgRating = {
        [Op.gte]: minRating
      };
    }

    // Category filter
    if (categories) {
      const categoryIds = categories.split(',').map(Number);
      queryOptions.include[0].where = {
        id: {
          [Op.in]: categoryIds
        }
      };
    }

    const { count, rows } = await Product.findAndCountAll(queryOptions);

    // Calculate total pages
    const totalPages = Math.ceil(count.length / limit);

    res.json({
      results: rows,
      total: count.length,
      page: parseInt(page),
      totalPages: totalPages
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// controllers/productController.js
exports.getSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json([]);
    }

    const suggestions = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [{
        model: Category,
        through: ProductCategory,
        attributes: ['name']
      }],
      limit: 6
    });

    res.json(suggestions.map(product => ({
      id: product.id,
      name: product.name,
      category: product.Categories[0]?.name || 'General'
    })));
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};