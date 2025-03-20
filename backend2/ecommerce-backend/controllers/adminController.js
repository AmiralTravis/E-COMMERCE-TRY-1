// controller/adminController.js

const db = require('../config/db');
const { Product, Order, Category, User, OrderItems, VerifiedPurchase, Image, ProductCategory } = require('../models');
const { Op } = require('sequelize');
const WebSocket = require('ws');
const { sendEmail, sendOrderConfirmationEmail, sendDeliveryNotificationEmail } = require('../utils/emailService');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const axios = require('axios');
const FormData = require('form-data');
// const { sequelize } = require('../config/db');
const { sequelize } = require('../models'); 


const wss = new WebSocket.Server({ port: 8080 }); // Adjust port as needed

// Broadcast stock updates to all connected clients
function broadcastStockUpdate(productId, newStock) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'stock_update', productId, newStock }));
    }
  });
}

// Admin login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ 
      message: 'Login successful', 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log in' });
  }
};



// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "Users"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: User,
        attributes: ['id', 'username'], // Adjust attributes as necessary
      }],
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Category,
        attributes: ['id', 'name'], // Specify the attributes you want from the Category model
      }],
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Add new product

exports.addProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// Edit product


exports.editProduct = async (req, res) => {
  const {id} = req.params;
  const t = await sequelize.transaction();

  try {
    // Update core product fields
    await Product.update(req.body, {
      where: {id},
      transaction: t
    });

    // Handle category updates
    if (req.body.categoryIds) {
      await ProductCategory.destroy({
        where: {productId: id},
        transaction: t
      });
      
      await ProductCategory.bulkCreate(
        req.body.categoryIds.map(categoryId => ({
          productId: id,
          categoryId
        })),
        {transaction: t}
      );
    }


    //Handle images 
    if (req.body.images?.length) {
      const existingImages = req.body.images.filter(img => img.id);
      const newImages = req.body.images.filter(img => !img.id);

      // Update existing images
      await Promise.all(
        existingImages.map((img, index) =>
          Image.update(
            {order: index},
            {
              where: { id: img.id, productId: id},
              transaction: t
            }
          )
        )
      );

      // Create new images
      await Image.bulkCreate(
        newImages.map((img, index) => ({
          url: img.url,
          thubnail: img.thumbnail,
          productId: id,
          order: existingImages.length + index
        })),
        {transaction: t}
      );
    }
    
    await t.commit();

    // Fetch updated product with images
    const updatedProduct = await Product.findByPk(id, {
      include: [
        {model: Image, as: 'productImages', order: [['order', 'ASC']]}
      ]
    });

    res.json(updatedProduct);
  } catch(err) {
    await t.rollback();
    console.error('Edit product error:', err);
    res.status(500).json({
      error: 'Failed to edit product',
      details: err.message
    });
  }
};


// Delete product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Fulfill order
exports.fulfillOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = 'fulfilled';
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fulfill order' });
  }
};

// Get sales report
exports.getSalesReport = async (req, res) => {
  const { period } = req.query;
  try {
    let startDate;
    const endDate = new Date();

    switch (period) {
      case 'daily':
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      default:
        return res.status(400).json({ error: 'Invalid period' });
    }

    const salesReport = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        },
        status: 'Delivered'
      },
      attributes: [
        [db.fn('SUM', db.col('totalAmount')), 'totalSales'],
        [db.fn('COUNT', db.col('id')), 'orderCount']
      ]
    });

    res.json(salesReport[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate sales report' });
  }
};

// Get low stock alerts
exports.getLowStockAlerts = async (req, res) => {
  try {
    const lowStockProducts = await Product.findAll({
      where: {
        stock: {
          [Op.lte]: 10
        }
      }
    });
    res.json(lowStockProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch low stock alerts' });
  }
};

// Update stock

exports.updateStock = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Validate stock value
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'Invalid stock value' });
    }

    await product.update({ stock });
    res.json(product);
  } catch (err) {
    console.error('Stock update error:', err);
    res.status(500).json({ error: 'Failed to update stock' });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }
    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

// Refund order
exports.refundOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.status !== 'completed') {
      return res.status(400).json({ error: 'Order cannot be refunded' });
    }
    order.status = 'refunded';
    await order.save();
    // Here you would typically integrate with a payment gateway to process the refund
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to refund order' });
  }
};


