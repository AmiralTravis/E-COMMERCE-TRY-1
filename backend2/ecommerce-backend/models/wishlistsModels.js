// // models/wishlistsModels.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Wishlist = sequelize.define('Wishlist', {
//   userId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: 'Users',
//       key: 'id',
//     },
//   },
//   productId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: 'Products',
//       key: 'id',
//     },
//   },
// }, {
//   timestamps: true,
// });

// module.exports = Wishlist;
module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define('Wishlist', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Products',
        key: 'id',
      },
    },
  }, {
    timestamps: true,
  });

  return Wishlist;
};