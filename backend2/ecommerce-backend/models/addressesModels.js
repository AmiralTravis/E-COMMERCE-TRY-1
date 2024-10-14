// // models/addressesModels.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Address = sequelize.define('Address', {
//   userId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: 'Users',
//       key: 'id',
//     },
//   },
//   street: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   city: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   state: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   postalCode: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   country: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// }, {
//   timestamps: true,
// });

// module.exports = Address;

module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  return Address;
};