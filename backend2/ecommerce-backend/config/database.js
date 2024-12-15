// config/config.js
require('dotenv').config(); // Ensure environment variables are loaded

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'edbisgoodwithsql',
    database: process.env.DB_NAME || 'ECOMMERCEkadatabase',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_TEST_USER || 'postgres',
    password: process.env.DB_TEST_PASSWORD || 'edbisgoodwithsql',
    database: process.env.DB_TEST_NAME || 'ECOMMERCEka_test',
    host: process.env.DB_TEST_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_PROD_USER || 'postgres',
    password: process.env.DB_PROD_PASSWORD || 'edbisgoodwithsql',
    database: process.env.DB_PROD_NAME || 'ECOMMERCEka_production',
    host: process.env.DB_PROD_HOST || '127.0.0.1',
    dialect: 'postgres',
  }
};
