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



const applyFilters = (queryOptions, filters) => {
  const { query, minPrice, maxPrice, minRating, categories } = filters;

  console.log('Applying filters:', filters); // Debugging

  // Apply search filters
  if (query) {
    queryOptions.where[Op.or] = [
      // Full-text search for advanced matching
      sequelize.where(
        sequelize.fn('to_tsvector', sequelize.col('name')),
        '@@',
        sequelize.fn('to_tsquery', query.replace(/\s+/g, ' & ')) // Convert query to tsquery format
      ),
      sequelize.where(
        sequelize.fn('to_tsvector', sequelize.col('description')),
        '@@',
        sequelize.fn('to_tsquery', query.replace(/\s+/g, ' & '))
      ),
      // ILIKE for partial matching
      { 
        name: {
          [Op.iLike]: `%${query}%` // Search in product name
        }
      },
      {
        description: {
          [Op.iLike]: `%${query}%` // Search in product description
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
    queryOptions.include = [
      {
        model: Category,
        through: {
          attributes: [] // Exclude join table columns from the result
        },
        attributes: ['id', 'name'],
        where: {
          id: {
            [Op.in]: categories.split(',').map(Number)
          }
        }
      }
    ];
  }

  console.log('Query options after applying filters:', queryOptions); // Debugging
  return queryOptions;
};

const fetchProducts = async (queryOptions) => {
  console.log('Fetching products with query options:', queryOptions); // Debugging

  // Step 1: Fetch unique product IDs
  const productIdsQueryOptions = {
    attributes: ['id'], // Fetch only product IDs
    include: queryOptions.include, // Include the same associations
    where: queryOptions.where, // Apply the same filters
    limit: queryOptions.limit,
    offset: queryOptions.offset,
    subQuery: false // Disable subqueries to avoid issues with GROUP BY
  };

  const productIdsResult = await Product.findAll(productIdsQueryOptions);
  const productIds = productIdsResult.map(product => product.id);

  // Step 2: Fetch full product details for the filtered product IDs
  const productsQueryOptions = {
    include: queryOptions.include, // Include the same associations
    where: {
      id: {
        [Op.in]: productIds
      }
    }
  };

  return await Product.findAll(productsQueryOptions);
};



const countTotalProducts = async (queryOptions) => {
  // Fetch unique product IDs
  const productIdsQueryOptions = {
    attributes: ['id'], // Fetch only product IDs
    include: queryOptions.include, // Include the same associations
    where: queryOptions.where, // Apply the same filters
    subQuery: false // Disable subqueries to avoid issues with GROUP BY
  };

  const productIdsResult = await Product.findAll(productIdsQueryOptions);
  return productIdsResult.length; // Return the total count of unique products
};

const applyCategoryFilter = (queryOptions, categories) => {
  if (categories) {
    queryOptions.include = [
      {
        model: Category,
        through: {
          attributes: [] // Exclude join table columns from the result
        },
        attributes: ['id', 'name'],
        where: {
          id: {
            [Op.in]: categories.split(',').map(Number) // Convert categories to an array of numbers
          }
        }
      }
    ];
  }

  return queryOptions;
};


exports.searchProducts = async (req, res) => {
  try {
    const { 
      query,
      minPrice,
      maxPrice,
      minRating,
      categories,
    } = req.query;

    // Base query options
    const queryOptions = {
      include: [
        {
          model: Category, // Include the Category model
          through: { attributes: [] }, // Exclude the join table attributes
          attributes: ['id', 'name'], // Only include category ID and name
        },
      ],
      where: {},
      distinct: true, // Ensure unique products are returned
      subQuery: false, // Disable subqueries to avoid issues with GROUP BY
    };

    // Apply search filters
    const filters = { query, minPrice, maxPrice, minRating };
    applyFilters(queryOptions, filters);

    // Apply category filter (if categories are provided)
    applyCategoryFilter(queryOptions, categories);

    // Fetch all products without pagination
    const products = await fetchProducts(queryOptions);

    // Fetch reviews for all products
    const productIds = products.map(product => product.id);
    const reviews = await Review.findAll({
      where: {
        productId: {
          [Op.in]: productIds
        }
      }
    });

    // Group reviews by productId
    const reviewsByProductId = reviews.reduce((acc, review) => {
      if (!acc[review.productId]) {
        acc[review.productId] = [];
      }
      acc[review.productId].push(review);
      return acc;
    }, {});

    // Calculate avgRating and reviewCount for each product
    const productsWithReviews = products.map(product => {
      const productReviews = reviewsByProductId[product.id] || [];
      const reviewCount = productReviews.length;
      const avgRating = reviewCount > 0 
        ? (productReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(1)
        : 0;

      return {
        ...product.toJSON(),
        reviewCount,
        avgRating,
        categories: product.Categories, // Include categories in the response
      };
    });

    // Count total products
    const totalCount = await countTotalProducts(queryOptions);

    res.json({
      results: productsWithReviews,
      total: totalCount,
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json([]);
    }

    const suggestions = await Product.findAll({
      where: {
        [Op.or]: [
          sequelize.where(
            sequelize.fn('to_tsvector', sequelize.col('name')),
            '@@',
            sequelize.fn('to_tsquery', query.replace(/\s+/g, ' & '))
          ),
          sequelize.where(
            sequelize.fn('to_tsvector', sequelize.col('description')),
            '@@',
            sequelize.fn('to_tsquery', query.replace(/\s+/g, ' & '))
          )
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
