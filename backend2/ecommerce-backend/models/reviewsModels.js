// models/reviewsModels.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

module.exports = Review;
