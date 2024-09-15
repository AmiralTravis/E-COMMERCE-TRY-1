// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkInsert('Orders', [
//       { userId: 1, total: 699.99, status: 'Processing', createdAt: new Date(), updatedAt: new Date() },
//       { userId: 2, total: 1299.99, status: 'Shipped', createdAt: new Date(), updatedAt: new Date() }
//     ], {});
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Orders', null, {});
//   }
// };

// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkInsert('Orders', [
//       {
//         userId: 1,
//         totalAmount: 100.50,  // Use totalAmount
//         status: 'Pending',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         userId: 2,
//         totalAmount: 200.75,  // Use totalAmount
//         status: 'Completed',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       // Add more entries as needed
//     ], {});
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Orders', null, {});
//   }
// };


// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkInsert('Orders', [
//       {
//         userId: 1,
//         totalAmount: 100.50,  // Use totalAmount
//         status: 'Pending',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         userId: 2,
//         totalAmount: 200.75,  // Use totalAmount
//         status: 'Completed',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       // Add more entries as needed
//     ], {});
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Orders', null, {});
//   }
// };

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Orders', [
      {
        id: 1,
        userId: 1,
        totalAmount: 100.50,
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: 2,
        totalAmount: 200.75,
        status: 'Completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more entries as needed
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