// Function to get all admin users
exports.getAllAdmins = async (req, res) => {
  try {
    let admins;
    if (req.user.role === 'superadmin') {
      // Superadmins can see all admins
      admins = await User.findAll({
        where: { role: 'admin' },
        attributes: ['id', 'username', 'email', 'role']
      });
    } else if (req.user.role === 'admin') {
      // Regular admins can see all admins except superadmins
      admins = await User.findAll({
        where: { role: 'admin' },
        attributes: ['id', 'username', 'email', 'role']
      });
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(admins);
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
};


// Function to change user role
exports.changeUserRole = async (req, res) => {
  const { userId, newRole } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.role = newRole;
    await user.save();

    // Send email notification
    await sendEmail(
      user.email,
      'Your role has been updated',
      `Your role has been changed to ${newRole}`
    );

    res.json({ message: 'User role updated successfully', user });
  } catch (err) {
    console.error('Error changing user role:', err);
    res.status(500).json({ error: 'Failed to change user role' });
  }
};


// Argon2 options
const argon2Options = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 3,
  parallelism: 1
};

// JWT configurations
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Function to create a new admin account
exports.createAdminAccount = async (req, res) => {
  console.log("Entering creatadminaccount function..");
  const { username, email, password } = req.body;

  try {
    console.log("Entering creatadminaccount function try block..");
    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Hash password with Argon2
    const hashedPassword = await argon2.hash(password, argon2Options);

    // Create new admin user with the hashed password
    const newAdmin = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { id: newAdmin.id, username: newAdmin.username, role: newAdmin.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
      { id: newAdmin.id },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send welcome email to the new admin
    await sendEmail(
      newAdmin.email,
      'Welcome to the Admin Team',
      `Hello ${newAdmin.username},\n\nYour admin account has been successfully created. Welcome to the team!`
    );
    console.log("email sent..");

    // Respond with admin info and access token
    res.status(201).json({
      message: 'Admin account created successfully',
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role
      },
      accessToken
    });

  } catch (err) {
    console.error('Error creating admin account:', err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Invalid input data', details: err.errors });
    }
    res.status(500).json({ error: 'Failed to create admin account' });
  }
};

// ------------------------------------------------------------



// Function to promote existing user to admin
exports.promoteToAdmin = async (req, res) => {
  const { email } = req.body;
  
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'User is already an admin' });
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();

    // Send notification email
    await sendEmail(
      user.email,
      'You Have Been Promoted to Admin',
      `Hello ${user.username},

You have been promoted to admin status on our e-commerce platform. You can now access the admin dashboard and manage the platform.

Your existing login credentials will continue to work, but you'll now have access to additional administrative features.

Best regards,
The Admin Team`
    );

    res.json({
      message: 'User successfully promoted to admin',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Error promoting user to admin:', err);
    res.status(500).json({ error: 'Failed to promote user to admin' });
  }
};

// superadmin fucntions..
// Superadmin: Remove admin
exports.removeAdmin = async (req, res) => {
  const { username, email } = req.body;
  try {
    const admin = await User.findOne({
      where: {
        username,
        email,
        role: 'admin'
      }
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found or user is not an admin' });
    }

    admin.role = 'user';
    await admin.save();

    // Send notification email
    await sendEmail(
      admin.email,
      'Your Admin Status Has Been Revoked',
      `Hello ${admin.username},\n\nYour admin privileges have been revoked. You now have regular user access to the platform.\n\nIf you have any questions, please contact the superadmin team.\n\nBest regards,\nThe Superadmin Team`
    );

    res.json({ message: 'Admin status removed successfully', user: admin });
  } catch (err) {
    console.error('Error removing admin status:', err);
    res.status(500).json({ error: 'Failed to remove admin status' });
  }
};

// Superadmin: Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({
      where: {
        role: 'admin'
      },
      attributes: ['id', 'username', 'email']
    });
    res.json(admins);
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
};




