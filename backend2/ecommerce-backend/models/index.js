// // // models/index.js
// // const Product = require('./productsModels');
// // const User = require('./usersModels');
// // const Order = require('./orders.Models');
// // const Carts = require('./cartModels'); // Updated reference to Carts
// // const Review = require('./reviewsModels');
// // const Category = require('./categoriesModels');
// // const Address = require('./addressesModels');
// // const Payment = require('./paymentsModels');
// // const Wishlist = require('./wishlistsModels');
// // const Admin = require('./adminModels');

// // Define relationships
// // Product.belongsTo(Category);
// // Category.hasMany(Product);

// // Product.hasMany(Review);
// // Review.belongsTo(Product);

// // User.hasMany(Order);
// // Order.belongsTo(User);

// // User.hasMany(Carts, {
// //   foreignKey: 'userId', // Explicitly set the foreign key name
// // }); // Updated to use Carts
// // Carts.belongsTo(User, {
// //   foreignKey: 'userId', // Explicitly define the foreign key
// //   as: 'user' // Optional alias for the relationship
// // });


// // // New association: Product <-> Carts
// // Product.hasMany(Carts, {
// //   foreignKey: 'productId',
// //   as: 'cartItems' // Alias for accessing Carts through Product
// // });

// // Carts.belongsTo(Product, {
// //   foreignKey: 'productId',
// //   as: 'product' // Alias for accessing Product from Carts
// // });

// // Product.belongsToMany(User, { through: Wishlist });
// // User.belongsToMany(Product, { through: Wishlist });

// // Order.hasMany(Payment);
// // Payment.belongsTo(Order);

// // User.hasMany(Address);
// // Address.belongsTo(User);

// // module.exports = {
// //   Product,
// //   User,
// //   Order,
// //   Carts, // Export Carts
// //   Review,
// //   Category,
// //   Address,
// //   Payment,
// //   Wishlist,
// //   Admin,
// // };
// // models/index.js
// const Sequelize = require('sequelize'); // Ensure Sequelize is imported
// const config = require('../config/config.js'); // Import config file

// // Determine the current environment (development, test, production)
// const env = process.env.NODE_ENV || 'development';
// const dbConfig = config[env]; // Get the configuration for the current environment

// // Initialize Sequelize with the correct configuration
// const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
//   host: dbConfig.host,
//   dialect: dbConfig.dialect,  // This is where dialect is explicitly set
//   logging: dbConfig.logging || console.log, // Optional: Log SQL queries (disabled in production)
// });

// const db = {};

// // Import models here
// db.Product = require('./productsModels')(sequelize, Sequelize.DataTypes);
// db.User = require('./usersModels')(sequelize, Sequelize.DataTypes);
// db.Order = require('./orders.Models')(sequelize, Sequelize.DataTypes);
// db.Carts = require('./cartModels')(sequelize, Sequelize.DataTypes);
// db.Review = require('./reviewsModels')(sequelize, Sequelize.DataTypes);
// db.Category = require('./categoriesModels')(sequelize, Sequelize.DataTypes);
// db.Address = require('./addressesModels')(sequelize, Sequelize.DataTypes);
// db.Payment = require('./paymentsModels')(sequelize, Sequelize.DataTypes);
// db.Wishlist = require('./wishlistsModels')(sequelize, Sequelize.DataTypes);
// db.Admin = require('./adminModels')(sequelize, Sequelize.DataTypes);

// // Define relationships
// Product.belongsTo(Category);
// Category.hasMany(Product);

// Product.hasMany(Review);
// Review.belongsTo(Product);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(Carts, {
//   foreignKey: 'userId', // Explicitly set the foreign key name
// }); // Updated to use Carts
// Carts.belongsTo(User, {
//   foreignKey: 'userId', // Explicitly define the foreign key
//   as: 'user' // Optional alias for the relationship
// });


// // New association: Product <-> Carts
// Product.hasMany(Carts, {
//   foreignKey: 'productId',
//   as: 'cartItems' // Alias for accessing Carts through Product
// });

// Carts.belongsTo(Product, {
//   foreignKey: 'productId',
//   as: 'product' // Alias for accessing Product from Carts
// });

// Product.belongsToMany(User, { through: Wishlist });
// User.belongsToMany(Product, { through: Wishlist });

// Order.hasMany(Payment);
// Payment.belongsTo(Order);

// User.hasMany(Address);
// Address.belongsTo(User);

// // Add the Sequelize instance to the db object
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

// models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config.js');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const db = {};

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Define relationships
db.Product.belongsTo(db.Category);
db.Category.hasMany(db.Product);

db.Product.hasMany(db.Review);
db.Review.belongsTo(db.Product);

db.User.hasMany(db.Order);
db.Order.belongsTo(db.User);

db.User.hasMany(db.Cart, {
  foreignKey: 'userId',
});
db.Cart.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user'
});

db.Product.hasMany(db.Cart, {
  foreignKey: 'productId',
  as: 'cartItems'
});
db.Cart.belongsTo(db.Product, {
  foreignKey: 'productId',
  as: 'product'
});

db.Product.belongsToMany(db.User, { through: db.Wishlist });
db.User.belongsToMany(db.Product, { through: db.Wishlist });

db.Order.hasMany(db.Payment);
db.Payment.belongsTo(db.Order);

db.User.hasMany(db.Address);
db.Address.belongsTo(db.User);

module.exports = db;