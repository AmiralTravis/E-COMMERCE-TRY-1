// // // ecommerce-backend/server.js

// // const express = require('express');
// // const cors = require('cors');
// // const cookieParser = require('cookie-parser');
// // const bodyParser = require('body-parser');
// // require('dotenv').config();
// // const path = require('path'); // Add this line at the top
// // // const __profilePics = path.join(__dirname, '..', 'front_end', 'ecommerce-frontend', 'public', 'profile-pics'); // Construct absolute path
// // const __profilePics = path.join(__dirname, 'public', 'profile-pics'); // Serve from backend's public folder

// // const fileUpload = require('express-fileupload');
// // const rateLimit = require('express-rate-limit');
// // const compression = require('compression');


// // const limiter = rateLimit({
// //   windowMs: 15 * 60 * 1000, // 15 minutes
// //   max: 100 // Limit each IP to 100 requests per windowMs
// // });






// // // Create directory if it doesn't exist
// // const fs = require('fs');
// // if (!fs.existsSync(__profilePics)) {
// //   fs.mkdirSync(__profilePics, { recursive: true });
// // }

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // // const corsOptions = {
// // //   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
// // //   credentials: true,
// // //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// // //   allowedHeaders: ['Content-Type', 'Authorization'],
// // //   exposedHeaders: ['Set-Cookie'],
// // // };
// // const corsOptions = {
// //   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
// //   maxAge: 86400 // Cache CORS preflight requests
// // };

// // // Error handling for uncaught exceptions and unhandled rejections
// // process.on('uncaughtException', (err) => {
// //   console.error('=== Uncaught Exception ===');
// //   console.error(err);
// //   process.exit(1);
// // });

// // process.on('unhandledRejection', (reason, promise) => {
// //   console.error('=== Unhandled Rejection ===');
// //   console.error('Promise:', promise);
// //   console.error('Reason:', reason);
// // });

// // // Middleware setup
// // app.use(fileUpload({
// //   useTempFiles: false, // Set to true if you want to use temporary files
// //   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
// //   abortOnLimit: true, // Return 413 if file size exceeds limit
// // }));

// // app.use(limiter);
// // app.use(compression());



// // app.use(cookieParser(process.env.COOKIE_SECRET));
// // app.use(cors(corsOptions));
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));
// // app.use(bodyParser.json()); // Parse application/json for PayPal routes
// // // app.use('/api', captureOrderRoute); // Use your route under a specific path


// // // Request logging middleware
// // // app.use((req, res, next) => {
// // //   console.log('\n=== Request Details ===');
// // //   console.log('Method:', req.method);
// // //   console.log('Path:', req.path);
// // //   console.log('Cookies:', req.cookies);
// // //   console.log('Headers:', req.headers);
// // //   next();
// // // });

// // // Enhanced cookie configuration middleware
// // app.use((req, res, next) => {
// //   const originalSetCookie = res.cookie;
// //   res.cookie = function(name, value, options = {}) {
// //     const defaultOptions = {
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === 'production',
// //       sameSite: 'lax',
// //       path: '/',
// //       domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : 'localhost'
// //     };
    
// //     if (name === 'accessToken') {
// //       defaultOptions.maxAge = 15 * 60 * 1000; // 15 minutes
// //     } else if (name === 'refreshToken') {
// //       defaultOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
// //     } else {
// //       defaultOptions.maxAge = 24 * 60 * 60 * 1000; // 24 hours default
// //     }
    
// //     return originalSetCookie.call(this, name, value, { ...defaultOptions, ...options });
// //   };
// //   next();
// // });

// // app.use('/profile-pics', express.static('public/profile-pics'));











// // // ----------------------------------------------
// // // const path = require('path');
// // const multer = require('multer');


// // // Configure image storage
// // const imageStorage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     const uploadPath = path.join(__dirname, 'uploads');
// //     if (!fs.existsSync(uploadPath)) {
// //       fs.mkdirSync(uploadPath, { recursive: true });
// //     }
// //     cb(null, uploadPath);
// //   },
// //   filename: (req, file, cb) => {
// //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// //     cb(null, `${uniqueSuffix}-${file.originalname}`);
// //   }
// // });

