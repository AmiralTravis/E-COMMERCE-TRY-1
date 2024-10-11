// models/index.js
const Product = require('./productsModels');
const User = require('./usersModels');
const Order = require('./orders.Models');
const Carts = require('./cartModels'); // Updated reference to Carts
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

User.hasMany(Carts, {
  foreignKey: 'userId', // Explicitly set the foreign key name
}); // Updated to use Carts
Carts.belongsTo(User, {
  foreignKey: 'userId', // Explicitly define the foreign key
  as: 'user' // Optional alias for the relationship
});


// New association: Product <-> Carts
Product.hasMany(Carts, {
  foreignKey: 'productId',
  as: 'cartItems' // Alias for accessing Carts through Product
});

Carts.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product' // Alias for accessing Product from Carts
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
  Carts, // Export Carts
  Review,
  Category,
  Address,
  Payment,
  Wishlist,
  Admin,
};