// orders logic funcitons--------------------

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { 
    status,
    estimatedDate
  } = req.body;

  console.log('Request body received:', req.body);

  const validStatuses = ['Processing', 'Shipping', 'Delivering', 'Delivered', 'Completed'];

  if (!validStatuses.includes(status)) {
    console.warn(`[WARNING] Invalid status update attempt: ${status} for Order ID: ${id}`);
    return res.status(400).json({ 
      errorCode: 'INVALID_STATUS',
      message: `'${status}' is not a valid order status. Valid statuses are: ${validStatuses.join(', ')}.`, 
      providedStatus: status 
    });
  }

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      console.warn(`[WARNING] Order not found for update attempt. Order ID: ${id}`);
      return res.status(404).json({ 
        errorCode: 'ORDER_NOT_FOUND',
        message: `No order found with ID '${id}'. Please check the order ID and try again.`,
        orderId: id
      });
    }

    const statusProgression = ['Processing', 'Shipping', 'Delivering', 'Delivered', 'Completed'];
    const currentStatusIndex = statusProgression.indexOf(order.status);
    const newStatusIndex = statusProgression.indexOf(status);

    if (newStatusIndex <= currentStatusIndex) {
      console.warn(`[WARNING] Invalid status transition. Current: ${order.status}, Attempted: ${status}, Order ID: ${id}`);
      return res.status(400).json({ 
        errorCode: 'INVALID_STATUS_TRANSITION',
        message: `Cannot transition from '${order.status}' to '${status}'. Status transitions must move forward.`,
        currentStatus: order.status,
        attemptedStatus: status
      });
    }

    let updatedEstimatedDate = null;
    const previousStatus = order.status;
    
    if (status === 'Delivered') {
      updatedEstimatedDate = moment().utc().toDate();
      console.info(`[INFO] Automatically setting current date and time for 'Delivered' status.`);
    } else if (estimatedDate) {
      try {
        const parsedDate = moment(estimatedDate);
        
        if (parsedDate.isValid()) {
          updatedEstimatedDate = parsedDate.utc().toDate();
          
          console.log('Input local time:', estimatedDate);
          console.log('Converted to UTC:', updatedEstimatedDate);
          console.log('UTC ISO String:', updatedEstimatedDate.toISOString());
        } else {
          console.warn(`[WARNING] Invalid date format for estimatedDate: ${estimatedDate}`);
        }
      } catch (dateError) {
        console.error('[ERROR] Error parsing estimated date:', dateError);
      }
    }

    console.info(`[INFO] Status validation successful. Updating Order ID: ${id} to '${status}'`);

    await order.update({
      status,
      estimatedDate: updatedEstimatedDate
    });

    // Handle Verified Purchases
    if (status === 'Delivered' && previousStatus === 'Delivering') {
      console.log('[INFO] Creating verified purchase records...');
      
      const orderItems = await OrderItems.findAll({
        where: { orderId: id },
        attributes: ['productId'],
        raw: true
      });

      if (orderItems.length > 0) {
        const purchaseRecords = orderItems.map(item => ({
          userId: order.userId,
          productId: item.productId,
          orderId: id
        }));

        console.log('[INFO] Creating verified purchase records:', JSON.stringify(purchaseRecords, null, 2));
        
        await VerifiedPurchase.bulkCreate(purchaseRecords, {
          ignoreDuplicates: true
        });
        
        console.log('[SUCCESS] Created verified purchase records');
      } else {
        console.warn(`[WARNING] No order items found for Order ID: ${id}`);
      }
    }

    if (status === 'Delivering') {
      console.info(`[INFO] Sending delivery notification email for Order ID: ${id}.`);
      const user = await User.findByPk(order.userId);
      if (!user) {
        console.warn(`[WARNING] No user found for Order ID: ${id}. Delivery email not sent.`);
      } else {
        await sendDeliveryNotificationEmail(user, order);
      }
    }

    console.info(`[INFO] Broadcasting status update for Order ID: ${id}`);
    broadcastOrderStatusUpdate(id, status, updatedEstimatedDate);

    console.info(`[SUCCESS] Order ID: ${id} status updated to '${status}' successfully.`);
    res.json({ 
      message: 'Order status updated successfully', 
      order 
    });

  } catch (error) {
    console.error(`[ERROR] Error updating order status for Order ID: ${id}.`, error);
    res.status(500).json({ 
      errorCode: 'SERVER_ERROR',
      message: 'An unexpected error occurred while updating the order status.',
      details: error.message
    });
  }
};

// WebSocket broadcast function
const broadcastOrderStatusUpdate = (orderId, status, estimatedDate) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ 
        type: 'order_status_update', 
        orderId, 
        status, 
        estimatedDate 
      }));
    }
  });
};

