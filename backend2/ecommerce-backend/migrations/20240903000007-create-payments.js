// module.exports = {
//     up: async (queryInterface, Sequelize) => {
//       await queryInterface.createTable('Payments', {
//         id: {
//           type: Sequelize.INTEGER,
//           autoIncrement: true,
//           primaryKey: true,
//           allowNull: false,
//         },
//         orderId: {
//           type: Sequelize.INTEGER,
//           references: {
//             model: 'Orders',
//             key: 'id',
//           },
//           onDelete: 'CASCADE',
//         },
//         paymentMethod: {
//           type: Sequelize.STRING,
//           allowNull: false,
//         },
//         amount: {
//           type: Sequelize.FLOAT,
//           allowNull: false,
//         },
//         paymentDate: {
//           type: Sequelize.DATE,
//           defaultValue: Sequelize.NOW,
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
//       await queryInterface.dropTable('Payments');
//     },
//   };
  

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Orders',  // The table name that the foreign key references
          key: 'id',        // The column name in the Orders table that this foreign key references
        },
        onDelete: 'CASCADE',  // Optional: Action when the referenced record is deleted
        allowNull: false,     // Ensures the column cannot be null
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      paymentDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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
    await queryInterface.dropTable('Payments');
  },
};
