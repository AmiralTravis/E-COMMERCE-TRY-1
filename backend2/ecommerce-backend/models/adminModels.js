// // models/adminModels.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Admin = sequelize.define('Admin', {
//   userId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: 'Users',
//       key: 'id',
//     },
//     unique: true,
//   },
//   role: {
//     type: DataTypes.STRING,
//     defaultValue: 'Admin',
//   },
// }, {
//   timestamps: true,
// });

// module.exports = Admin;
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      unique: true,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'Admin',
    },
  }, {
    timestamps: true,
  });

  return Admin;
};