// // // Add image upload middleware
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// // app.use(multer({
// //   storage: imageStorage,
// //   limits: {
// //     fileSize: 5 * 1024 * 1024 // 5MB
// //   },
// //   fileFilter: (req, file, cb) => {
// //     if (file.mimetype.startsWith('image/')) {
// //       cb(null, true);
// //     } else {
// //       cb(new Error('Only image files are allowed!'), false);
// //     }
// //   }
// // }).any());














// // // Database setup
// // const db = require('./models');
// // const { User, Cart } = db;

// // (async () => {
// //   try {
// //     // await db.sequelize.sync({ alter: true }); // Add sync with alter

// //     await db.sequelize.authenticate();
// //     console.log('Database connection established successfully.');
// //     // const testUser = await User.findOne();
// //     // console.log('Test user query successful. User found:', !!testUser);
// //     // const testCart = await Cart.findOne();
// //     // console.log('Test cart query successful. Cart found:', !!testCart);
// //   } catch (err) {
// //     console.error('Database connection error:', err);
// //   }
// // })();

// // // Route wrapper for error handling
// // const wrapRoute = (fn) => {
// //   return async (req, res, next) => {
// //     try {
// //       await fn(req, res, next);
// //     } catch (err) {
// //       console.error('Route error:', err);
// //       next(err);
// //     }
// //   };
// // };

// // // Route imports
// // const productRoutes = require('./routes/products');
// // const userRoutes = require('./routes/users');
// // const orderRoutes = require('./routes/orders');
// // const cartRoutes = require('./routes/cart');
// // const reviewRoutes = require('./routes/reviews');
// // const categoryRoutes = require('./routes/categories');
// // const addressRoutes = require('./routes/addresses');
// // const paymentRoutes = require('./routes/payments');
// // const wishlistRoutes = require('./routes/wishlists');
// // const adminRoutes = require('./routes/admin');
// // const authRoutes = require('./routes/auth');
// // const paypalRoutes = require('./routes/paypal'); // PayPal routes import
// // const captureOrderRoute = require('./routes/captureOrder'); // Adjust the path as necessary
// // const placeholder = require('./routes/placeholder');
// // const verifiedPurchaseRoutes = require('./routes/verifiedPurchases');
// // const { authenticateToken } = require('./middleware/authMiddleware');
// // const profileRoutes = require('./routes/profile');


// // // Apply authentication routes first (unprotected)
// // app.use('/api/auth', authRoutes);

// // // Public paths regex for unprotected routes
// // const publicPathsRegex = [
// //   /^\/auth\/login$/,
// //   /^\/auth\/register$/,
// //   /^\/auth\/refresh$/,
// //   /^\/products$/,
// //   /^\/categories$/,
// //   /^\/products\/[^\/]+\/reviews$/, // Existing pattern
// //   /^\/api\/reviews\/[^\/]+$/, // Add this line for GET /api/reviews/:productId
// // ];

// // // Authentication middleware for protected routes
// // app.use('/api', (req, res, next) => {
// //   console.log('=== Auth Middleware ===');
// //   console.log('Path:', req.path);
// //   console.log('Method:', req.method);
// //   console.log('Headers:', req.headers);

// //   const isPublicPath = publicPathsRegex.some((regex) => regex.test(req.path));

// //   if (isPublicPath || req.method === 'OPTIONS') {
// //     return next();
// //   }

// //   authenticateToken(req, res, next);
// // });

// // // Apply routes
// // app.use('/api/products', productRoutes);
// // app.use('/api/users', userRoutes);
// // app.use('/api/orders', orderRoutes);
// // app.use('/api/cart', cartRoutes);
// // app.use('/api/categories', categoryRoutes);
// // app.use('/api/addresses', addressRoutes);
// // app.use('/api/payments', paymentRoutes);
// // app.use('/api/wishlist', wishlistRoutes);
// // app.use('/api/admin', adminRoutes);
// // app.use('/api/paypal', paypalRoutes); // Apply PayPal routes
// // // app.use('/api', captureOrderRoute); // Use your route under a specific path
// // app.use('/api/paypal', captureOrderRoute);

