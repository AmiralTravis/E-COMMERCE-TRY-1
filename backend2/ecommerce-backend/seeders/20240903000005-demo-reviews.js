'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Reviews', [
      { userId: 1, productId: 1, rating: 5, comment: 'Excellent!', createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, productId: 2, rating: 4, comment: 'Very good!', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};
