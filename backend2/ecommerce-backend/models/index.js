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
db.Product.belongsTo(db.Category, {
  foreignKey: 'categoryId' 
});
db.Category.hasMany(db.Product, { 
  foreignKey: 'categoryId' 
});

db.Product.hasMany(db.Review, { foreignKey: 'productId' });
db.Review.belongsTo(db.Product, { foreignKey: 'productId' });

db.User.hasMany(db.Order, { foreignKey: 'userId' });
db.Order.belongsTo(db.User, { foreignKey: 'userId' });

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