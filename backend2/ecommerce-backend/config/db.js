// config/db.js
require('dotenv').config(); // Ensure dotenv is required to load environment variables
const { Sequelize } = require('sequelize'); // Import Sequelize

// Define configurations for different environments
const config = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'edb is good with sql',
    database: process.env.DB_NAME || 'ECOMMERCEkadatabase', // Case-sensitive database name
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_TEST_USER || 'postgres',
    password: process.env.DB_TEST_PASSWORD || 'edb is good with sql',
    database: process.env.DB_TEST_NAME || 'ECOMMERCEka_test', // Case-sensitive test DB name
    host: process.env.DB_TEST_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_PROD_USER || 'postgres',
    password: process.env.DB_PROD_PASSWORD || 'edb is good with sql',
    database: process.env.DB_PROD_NAME || 'ECOMMERCEka_production', // Case-sensitive production DB name
    host: process.env.DB_PROD_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
};

// Select the current environment (development by default)
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];

// Initialize Sequelize with the current environment's config
const sequelize = new Sequelize(
  currentConfig.database,
  currentConfig.username,
  currentConfig.password,
  {
    host: currentConfig.host,
    dialect: currentConfig.dialect,
    logging: console.log, // Enable logging
    // Add more detailed logging
    dialectOptions: {
      debug: true
    }
    // logging: false, // Disable logging; you can enable it if needed
  }
);

// Test the connection (optional)
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Error connecting to database:', err));

// Export both the Sequelize instance and the config
module.exports = sequelize;
module.exports.config = config;
