const { User, Product, Order, OrderItems, sequelize } = require('../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../utils/emailService');

// Seller Registration
exports.registerSeller = async (req, res) => {
  const { businessName, taxId } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    // Validate user can become a seller
    if (user.role !== 'user') {
      return res.status(400).json({ error: 'Only regular users can become sellers' });
    }

    // Update user to pending seller
    await user.update({
      role: 'pending_seller',
      businessName,
      taxId,
      sellerApproved: false
    });

    // Notify admin for approval
    await sendEmail(
      process.env.ADMIN_EMAIL,
      'New Seller Registration',
      `User ${user.username} (${user.email}) has registered as a seller. Please review their application.`
    );

    res.json({
      message: 'Seller registration submitted for approval',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        taxId: user.taxId
      }
    });
  } catch (error) {
    console.error('Seller registration error:', error);
    res.status(500).json({ error: 'Failed to register as seller' });
  }
};

// Get Seller Products
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { sellerId: req.user.id },
      include: ['categories', 'productImages']
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ error: 'Failed to fetch seller products' });
  }
};

// Create Product (Seller Only)
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      sellerId: req.user.id
    };

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update Product (Seller Only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
        sellerId: req.user.id
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    await product.update(req.body);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete Product (Seller Only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
        sellerId: req.user.id
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Get Seller Orders
exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          where: { sellerId: req.user.id },
          include: ['productImages']
        },
        {
          model: User,
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ error: 'Failed to fetch seller orders' });
  }
};

// Get Seller Dashboard Stats
exports.getSellerStats = async (req, res) => {
  try {
    const [productCount, orderCount, totalRevenue] = await Promise.all([
      Product.count({ where: { sellerId: req.user.id } }),
      Order.count({
        include: [
          {
            model: Product,
            where: { sellerId: req.user.id }
          }
        ]
      }),
      Order.sum('totalAmount', {
        include: [
          {
            model: Product,
            where: { sellerId: req.user.id }
          }
        ]
      })
    ]);

    res.json({
      productCount,
      orderCount,
      totalRevenue: totalRevenue || 0
    });
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    res.status(500).json({ error: 'Failed to fetch seller stats' });
  }
};











// controllers/sellerController.js
// const { Order, OrderItems, Product } = require('../models');

// exports.getSalesData = async (req, res) => {
//   const { startDate, endDate } = req.query;
//   const sellerId = req.user.id; // Assuming the seller's ID is available in the request
  
//   try {
//     const orders = await Order.findAll({
//       where: {
//         sellerId,
//         createdAt: {
//           [Op.between]: [new Date(startDate), new Date(endDate)]
//         }
//       },
//       include: [
//         {
//           model: OrderItems,
//           include: [
//             {
//               model: Product,
//               attributes: ['id', 'name', 'price', 'costPrice']
//             }
//           ]
//         }
//       ]
//     });

//     const salesData = orders.flatMap(order => 
//       order.OrderItems.map(item => ({
//         date: order.createdAt,
//         amount: item.subtotal,
//         quantity: item.quantity,
//         productId: item.productId,
//         productName: item.Product.name,
//         costPrice: item.Product.costPrice,
//         profit: item.subtotal - (item.Product.costPrice * item.quantity)
//       }))
//     );

//     res.json(salesData);
//   } catch (error) {
//     console.error('Error fetching sales data:', error);
//     res.status(500).json({ error: 'Failed to fetch sales data' });
//   }
// };
// controllers/sellerController.js

exports.getSalesData = async (req, res) => {
  const { startDate, endDate } = req.query;
  const sellerId = req.user.id;
  console.log("sellerID sent in req: ", sellerId);
  try {
    const orderItems = await OrderItems.findAll({
      where: {
        '$Product.sellerId$': sellerId,
        '$Order.createdAt$': {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'costPrice'],
          where: { sellerId } // Ensure only the seller's products are included
        },
        {
          model: Order,
          attributes: ['createdAt']
        }
      ]
    });

    const salesData = orderItems.map(item => ({
      date: item.Order.createdAt,
      amount: item.subtotal,
      quantity: item.quantity,
      productId: item.Product.id,
      productName: item.Product.name,
      costPrice: item.Product.costPrice,
      profit: item.subtotal - (item.Product.costPrice * item.quantity)
    }));
    console.log("Seles data: ", salesData);

    res.json(salesData);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
};

