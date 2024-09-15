// models/paymentsModels.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
  orderId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Orders',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Completed', 'Failed'),
    defaultValue: 'Pending',
  },
}, {
  timestamps: true,
});

module.exports = Payment;
