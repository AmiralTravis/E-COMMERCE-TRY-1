// models/cartModels.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Carts = sequelize.define('Carts', { // Changed from CartItem to Carts
  userId: {
    type: DataTypes.INTEGER,
    field: 'userId',
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    field: 'productId',
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

module.exports = Carts; // Export Carts
