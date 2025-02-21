// // ecommerce-backend/models/index.js

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/database.js');

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

// Dynamically import all models in the models directory
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up associations here (you can remove associations from the model files)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Define relationships for models here (remove from individual model files)

// Product to Category many-to-many relationship
db.Product.belongsToMany(db.Category, { 
  through: db.ProductCategory,
  foreignKey: 'productId'
});
db.Category.belongsToMany(db.Product, { 
  through: db.ProductCategory,
  foreignKey: 'categoryId'
});

// Product to Review one-to-many relationship
db.Product.hasMany(db.Review, { foreignKey: 'productId' });
db.Review.belongsTo(db.Product, { foreignKey: 'productId' });

// User to Order one-to-many relationship
db.User.hasMany(db.Order, { foreignKey: 'userId' });
db.Order.belongsTo(db.User, { foreignKey: 'userId' });

// User to Cart one-to-many relationship
db.User.hasMany(db.Cart, {
  foreignKey: 'userId',
});
db.Cart.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user'
});

// Product to Cart one-to-many relationship
db.Product.hasMany(db.Cart, {
  foreignKey: 'productId',
  as: 'cartItems'
});
db.Cart.belongsTo(db.Product, {
  foreignKey: 'productId',
  as: 'product'
});

// User to Wishlist many-to-many relationship
db.Product.belongsToMany(db.User, { through: db.Wishlist });
db.User.belongsToMany(db.Product, { through: db.Wishlist });

// Order to Payment one-to-many relationship
db.Order.hasMany(db.Payment);
db.Payment.belongsTo(db.Order);

// User to UserAddress one-to-many relationship
db.User.hasMany(db.UserAddress, { foreignKey: 'userId' });
db.UserAddress.belongsTo(db.User, { foreignKey: 'userId' });

// Order to OrderItems one-to-many relationship
db.Order.hasMany(db.OrderItems, { foreignKey: 'orderId' });
db.OrderItems.belongsTo(db.Order, { foreignKey: 'orderId' });

// Product to OrderItems one-to-many relationship
db.Product.hasMany(db.OrderItems, { foreignKey: 'productId' });
db.OrderItems.belongsTo(db.Product, { foreignKey: 'productId' });

// VerifiedPurchase associations (User, Product, and Order)
db.User.hasMany(db.VerifiedPurchase, { foreignKey: 'userId' });
db.VerifiedPurchase.belongsTo(db.User, { foreignKey: 'userId' });

db.Product.hasMany(db.VerifiedPurchase, { foreignKey: 'productId' });
db.VerifiedPurchase.belongsTo(db.Product, { foreignKey: 'productId' });

db.Order.hasMany(db.VerifiedPurchase, { foreignKey: 'orderId' });
db.VerifiedPurchase.belongsTo(db.Order, { foreignKey: 'orderId' });

// Image associations
db.Image.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'imageUser', // Changed alias to 'imageUser' to avoid conflict
  constraints: false
});

db.Image.belongsTo(db.Product, {
  foreignKey: 'productId',
  as: 'imageProduct', // Changed alias to 'imageProduct' to avoid conflict
  constraints: false
});

db.User.hasOne(db.Image, {
  foreignKey: 'userId',
  as: 'avatar',
  scope: { type: 'avatar' }
});

db.Product.hasMany(db.Image, {
  foreignKey: 'productId',
  as: 'productImages', // Changed alias to 'productImages' to avoid conflict
  scope: { type: 'product' }
});

module.exports = db;
