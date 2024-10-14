// // models/categoriesModels.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Category = sequelize.define('Category', {
//   name: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false,
//   },
// }, {
//   timestamps: true,
// });

// module.exports = Category;
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  return Category;
};