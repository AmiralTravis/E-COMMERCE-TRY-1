// controllers/productController.js

const db = require('../config/db');
const { Product, User, Category,ProductCategory, Review, sequelize } = require('../models'); // Adjust according to your project structure
const { Op } = require('sequelize');
// const sequelize = db.sequelize; 

// Utility functions for discount calculations
const getDiscountCategory = (discountPercentage) => {
  if (discountPercentage === 50) return 'flat_50'
  if (discountPercentage > 40 && discountPercentage <= 75) return 'upto_75'
  if (discountPercentage > 0 && discountPercentage <= 40) return 'upto_40'
  return 'none'
}

const calculateDiscountedPrice = (price, discountPercentage) => {
  if (!discountPercentage || discountPercentage <= 0) return price
  const discount = Math.min(discountPercentage, 75) // Cap at 75%
  return Math.round(price * (1 - discount / 100) * 100) / 100
}


const calculateRatingDistribution = async (productId) => {
  const reviews = await Review.findAll({
    where: { productId },
    attributes: ['rating'],
  });

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach(review => {
    distribution[review.rating]++;
  });

  return distribution;
};


// exports.getAllProducts = async (req, res) => {
//   console.log('Getting all products');
//   try {
//     console.log('Executing database query...');
//     const result = await db.query('SELECT * FROM "Products"');
//     console.log('Query executed. Result:', JSON.stringify(result, null, 2));
    
//     let products;
//     if (Array.isArray(result) && result.length > 0) {
//       // If result is an array, assume the first element contains the products
//       products = result[0];
//     } else if (result && result.rows) {
//       // If result has a 'rows' property, use that
//       products = result.rows;
//     } else {
//       console.log('Unexpected query result structure');
//       return res.status(500).json({ error: 'Unexpected query result structure' });
//     }
    
//     if (!Array.isArray(products)) {
//       console.log('Products is not an array');
//       return res.status(500).json({ error: 'Unexpected product data structure' });
//     }
    
//     console.log(`Found ${products.length} products`);
//     console.log('Products:', JSON.stringify(products, null, 2));
    
