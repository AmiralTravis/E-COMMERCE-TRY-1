'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Carts', [
      { userId: 1, productId: 1, quantity: 1, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, productId: 2, quantity: 1, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Carts', null, {});
  }
};
