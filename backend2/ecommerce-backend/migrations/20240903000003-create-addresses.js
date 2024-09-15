// module.exports = {
//     up: async (queryInterface, Sequelize) => {
//       await queryInterface.createTable('Addresses', {
//         id: {
//           type: Sequelize.INTEGER,
//           autoIncrement: true,
//           primaryKey: true,
//           allowNull: false,
//         },
//         userId: {
//           type: Sequelize.INTEGER,
//           references: {
//             model: 'Users',
//             key: 'id',
//           },
//           onDelete: 'CASCADE',
//         },
//         addressLine1: {
//           type: Sequelize.STRING,
//           allowNull: false,
//         },
//         addressLine2: {
//           type: Sequelize.STRING,
//           allowNull: true,
//         },
//         city: {
//           type: Sequelize.STRING,
//           allowNull: false,
//         },
//         state: {
//           type: Sequelize.STRING,
//           allowNull: false,
//         },
//         postalCode: {
//           type: Sequelize.STRING,
//           allowNull: false,
//         },
//         country: {
//           type: Sequelize.STRING,
//           allowNull: false,
//         },
//         createdAt: {
//           type: Sequelize.DATE,
//           defaultValue: Sequelize.NOW,
//         },
//         updatedAt: {
//           type: Sequelize.DATE,
//           defaultValue: Sequelize.NOW,
//         },
//       });
//     },
  
//     down: async (queryInterface) => {
//       await queryInterface.dropTable('Addresses');
//     },
//   };
  


// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('Addresses', {
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false,
//       },
//       userId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//       },
//       street: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       city: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       state: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       zipCode: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       createdAt: {
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.NOW,
//       },
//       updatedAt: {
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.NOW,
//       },
//     });
//   },

//   down: async (queryInterface) => {
//     await queryInterface.dropTable('Addresses');
//   },
// };


'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Addresses', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Addresses');
  },
};