// exports.getProductPerformance = async (req, res) => {
//   const { productId } = req.params;
//   const sellerId = req.user.id;

//   try {
//     const orders = await Order.findAll({
//       where: { sellerId },
//       include: [
//         {
//           model: OrderItems,
//           where: { productId },
//           include: [
//             {
//               model: Product,
//               attributes: ['id', 'name', 'price', 'costPrice']
//             }
//           ]
//         }
//       ]
//     });

//     const productData = orders.flatMap(order => 
//       order.OrderItems.map(item => ({
//         date: order.createdAt,
//         amount: item.subtotal,
//         quantity: item.quantity,
//         profit: item.subtotal - (item.Product.costPrice * item.quantity)
//       }))
//     );

//     res.json(productData);
//   } catch (error) {
//     console.error('Error fetching product performance:', error);
//     res.status(500).json({ error: 'Failed to fetch product performance' });
//   }
// };
// exports.getProductPerformance = async (req, res) => {
//   const { productId } = req.params;
//   const { startDate, endDate } = req.query; // Get date range from query params
//   const sellerId = req.user.id;


  
//   console.log('Seller ID:', sellerId); // Debugging
//   console.log('Product ID:', productId); // Debugging
//   console.log('Start Date:', startDate); // Debugging
//   console.log('End Date:', endDate); // Debugging


//   try {
//     // Convert startDate and endDate to Date objects
//     const start = startDate ? new Date(startDate) : null;
//     const end = endDate ? new Date(endDate) : null;

//     // Build the where clause for date filtering
//     const whereClause = { sellerId };
//     if (start && end) {
//       whereClause.createdAt = {
//         [Op.between]: [start, end], // Filter orders between startDate and endDate
//       };
//     }

//     const orders = await Order.findAll({
//       where: whereClause, // Apply date filtering
//       include: [
//         {
//           model: OrderItems,
//           where: { productId },
//           include: [
//             {
//               model: Product,
//               attributes: ['id', 'name', 'price', 'costPrice'],
//             },
//           ],
//         },
//       ],
//     });

//     const productData = orders.flatMap((order) =>
//       order.OrderItems.map((item) => ({
//         date: order.createdAt,
//         amount: item.subtotal,
//         quantity: item.quantity,
//         profit: item.subtotal - item.Product.costPrice * item.quantity,
//       }))
//     );

//     res.json(productData);
//   } catch (error) {
//     console.error('Error fetching product performance:', error);
//     res.status(500).json({ error: 'Failed to fetch product performance' });
//   }
// };
exports.getProductPerformance = async (req, res) => {
  const { productId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const orderItems = await OrderItems.findAll({
      where: {
        productId: productId,
        orderId: {
          [Op.in]: sequelize.literal(`(
            SELECT id FROM "Orders" 
            WHERE "createdAt" BETWEEN '${startDate}' AND '${endDate}'
          )`)
        }
      },
      include: [
        {
          model: Order,
          attributes: ['createdAt']
        },
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'costPrice']
        }
      ]
    });

    const productData = orderItems.map(item => ({
      date: item.Order.createdAt,
      amount: item.subtotal,
      quantity: item.quantity,
      profit: item.subtotal - (item.Product.costPrice * item.quantity)
    }));

    res.json(productData);
  } catch (error) {
    console.error('Error fetching product performance:', error);
    res.status(500).json({ error: 'Failed to fetch product performance' });
  }
};

exports.getInventoryStatus = async (req, res) => {
  const sellerId = req.user.id;

  try {
    const products = await Product.findAll({
      where: { sellerId },
      attributes: ['id', 'name', 'stock']
    });

    const lowStockCount = products.filter(p => p.stock < 10).length;
    const healthyStockCount = products.filter(p => p.stock >= 10).length;

    res.json({
      lowStockCount,
      healthyStockCount,
      totalSkus: products.length
    });
  } catch (error) {
    console.error('Error fetching inventory status:', error);
    res.status(500).json({ error: 'Failed to fetch inventory status' });
  }
};