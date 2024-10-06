// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Uncaught exception handler
// process.on('uncaughtException', (err) => {
//   console.error('=== Uncaught Exception ===');
//   console.error(err);
//   process.exit(1);
// });

// // Unhandled promise rejection handler
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('=== Unhandled Rejection ===');
//   console.error('Promise:', promise);
//   console.error('Reason:', reason);
// });

// // CORS configuration
// app.use(cors({
//   origin: ['http://localhost:4173', 'http://localhost:8080'],
//   credentials: true
// }));

// // Body parser middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Request logging middleware
// app.use((req, res, next) => {
//   console.log(`\n=== ${new Date().toISOString()} ===`);
//   console.log(`${req.method} ${req.url}`);
//   console.log('Headers:', req.headers);
//   console.log('Body:', req.body);
//   next();
// });

// // Test database connection immediately
// const sequelize = require('./config/db');
// const User = require('./models/usersModels');

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connection established successfully.');
    
//     // Test User model
//     const testUser = await User.findOne();
//     console.log('Test query successful. User found:', !!testUser);
//   } catch (err) {
//     console.error('Database connection error:', err);
//   }
// })();

// // Routes
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// // ... other route imports ...

// // Route error wrapper
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

// // Apply routes with error wrapper
// app.use('/api/auth', (req, res, next) => {
//   console.log('Auth route accessed');
//   next();
// }, wrapRoute(authRoutes));

// app.use('/api/users', wrapRoute(userRoutes));
// // ... other routes ...

// // 404 handler
// app.use((req, res, next) => {
//   console.log('404 - Route not found:', req.originalUrl);
//   res.status(404).json({ message: 'Route not found' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('=== Error Handler ===');
//   console.error('Error:', err);
//   console.error('Stack:', err.stack);
//   res.status(500).json({
//     message: 'Internal Server Error',
//     error: err.message,
//     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//   });
// });

// // Start server with error handling
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
//     sequelize.close().then(() => {
//       console.log('Database connection closed');
//       process.exit(0);
//     });
//   });
// });
























const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// CORS configuration
app.use(cors({
  origin: ['http://localhost:4173', 'http://localhost:8080', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`\n=== ${new Date().toISOString()} ===`);
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

const sequelize = require('./config/db');
const User = require('./models/usersModels');
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    const testUser = await User.findOne();
    console.log('Test query successful. User found:', !!testUser);
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', JSON.stringify(req.body));
  }
  next();
});

app.use((req, res, next) => {
  console.log(`\n=== New Request ===`);
  console.log(`${req.method} ${req.path}`);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  next();
});

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
const authenticateToken = require('./middleware/authMiddleware');

const wrapRoute = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.error('Route error:', err);
      next(err);
    }
  };
};

app.use('/api/auth', (req, res, next) => {
  console.log('Auth route accessed');
  next();
}, wrapRoute(authRoutes));

app.use('/api/products', productRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/cart', authenticateToken, cartRoutes);
app.use('/api/reviews', authenticateToken, reviewRoutes);
app.use('/api/categories', authenticateToken, categoryRoutes);
app.use('/api/addresses', authenticateToken, addressRoutes);
app.use('/api/payments', authenticateToken, paymentRoutes);
app.use('/api/wishlists', authenticateToken, wishlistRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use((req, res, next) => {
  console.log('404 - Route not found:', req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('=== Error Handler ===');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Server startup error:', err);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    sequelize.close().then(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
});