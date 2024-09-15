// module.exports = {
//     up: async (queryInterface, Sequelize) => {
//       await queryInterface.createTable('Users', {
//         id: {
//           type: Sequelize.INTEGER,
//           autoIncrement: true,
//           primaryKey: true,
//           allowNull: false,
//         },
//         name: {
//           type: Sequelize.STRING,
//           allowNull: false,
//         },
//         email: {
//           type: Sequelize.STRING,
//           unique: true,
//           allowNull: false,
//         },
//         passwordHash: {
//           type: Sequelize.STRING,
//           allowNull: false,
//         },
//         addressId: {
//           type: Sequelize.INTEGER,
//           references: {
//             model: 'Addresses',
//             key: 'id',
//           },
//           onDelete: 'SET NULL',
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
//       await queryInterface.dropTable('Users');
//     },
//   };
  

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
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
    await queryInterface.dropTable('Users');
  },
};
