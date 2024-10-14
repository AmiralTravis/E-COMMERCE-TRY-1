// // // models/usersModels.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');
// const bcrypt = require('bcryptjs');

// // Define the User model
// const User = sequelize.define('Users', { // Singular 'User'
//   username: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false,
//   },
//   password: { 
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// }, 
// //   {tableName: 'Users' // This explicitly tells Sequelize to use the "Users" table
// // },
//  {
//   timestamps: true,
//   freezeTableName: true, // Keep table name as 'Users' without pluralizing
//   hooks: {
//     beforeCreate: async (user) => {
//       if (user.password) {
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(user.password, salt);
//       }
//     },
//     beforeUpdate: async (user) => {
//       if (user.password && user.changed('password')) {
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(user.password, salt);
//       }
//     }
//   },
//   defaultScope: {
//     attributes: { exclude: ['password'] },
//   },
// });

// // Custom method to validate passwords
// User.prototype.validatePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// // Remove the findByUsername method if it's not needed for the raw query approach

// // Sync model with database (optional in development, should be removed in production)
// sequelize.sync()
//   .then(() => console.log('User model synced with the database'))
//   .catch((err) => console.error('Error syncing User model:', err));

// module.exports = User;

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'Users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.password && user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  });

  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};