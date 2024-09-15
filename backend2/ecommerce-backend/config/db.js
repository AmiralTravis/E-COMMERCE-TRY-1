// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// pool.on('connect', () => {
//   console.log('Connected to the database');
// });

// module.exports = {
//   query: (text, params) => pool.query(text, params),
// };


// require('dotenv').config();

// const config = {
//   development: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST || '127.0.0.1',
//     dialect: 'postgres', // or 'mysql', 'sqlite', etc.
//   },
//   test: {
//     username: process.env.DB_TEST_USER,
//     password: process.env.DB_TEST_PASSWORD,
//     database: process.env.DB_TEST_NAME,
//     host: process.env.DB_TEST_HOST || '127.0.0.1',
//     dialect: 'postgres', // or 'mysql', 'sqlite', etc.
//   },
//   production: {
//     username: process.env.DB_PROD_USER,
//     password: process.env.DB_PROD_PASSWORD,
//     database: process.env.DB_PROD_NAME,
//     host: process.env.DB_PROD_HOST || '127.0.0.1',
//     dialect: 'postgres', // or 'mysql', 'sqlite', etc.
//   },
// };

// module.exports = config;


require('dotenv').config(); // Ensure dotenv is required to load environment variables

const config = {
  development: {
    username: process.env.DB_USER || 'postgres', 
    password: process.env.DB_PASSWORD || 'edb is good with sql', 
    database: process.env.DB_NAME || 'ECOMMERCEkadatabase', // Case-sensitive database name
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres', // or other dialects like 'mysql', 'sqlite', etc.
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

module.exports = config;