// // app.use('/api/placeholder', placeholder);
// // app.use('/api/verified-purchases', verifiedPurchaseRoutes);
// // app.use('/api/reviews', reviewRoutes);
// // app.use('/api/profile', profileRoutes);
// // // server.js

// // // app.use('/api/profile-pics', express.static(__profilePics));
// // // Add these two static routes
// // app.use('/profile-pics', express.static(path.join(__dirname, 'public', 'profile-pics')));
// // app.use('/generated-avatars', express.static(path.join(__dirname, 'public', 'generated-avatars')));
// // // Add these static routes with caching headers
// // app.use('/profile-pics', express.static(
// //   path.join(__dirname, 'public/profile-pics'),
// //   { maxAge: '1y', immutable: true }
// // ));

// // app.use('/generated-avatars', express.static(
// //   path.join(__dirname, 'public/generated-avatars'),
// //   { maxAge: '1y', immutable: true }
// // ));



// // // Root route
// // app.get('/', (req, res) => {
// //   res.send('API is running...');
// // });

// // // 404 handler
// // app.use((req, res, next) => {
// //   console.log('404 - Route not found:', req.originalUrl);
// //   res.status(404).json({ message: 'Route not found' });
// // });

// // // Error handler
// // app.use((err, req, res, next) => {
// //   console.error('=== Error Handler ===');
// //   console.error('Error:', err);
// //   console.error('Stack:', err.stack);
  
// //   const error = process.env.NODE_ENV === 'production' 
// //     ? { message: 'Internal Server Error' }
// //     // : { message: err.message, stack: err.stack };
// //     : { 
// //       message: err.message,
// //       stack: process.env.DEBUG ? err.stack : undefined
// //     };
    
// //   res.status(err.status || 500).json(error);
// // });

// // // Server setup
// // const server = app.listen(PORT, () => {
// //   console.log(`Server running on http://localhost:${PORT}`);
// // }).on('error', (err) => {
// //   console.error('Server startup error:', err);
// // });

// // // Graceful shutdown
// // process.on('SIGTERM', () => {
// //   console.log('SIGTERM received. Shutting down gracefully...');
// //   server.close(() => {
// //     console.log('Server closed');
// //     db.sequelize.close().then(() => {
// //       console.log('Database connection closed');
// //       process.exit(0);
// //     });
// //   });
// // });

// // const ReceiptCleanup = require('./utils/receiptCleanup');

// // // Initialize cleanup utility
// // const receiptCleanup = new ReceiptCleanup();

// // // Start scheduled cleanup (runs every 12 hours by default)
// // receiptCleanup.startScheduledCleanup();

// // module.exports = app;

























































// // // // ecommerce-backend/server.js


// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// require('dotenv').config();
// const path = require('path');
// const fs = require('fs');
// const multer = require('multer');
// const sharp = require('sharp');
// const rateLimit = require('express-rate-limit');
// const compression = require('compression');
// const fileUpload = require('express-fileupload');

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Rate limiter configuration
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
// });

// // CORS configuration
// const corsOptions = {
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
//   maxAge: 86400, // Cache CORS preflight requests
// };

// // Error handling for uncaught exceptions and unhandled rejections
// process.on('uncaughtException', (err) => {
//   console.error('=== Uncaught Exception ===');
//   console.error(err);
//   process.exit(1);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('=== Unhandled Rejection ===');
//   console.error('Promise:', promise);
//   console.error('Reason:', reason);
// });

// // Middleware setup
// app.use(limiter);
// app.use(compression());
// app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // File upload middleware
// app.use(fileUpload({
//   useTempFiles: false, // Set to true if you want to use temporary files
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
//   abortOnLimit: true, // Return 413 if file size exceeds limit
// }));

// // Enhanced cookie configuration middleware
// app.use((req, res, next) => {
//   const originalSetCookie = res.cookie;
//   res.cookie = function (name, value, options = {}) {
//     const defaultOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       path: '/',
//       domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : 'localhost',
//     };

//     if (name === 'accessToken') {
//       defaultOptions.maxAge = 15 * 60 * 1000; // 15 minutes
//     } else if (name === 'refreshToken') {
//       defaultOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
//     } else {
//       defaultOptions.maxAge = 24 * 60 * 60 * 1000; // 24 hours default
//     }