// Get single product by ID


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          through: { attributes: [] },
          attributes: ['id', 'name', 'isMainCategory'],
          as: 'categories'
        },
        {
          model: Image,
          as: 'productImages',
          attributes: ['id', 'url', 'thumbnail', 'order'], // Include thumbnail
          order: [['order', 'ASC']]
        }
      ]
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    const productData = product.toJSON();
    
    // Format the response for frontend expectations
    const response = {
      ...productData,
      sellingPrice: productData.price * (1 - (productData.discountPercentage / 100)),
      mainImage: { url: productData.imageUrl }, // Map imageUrl to mainImage
      images: productData.productImages || [] // Map productImages to images
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

exports.uploadMainImage = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    // Validate file
    if (!file) return res.status(400).json({ error: 'No image uploaded' });
    if (!file.mimetype.startsWith('image/')) return res.status(400).json({ error: 'Invalid file type' });
    if (file.size > 5 * 1024 * 1024) return res.status(400).json({ error: 'File size exceeds 5MB' });

    // Upload to ImgBB
    const imgBBFormData = new FormData();
    imgBBFormData.append('image', file.buffer.toString('base64'));
    const imgBBResponse = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEW_IMGBB_API_KEY}`, imgBBFormData, {
      headers: imgBBFormData.getHeaders(),
      params: { resize: '250,250,cover' }
    });

    const imageUrl = imgBBResponse.data.data.url;

    // Update product
    await Product.update({ imageUrl }, { where: { id } });

    res.json({ imageUrl });
  } catch (error) {
    console.error('Main image upload error:', error);
    res.status(500).json({ error: 'Failed to upload main image' });
  }
};






















const OLD_IMGBB_API_KEY = process.env.OLD_IMGBB_API_KEY; // Replace with your old API key
const NEW_IMGBB_API_KEY = process.env.NEW_IMGBB_API_KEY; // Replace with your new API key




// Helper function to upload an image using the new API key
const uploadImage = async (base64Image, resizeOptions = null) => {
  const payload = { image: base64Image };
  if (resizeOptions) {
    payload.resize = resizeOptions;
  }

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${NEW_IMGBB_API_KEY}`,
    payload,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );


  return response.data.data;
};

// Helper function to fetch an image using the new API key, falling back to the old key if needed
const fetchImage = async (imageId) => {
  try {
    // Try fetching with the new API key
    const response = await axios.get(`https://api.imgbb.com/1/image/${imageId}?key=${NEW_IMGBB_API_KEY}`);
    return response.data.data.url;
  } catch (error) {
    if (error.response?.status === 404 || error.response?.data?.error?.code === 100) {
      // Fallback to the old API key
      const response = await axios.get(`https://api.imgbb.com/1/image/${imageId}?key=${OLD_IMGBB_API_KEY}`);
      return response.data.data.url;
    }
    throw error; // Re-throw if it's not a 404 or rate limit error
  }
};

exports.uploadThumbnails = async (req, res) => {
  try {
    const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = req.files.filter(f => !allowedFormats.includes(f.mimetype));

    if (invalidFiles.length > 0) {
      return res.status(400).json({
        error: 'Unsupported file type',
        details: `We only accept: ${allowedFormats.join(',')}`
      });
    }

    console.log('Raw files received:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files received' });
    }

    const uploadedImages = [];
    for (const file of req.files) {
      // Convert buffer to base64
      const base64Image = file.buffer.toString('base64');

      // Upload thumbnail using the new API key
      const thumbnailResponse = await uploadImage(base64Image, {
        width: 50,
        height: 50,
        method: 'cover' // Ensures exact dimensions
      });

      console.log("ImgBB Thumbnail Response:", thumbnailResponse);

      // Upload full-resolution image using the new API key
      const fullImageResponse = await uploadImage(base64Image, {
        width: 100,
        height: 100,
        method: 'inside' // Maintains aspect ratio
      });

      console.log("ImgBB fullImage Response:", fullImageResponse);

      // Save to database
      const image = await Image.create({
        url: fullImageResponse.url,
        thumbnail: thumbnailResponse.thumb.url, // Use the correct thumbnail URL
        productId: req.params.id,
        order: uploadedImages.length
      });

      uploadedImages.push(image);
    }

    // Fetch logic for existing images (if needed)
    const existingImageIds = req.body.existingImageIds || []; // Pass existing image IDs from the frontend
    const fetchedImages = [];
    for (const imageId of existingImageIds) {
      try {
        const imageUrl = await fetchImage(imageId);
        fetchedImages.push({ id: imageId, url: imageUrl });
      } catch (error) {
        console.error(`Failed to fetch image ${imageId}:`, error);
        fetchedImages.push({ id: imageId, error: 'Failed to fetch image' });
      }
    }

    // Send response to frontend
    res.json({
      success: true,
      message: 'Images uploaded and fetched successfully',
      uploadedImages: uploadedImages.map(img => ({
        id: img.id,
        url: img.url,
        thumbnail: img.thumbnail,
        order: img.order
      })),
      fetchedImages: fetchedImages
    });
  } catch (error) {
    console.error('Full upload error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    res.status(500).json({
      error: 'Upload failed',
      details: error.message
    });
  }
};
exports.deleteImage = async (req, res) => {
  try {
    await Image.destroy({
      where: {
        id: req.params.imageId,
        productId: req.params.productId
      }
    });
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

module.exports = exports;
