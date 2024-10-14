// // models/ordersModels.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Order = sequelize.define('Order', {
//   userId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: 'Users',
//       key: 'id',
//     },
//   },
//   totalAmount: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   status: {
//     type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled'),
//     defaultValue: 'Pending',
//   },
// }, {
//   timestamps: true,
// });

// module.exports = Order;

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled'),
      defaultValue: 'Pending',
    },
  }, {
    timestamps: true,
  });

  return Order;
};