//     return originalSetCookie.call(this, name, value, { ...defaultOptions, ...options });
//   };
//   next();
// });

// // Configure image storage
// const imageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

// // Add image upload middleware
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(multer({
//   storage: imageStorage,
//   limits: {
//     fileSize: parseInt(process.env.IMAGE_MAX_SIZE), // Use environment variable
//   },
//   fileFilter: (req, file, cb) => {
//     if (process.env.ALLOWED_IMAGE_TYPES.split(',').includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'), false);
//     }
//   },
// }).any());

// // Serve static files
// app.use('/profile-pics', express.static(path.join(__dirname, 'public', 'profile-pics')));
// app.use('/generated-avatars', express.static(path.join(__dirname, 'public', 'generated-avatars')));
// app.use('/product-images', express.static(path.join(__dirname, 'public', 'product-images')));

// // Database setup
// const db = require('./models');
// const { User, Cart } = db;

// (async () => {
//   try {
//     await db.sequelize.authenticate();
//     console.log('Database connection established successfully.');
//   } catch (err) {
//     console.error('Database connection error:', err);
//   }
// })();

// // Route wrapper for error handling
// const wrapRoute = (fn) => {
//   return async (req, res, next) => {
//     try {
//       await fn(req, res, next);
//     } catch (err) {
//       console.error('Route error:', err);
//       next(err);
//     }
//   };
// };

// // Route imports
// const productRoutes = require('./routes/products');
// const userRoutes = require('./routes/users');
// const orderRoutes = require('./routes/orders');
// const cartRoutes = require('./routes/cart');
// const reviewRoutes = require('./routes/reviews');
// const categoryRoutes = require('./routes/categories');
// const addressRoutes = require('./routes/addresses');
// const paymentRoutes = require('./routes/payments');
// const wishlistRoutes = require('./routes/wishlists');
// const adminRoutes = require('./routes/admin');
// const authRoutes = require('./routes/auth');
// const paypalRoutes = require('./routes/paypal');
// const captureOrderRoute = require('./routes/captureOrder');
// const placeholder = require('./routes/placeholder');
// const verifiedPurchaseRoutes = require('./routes/verifiedPurchases');
// const { authenticateToken } = require('./middleware/authMiddleware');
// const profileRoutes = require('./routes/profile');
// const imageRoutes = require('./routes/imageRoutes');

// // Apply authentication routes first (unprotected)
// app.use('/api/auth', authRoutes);

// // Public paths regex for unprotected routes
// const publicPathsRegex = [
//   /^\/auth\/login$/,
//   /^\/auth\/register$/,
//   /^\/auth\/refresh$/,
//   /^\/products$/,
//   /^\/categories$/,
//   /^\/products\/[^\/]+\/reviews$/, // Existing pattern
//   /^\/api\/reviews\/[^\/]+$/, // Add this line for GET /api/reviews/:productId
// ];

// // Authentication middleware for protected routes
// app.use('/api', (req, res, next) => {
//   console.log('=== Auth Middleware ===');
//   console.log('Path:', req.path);
//   console.log('Method:', req.method);
//   console.log('Headers:', req.headers);

//   const isPublicPath = publicPathsRegex.some((regex) => regex.test(req.path));

//   if (isPublicPath || req.method === 'OPTIONS') {
//     return next();
//   }

//   authenticateToken(req, res, next);
// });

// // Apply routes
// app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/addresses', addressRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/wishlist', wishlistRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/paypal', paypalRoutes);
// app.use('/api/paypal', captureOrderRoute);
// app.use('/api/placeholder', placeholder);
// app.use('/api/verified-purchases', verifiedPurchaseRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api', imageRoutes);


// // Root route
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// // 404 handler
// app.use((req, res, next) => {
//   console.log('404 - Route not found:', req.originalUrl);
//   res.status(404).json({ message: 'Route not found' });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error('=== Error Handler ===');
//   console.error('Error:', err);
//   console.error('Stack:', err.stack);

//   const error = process.env.NODE_ENV === 'production'
//     ? { message: 'Internal Server Error' }
//     : {
//         message: err.message,
//         stack: process.env.DEBUG ? err.stack : undefined,
//       };

//   res.status(err.status || 500).json(error);
// });

// // Server setup
// const server = app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// }).on('error', (err) => {
//   console.error('Server startup error:', err);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received. Shutting down gracefully...');
//   server.close(() => {
//     console.log('Server closed');
//     db.sequelize.close().then(() => {
//       console.log('Database connection closed');
//       process.exit(0);
//     });
//   });
// });

// const ReceiptCleanup = require('./utils/receiptCleanup');

// // Initialize cleanup utility
// const receiptCleanup = new ReceiptCleanup();

// // Start scheduled cleanup (runs every 12 hours by default)
// receiptCleanup.startScheduledCleanup();

// module.exports = app;































const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  maxAge: 86400, // Cache CORS preflight requests
};

// Error handling for uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  console.error('=== Uncaught Exception ===');
  console.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('=== Unhandled Rejection ===');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
});

