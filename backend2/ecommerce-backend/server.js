// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Routes
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// // Import route files
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

// // Register routes
// app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/addresses', addressRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/wishlists', wishlistRoutes);
// app.use('/api/admin', adminRoutes);

// // Listen on Port
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import route files
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
const authRoutes = require('./routes/auth'); // Import auth routes
const authenticateToken = require('./middleware/authMiddleware'); // Import auth middleware

// Register routes
app.use('/api/auth', authRoutes); // Register auth routes
app.use('/api/products', authenticateToken, productRoutes); // Example: protect product routes
app.use('/api/users', authenticateToken, userRoutes); // Example: protect user routes
app.use('/api/orders', authenticateToken, orderRoutes); // Example: protect order routes
app.use('/api/cart', authenticateToken, cartRoutes); // Example: protect cart routes
app.use('/api/reviews', authenticateToken, reviewRoutes); // Example: protect review routes
app.use('/api/categories', authenticateToken, categoryRoutes); // Example: protect category routes
app.use('/api/addresses', authenticateToken, addressRoutes); // Example: protect address routes
app.use('/api/payments', authenticateToken, paymentRoutes); // Example: protect payment routes
app.use('/api/wishlists', authenticateToken, wishlistRoutes); // Example: protect wishlist routes
app.use('/api/admin', authenticateToken, adminRoutes); // Example: protect admin routes

// Public route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Listen on Port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
