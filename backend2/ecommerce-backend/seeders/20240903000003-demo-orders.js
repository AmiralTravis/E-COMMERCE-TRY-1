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
