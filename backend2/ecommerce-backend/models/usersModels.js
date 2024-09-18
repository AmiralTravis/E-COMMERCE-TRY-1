// // models/usersModels.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const User = sequelize.define('User', {
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
//   passwordHash: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   isAdmin: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
// }, {
//   timestamps: true,
// });

// module.exports = User;


// models/usersModels.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');
// const bcrypt = require('bcryptjs');

// const User = sequelize.define('User', {
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
//   passwordHash: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   isAdmin: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
// }, {
//   timestamps: true,
//   hooks: {
//     // Hook for hashing the password before creating a new user
//     beforeCreate: async (user) => {
//       if (user.passwordHash) {
//         const salt = await bcrypt.genSalt(10);
//         user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
//       }
//     },
//     // Hook for hashing the password if it's updated
//     beforeUpdate: async (user) => {
//       if (user.passwordHash) {
//         const salt = await bcrypt.genSalt(10);
//         user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
//       }
//     }
//   }
// });

// // Custom method to compare passwords
// User.prototype.validatePassword = async function (password) {
//   return await bcrypt.compare(password, this.passwordHash);
// };

// module.exports = User;


// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');
// const bcrypt = require('bcryptjs');

// const User = sequelize.define('User', {
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
//   passwordHash: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   isAdmin: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
// }, {
//   timestamps: true,
//   hooks: {
//     // Hook for hashing the password before creating a new user
//     beforeCreate: async (user) => {
//       if (user.passwordHash) {
//         const salt = await bcrypt.genSalt(10);
//         user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
//       }
//     },
//     // Hook for hashing the password if it's updated
//     beforeUpdate: async (user) => {
//       if (user.passwordHash) {
//         const salt = await bcrypt.genSalt(10);
//         user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
//       }
//     }
//   }
// });

// // Custom method to compare passwords
// User.prototype.validatePassword = async function (password) {
//   return await bcrypt.compare(password, this.passwordHash);
// };

// module.exports = User;


// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db'); // Import the Sequelize instance
// const bcrypt = require('bcryptjs');

// // Define the User model
// const User = sequelize.define('User', {
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
//   passwordHash: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   isAdmin: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
// }, {
//   timestamps: true, // Automatically adds createdAt and updatedAt timestamps
//   hooks: {
//     // Hook to hash the password before creating a new user
//     beforeCreate: async (user) => {
//       if (user.passwordHash) {
//         const salt = await bcrypt.genSalt(10);
//         user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
//       }
//     },
//     // Hook to hash the password before updating it
//     beforeUpdate: async (user) => {
//       if (user.passwordHash && user.changed('passwordHash')) { // Hash only if password is changed
//         const salt = await bcrypt.genSalt(10);
//         user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
//       }
//     }
//   }
// });

// // Custom method to validate passwords
// User.prototype.validatePassword = async function (password) {
//   return await bcrypt.compare(password, this.passwordHash);
// };

// // Sync model with database (optional, can be removed in production)
// sequelize.sync()
//   .then(() => console.log('User model synced with the database'))
//   .catch((err) => console.error('Error syncing User model:', err));

// module.exports = User;


// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db'); // Import the Sequelize instance
// const bcrypt = require('bcryptjs');

// // Define the User model
// const User = sequelize.define('User', {
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
//     type: DataTypes.STRING, // Changed to 'password'
//     allowNull: false,
//   },
//   isAdmin: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
// }, {
//   timestamps: true, // Automatically adds createdAt and updatedAt timestamps
//   hooks: {
//     // Hook to hash the password before creating a new user
//     beforeCreate: async (user) => {
//       if (user.password) { // Changed to 'password'
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(user.password, salt); // Changed to 'password'
//       }
//     },
//     // Hook to hash the password before updating it
//     beforeUpdate: async (user) => {
//       if (user.password && user.changed('password')) { // Hash only if password is changed
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(user.password, salt); // Changed to 'password'
//       }
//     }
//   }
// });

// // Custom method to validate passwords
// User.prototype.validatePassword = async function (password) {
//   return await bcrypt.compare(password, this.password); // Changed to 'password'
// };

// // Sync model with database (optional, can be removed in production)
// sequelize.sync()
//   .then(() => console.log('User model synced with the database'))
//   .catch((err) => console.error('Error syncing User model:', err));

// module.exports = User;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import the Sequelize instance
const bcrypt = require('bcryptjs');

// Define the User model
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
  password: { // Updated from passwordHash to password
    type: DataTypes.STRING,
    allowNull: false,
  },
  // isAdmin: {
  //   type: DataTypes.BOOLEAN,
  //   defaultValue: false,
  // },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  hooks: {
    // Hook to hash the password before creating a new user
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    // Hook to hash the password before updating it
    beforeUpdate: async (user) => {
      if (user.password && user.changed('password')) { // Hash only if password is changed
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Custom method to validate passwords
User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Sync model with database (optional, can be removed in production)
sequelize.sync()
  .then(() => console.log('User model synced with the database'))
  .catch((err) => console.error('Error syncing User model:', err));

module.exports = User;
