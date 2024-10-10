// // models/index.js
// const Product = require('./productsModels');
// const User = require('./usersModels');
// const Order = require('./ordersModels');
// const CartItem = require('./cartModels');
// const Review = require('./reviewsModels');
// const Category = require('./categoriesModels');
// const Address = require('./addressesModels');
// const Payment = require('./paymentsModels');
// const Wishlist = require('./wishlistsModels');
// const Admin = require('./adminModels');

// // Define relationships
// Product.belongsTo(Category);
// Category.hasMany(Product);

// Product.hasMany(Review);
// Review.belongsTo(Product);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(CartItem);
// CartItem.belongsTo(User);

// Product.belongsToMany(User, { through: Wishlist });
// User.belongsToMany(Product, { through: Wishlist });

// Order.hasMany(Payment);
// Payment.belongsTo(Order);

// User.hasMany(Address);
// Address.belongsTo(User);

// module.exports = {
//   Product,
//   User,
//   Order,
//   CartItem,
//   Review,
//   Category,
//   Address,
//   Payment,
//   Wishlist,
//   Admin,
// };

const Product = require('./productsModels');
const User = require('./usersModels');
const Order = require('./ordersModels');
const CartItem = require('./cartModels');
const Review = require('./reviewsModels');
const Category = require('./categoriesModels');
const Address = require('./addressesModels');
const Payment = require('./paymentsModels');
const Wishlist = require('./wishlistsModels');
const Admin = require('./adminModels');

// Define relationships
Product.belongsTo(Category);
Category.hasMany(Product);

Product.hasMany(Review);
Review.belongsTo(Product);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(CartItem);
CartItem.belongsTo(User);

// New association: Product <-> CartItem
Product.hasMany(CartItem, {
  foreignKey: 'productId',
  as: 'cartItems'
});

CartItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

Product.belongsToMany(User, { through: Wishlist });
User.belongsToMany(Product, { through: Wishlist });

Order.hasMany(Payment);
Payment.belongsTo(Order);

User.hasMany(Address);
Address.belongsTo(User);

module.exports = {
  Product,
  User,
  Order,
  CartItem,
  Review,
  Category,
  Address,
  Payment,
  Wishlist,
  Admin,
};
