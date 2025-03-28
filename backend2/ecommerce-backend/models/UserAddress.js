// // // ecommerce-backend/models/UserAddress.js

// const { DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   const UserAddress = sequelize.define('UserAddress', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     fullName: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: { isEmail: true }
//     },
//     phoneNumber: {
//       type: DataTypes.STRING,
//       allowNull: true, // Allow null if the phone number is optional
//       validate: {
//         len: [10, 20], // Basic validation for phone number length
//       }
//     },
//     addressLine1: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     addressLine2: {
//       type: DataTypes.STRING,
//       allowNull: true // Optional second address line
//     },
//     city: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     state: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     postalCode: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     country: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     isDefault: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     },
//     isTemporary: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     },
//     expiresAt: {
//       type: DataTypes.DATE,
//       allowNull: true
//     }
//   }, {
//     tableName: 'UserAddresses',
//     timestamps: true
//   });


//   // Associations
// UserAddress.associate = (models) => {
//   UserAddress.belongsTo(models.User, {
//     foreignKey: 'userId'
//   });
// };

//   return UserAddress;
// };


// // ecommerce-backend/models/UserAddress.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserAddress = sequelize.define('UserAddress', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true }
    },
    // phoneNumber: {
    //   type: DataTypes.STRING,
    //   allowNull: true, // Allow null if the phone number is optional
    //   validate: {
    //     len: [10, 20], // Basic validation for phone number length
    //   }
    // },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 15],
        is: /^[0-9]+$/
      }
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true // Optional second address line
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
       type: DataTypes.STRING,
       allowNull: false
     },
    countryCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'US'
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isTemporary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'UserAddresses',
    timestamps: true
  });


  // Associations
UserAddress.associate = (models) => {
  UserAddress.belongsTo(models.User, {
    foreignKey: 'userId'
  });
};

  return UserAddress;
};
