'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Wishlists', [
      { userId: 1, productId: 1, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, productId: 2, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Wishlists', null, {});
  }
};
