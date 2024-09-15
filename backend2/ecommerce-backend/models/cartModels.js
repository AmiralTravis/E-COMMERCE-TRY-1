// models/cartModels.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CartItem = sequelize.define('CartItem', {
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
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  timestamps: true,
});

module.exports = CartItem;
