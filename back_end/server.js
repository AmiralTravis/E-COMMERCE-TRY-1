// // Import required packages
// const express = require('express');
// const { Pool } = require('pg');
// require('dotenv').config(); // Load environment variables from .env file

// // Create an Express application
// const app = express();
// const port = process.env.PORT || 3000; // Default port if not specified

// // Set up PostgreSQL connection
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// // Define a simple route
// app.get('/', (req, res) => {
//   res.send('Welcome to the E-commerce API');
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


// Import required packages
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

// Create an Express application
const app = express();
const port = process.env.PORT || 3000; // Default port if not specified

// Set up PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(express.json());

// Import routes
const productRoutes = require('./routes/productRoutes');

// Use your routes
app.use('/api', productRoutes);

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