// Middleware setup
app.use(limiter);
app.use(compression());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors(corsOptions));

// Configure express to handle multipart form data BEFORE JSON
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.json()); // For JSON data

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/profile-pics', express.static(path.join(__dirname, 'public', 'profile-pics')));
app.use('/generated-avatars', express.static(path.join(__dirname, 'public', 'generated-avatars')));
app.use('/product-images', express.static(path.join(__dirname, 'public', 'product-images')));

// Database setup
const db = require('./models');
const { User, Cart } = db;

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();

// Route imports
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const reviewRoutes = require('./routes/reviews');
const categoryRoutes = require('./routes/categories');
const addressRoutes = require('./routes/addresses');
const paymentRoutes = require('./routes/payments');
const wishlistRoutes = require('./routes/wishlists');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const paypalRoutes = require('./routes/paypal');
const captureOrderRoute = require('./routes/captureOrder');
const placeholder = require('./routes/placeholder');
const verifiedPurchaseRoutes = require('./routes/verifiedPurchases');
const { authenticateToken } = require('./middleware/authMiddleware');
const profileRoutes = require('./routes/profile');
const imageRoutes = require('./routes/imageRoutes');
const sellerRoutes = require('./routes/sellerRoutes');


// Apply authentication routes first (unprotected)
app.use('/api/auth', authRoutes);

// Public paths regex for unprotected routes
const publicPathsRegex = [
  /^\/auth\/login$/,
  /^\/auth\/register$/,
  /^\/auth\/refresh$/,
  /^\/products$/,
  /^\/categories$/,
  /^\/products\/[^\/]+\/reviews$/, // Existing pattern
  /^\/api\/reviews\/[^\/]+$/, // Add this line for GET /api/reviews/:productId
];

// Authentication middleware for protected routes
app.use('/api', (req, res, next) => {
  console.log('=== Auth Middleware ===');
  console.log('Path:', req.path);
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);

  const isPublicPath = publicPathsRegex.some((regex) => regex.test(req.path));

  if (isPublicPath || req.method === 'OPTIONS') {
    return next();
  }

  authenticateToken(req, res, next);
});

// Apply routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/paypal', captureOrderRoute);
app.use('/api/placeholder', placeholder);
app.use('/api/verified-purchases', verifiedPurchaseRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', imageRoutes);
app.use('/api/seller', sellerRoutes);


// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 404 handler
app.use((req, res, next) => {
  console.log('404 - Route not found:', req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('=== Error Handler ===');
  console.error('Error:', err);
  console.error('Stack:', err.stack);

  const error = process.env.NODE_ENV === 'production'
    ? { message: 'Internal Server Error' }
    : {
        message: err.message,
        stack: process.env.DEBUG ? err.stack : undefined,
      };

  res.status(err.status || 500).json(error);
});

// Server setup
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Server startup error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    db.sequelize.close().then(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
});

const ReceiptCleanup = require('./utils/receiptCleanup');

// Initialize cleanup utility
const receiptCleanup = new ReceiptCleanup();

// Start scheduled cleanup (runs every 12 hours by default)
receiptCleanup.startScheduledCleanup();

module.exports = app;
