//     res.json(products);
//   } catch (err) {
//     console.error('Error getting products:', err);
//     res.status(500).json({ error: 'Failed to fetch products', details: err.message });
//   }
// };
exports.getAllProducts = async (req, res) => {
  console.log('Getting all products');
  try {
    console.log('Executing database query...');
    const result = await db.query('SELECT * FROM "Products"');
    console.log('Query executed. Result:', JSON.stringify(result, null, 2));
    
    let products;
    if (Array.isArray(result) && result.length > 0) {
      products = result[0];
    } else if (result && result.rows) {
      products = result.rows;
    } else {
      console.log('Unexpected query result structure');
      return res.status(500).json({ error: 'Unexpected query result structure' });
    }
    
    if (!Array.isArray(products)) {
      console.log('Products is not an array');
      return res.status(500).json({ error: 'Unexpected product data structure' });
    }

    // Add discounted price calculation
    const productsWithDiscounts = products.map(product => ({
      ...product,
      discountedPrice: calculateDiscountedPrice(product.price, product.discountPercentage),
      discountCategory: getDiscountCategory(product.discountPercentage)
    }));
    
    console.log(`Found ${products.length} products`);
    res.json(productsWithDiscounts);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
};



exports.getProductById = async (req, res) => {
  const { id } = req.params;
  console.log(`ID from params: ${id}`);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Review,
          attributes: ['id', 'rating', 'comment', 'createdAt'],
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });

    if (!product) {
      console.log(`Product with id ${id} not found`);
      return res.status(404).json({ error: 'Product not found' });
    }

    const ratingDistribution = await calculateRatingDistribution(id);
    const productData = product.toJSON();

    const productWithDiscount = {
      ...productData,
      discountedPrice: calculateDiscountedPrice(productData.price, productData.discountPercentage),
      discountCategory: getDiscountCategory(productData.discountPercentage),
      ratingDistribution
    };

    console.log(`Found product: ${JSON.stringify(productWithDiscount)}`);
    res.json(productWithDiscount);
  } catch (err) {
    console.error(`Error getting product with id ${id}:`, err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};


// exports.createProduct = async (req, res) => {
//   const { name, description, price } = req.body;
//   console.log('Creating new product');
//   try {
//     const result = await db.query(
//       'INSERT INTO "Products" (name, description, price) VALUES ($1, $2, $3) RETURNING *',
//       [name, description, price]
//     );
//     console.log('Product created successfully');
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('Error creating product:', err);
//     res.status(500).json({ error: 'Failed to create product' });
//   }
// };

// exports.updateProduct = async (req, res) => {
//   const { id } = req.params;
//   const { name, description, price } = req.body;
//   console.log(`Updating product with id: ${id}`);
//   try {
//     const result = await db.query(
//       'UPDATE "Products" SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *',
//       [name, description, price, id]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
//     console.log(`Product with id ${id} updated successfully`);
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(`Error updating product with id ${id}:`, err);
//     res.status(500).json({ error: 'Failed to update product' });
//   }
// };

exports.createProduct = async (req, res) => {
  const { name, description, price, discountPercentage } = req.body;
  console.log('Creating new product');
  try {
    const productData = {
      name,
      description,
      price,
      discountPercentage,
      discountCategory: getDiscountCategory(discountPercentage)
    };

    const result = await db.query(
      'INSERT INTO "Products" (name, description, price, discountPercentage, discountCategory) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, discountPercentage, productData.discountCategory]
    );
    
    console.log('Product created successfully');
    res.status(201).json({
      ...result.rows[0],
      discountedPrice: calculateDiscountedPrice(price, discountPercentage)
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, discountPercentage } = req.body;
  console.log(`Updating product with id: ${id}`);
  try {
    const productData = {
      name,
      description,
      price,
      discountPercentage,
      discountCategory: getDiscountCategory(discountPercentage)
    };

    const result = await db.query(
      'UPDATE "Products" SET name = $1, description = $2, price = $3, discountPercentage = $4, discountCategory = $5 WHERE id = $6 RETURNING *',
      [name, description, price, discountPercentage, productData.discountCategory, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log(`Product with id ${id} updated successfully`);
    res.json({
      ...result.rows[0],
      discountedPrice: calculateDiscountedPrice(price, discountPercentage)
    });
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
  // if (minPrice || maxPrice) {
  //   queryOptions.where.price = {};
  //   if (minPrice) queryOptions.where.price[Op.gte] = minPrice;
  //   if (maxPrice) queryOptions.where.price[Op.lte] = maxPrice;
  // }
  // Replace price filter with discounted price calculation
if (minPrice || maxPrice) {
  const priceConditions = [];

  if (minPrice) {
    priceConditions.push(
      sequelize.where(
        sequelize.literal('price * (1 - COALESCE("discountPercentage",0)/100)'),
        '>=',
        minPrice
      )
    );
  }

  if (maxPrice) {
    priceConditions.push(
      sequelize.where(
        sequelize.literal('price * (1 - COALESCE("discountPercentage",0)/100)'),
        '<=',
        maxPrice
      )
    );
  }

  queryOptions.where[Op.and] = [
    ...(queryOptions.where[Op.and] || []),
    ...priceConditions
  ];
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

// const applyCategoryFilter = (queryOptions, categories) => {
//   if (categories) {
//     queryOptions.include = [
//       {
//         model: Category,
//         through: {
//           attributes: [] // Exclude join table columns from the result
//         },
//         attributes: ['id', 'name'],
//         where: {
//           id: {
//             [Op.in]: categories.split(',').map(Number) // Convert categories to an array of numbers
//           }
//         }
//       }
//     ];
//   }

//   return queryOptions;
// };

// const applyCategoryFilter = (queryOptions, categories) => {
//   if (categories) {
//     const categoryArray = Array.isArray(categories) 
//       ? categories 
//       : categories.split(',');
//     const categoryIds = categoryArray.map(Number);

//     queryOptions.include = [
//       {
//         model: Category,
//         through: { attributes: [] },
//         attributes: ['id', 'name'],
//         where: { id: { [Op.in]: categoryIds } }
//       }
//     ];
//   }
//   return queryOptions;
// };
const applyCategoryFilter = (queryOptions, categories) => {
  if (categories) {
    const categoryArray = Array.isArray(categories) 
      ? categories 
      : categories.split(',');
      
    // Convert to numbers and filter out invalid values
    const categoryIds = categoryArray
      .map(Number)
      .filter(id => !isNaN(id) && id > 0);

    if (categoryIds.length > 0) {
      queryOptions.include = [
        {
          model: Category,
          through: { attributes: [] },
          attributes: ['id', 'name'],
          where: { id: { [Op.in]: categoryIds } }
        }
      ];
    }
  }
  return queryOptions;
};



// exports.searchProducts = async (req, res) => {
//   try {
//     const { 
//       query,
//       minPrice,
//       maxPrice,
//       minRating,
//       categories,
//       discountCategories
//     } = req.query;

//     // Base query options
//     const queryOptions = {
//       include: [
//         {
//           model: Category,
//           through: { attributes: [] },
//           attributes: ['id', 'name'],
//         },
//       ],
//       where: {},
//       distinct: true,
//       subQuery: false,
//     };

//     // Apply search filters
//     const filters = { query, minPrice, maxPrice, minRating };
//     applyFilters(queryOptions, filters);

//     // Apply category filter
//     applyCategoryFilter(queryOptions, categories);

//     // Apply discount category filter if provided
//     if (discountCategories) {
//       const categories = discountCategories.split(',')
//       queryOptions.where.discountCategory = { [Op.in]: categories }
//     }

//     const products = await fetchProducts(queryOptions);
//     const productIds = products.map(product => product.id);

//     const reviews = await Review.findAll({
//       where: { productId: { [Op.in]: productIds } }
//     });

//     const reviewsByProductId = reviews.reduce((acc, review) => {
//       if (!acc[review.productId]) acc[review.productId] = [];
//       acc[review.productId].push(review);
//       return acc;
//     }, {});

//     const productsWithDetails = await Promise.all(products.map(async (product) => {
//       const productData = product.toJSON();
//       const productReviews = reviewsByProductId[product.id] || [];
//       const reviewCount = productReviews.length;
//       const avgRating = reviewCount > 0 
//         ? (productReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(1)
//         : 0;

//       return {
//         ...productData,
//         discountedPrice: calculateDiscountedPrice(productData.price, productData.discountPercentage),
//         discountCategory: getDiscountCategory(productData.discountPercentage),
//         reviewCount,
//         avgRating,
//         ratingDistribution: await calculateRatingDistribution(product.id),
//         categories: product.Categories
//       };
//     }));

//     const totalCount = await countTotalProducts(queryOptions);

//     res.json({
//       results: productsWithDetails,
//       total: totalCount,
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
      discountRanges, // Now we receive discountRanges
    } = req.query;

    const queryOptions = {
      include: [
        {
          model: Category,
          through: { attributes: [] },
          attributes: ['id', 'name'],
        },
      ],
      where: {},
      distinct: true,
      subQuery: false,
    };

    const filters = { query, minPrice, maxPrice, minRating };
    applyFilters(queryOptions, filters);

    applyCategoryFilter(queryOptions, categories);

    if (discountRanges) {
      try { // Important: Add a try-catch block here
        const ranges = JSON.parse(discountRanges);

        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: ranges.map(range => ({
            discountPercentage: {
              [Op.gte]: range.min,
              [Op.lte]: range.max,
            },
          })),
        };
      } catch (parseError) {  // Catch JSON parsing errors
        console.error("Error parsing discountRanges:", parseError);
        return res.status(400).json({ error: "Invalid discountRanges format" }); // Return a 400 Bad Request
      }
    }

    const products = await fetchProducts(queryOptions);
    const productIds = products.map(product => product.id);

    const reviews = await Review.findAll({
      where: { productId: { [Op.in]: productIds } },
    });

    const reviewsByProductId = reviews.reduce((acc, review) => {
      if (!acc[review.productId]) acc[review.productId] = [];
      acc[review.productId].push(review);
      return acc;
    }, {});

    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        const productData = product.toJSON();
        const productReviews = reviewsByProductId[product.id] || [];
        const reviewCount = productReviews.length;
        const avgRating =
          reviewCount > 0
            ? (productReviews.reduce((sum, review) => sum + review.rating, 0) /
              reviewCount).toFixed(1)
            : 0;

        return {
          ...productData,
          discountedPrice: calculateDiscountedPrice(
            productData.price,
            productData.discountPercentage
          ),
          discountCategory: getDiscountCategory(productData.discountPercentage),
          reviewCount,
          avgRating,
          ratingDistribution: await calculateRatingDistribution(product.id),
          categories: product.Categories,
        };
      })
    );

    const totalCount = await countTotalProducts(queryOptions);

    res.json({
      results: productsWithDetails,
      total: totalCount,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
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






exports.getTopProducts = async (req, res) => {
  console.log("getTopProducts entering");
  try {
    const products = await Product.getTopProducts(15);
    
    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        const productData = product.toJSON();
        return {
          ...productData,
          discountedPrice: calculateDiscountedPrice(productData.price, productData.discountPercentage),
          discountCategory: getDiscountCategory(productData.discountPercentage),
          ratingDistribution: await calculateRatingDistribution(product.id),
          categories: product.Categories,
          reviewCount: product.dataValues.reviewCount
        };
      })
    );

    res.json(productsWithDetails);
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ 
      error: 'Failed to fetch top products',
      details: error.message
    });
  }
};



exports.getLatestProducts = async (req, res) => {
  try {
    const { limit = 15 } = req.query;

    const products = await Product.findAll({
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      attributes: [
        'id',
        'name',
        'imageUrl',
        'price',
        'discountPercentage',
        'createdAt',
        'avgRating',
        [ // Add the subquery for reviewCount here
          sequelize.literal('(SELECT COUNT(*) FROM "Reviews" WHERE "productId" = "Product".id)'),
          'reviewCount'
        ]
      ],
       include: {
        model: Review,
        as: 'reviews'
      },
    });

    const productsWithDetails = products.map(product => ({
      ...product.toJSON(),
      discountedPrice: calculateDiscountedPrice(product.price, product.discountPercentage),
      discountCategory: getDiscountCategory(product.discountPercentage),
      reviewCount: Number(product.dataValues.reviewCount) || 0, //Access reviewCount like this
    }));

    res.json(productsWithDetails);
  } catch (error) {
    console.error('Error fetching latest products:', error);
    res.status(500).json({ error: 'Failed to fetch latest products', details: error.message });
  }
};