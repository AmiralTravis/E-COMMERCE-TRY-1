'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Payments', [
      { orderId: 1, amount: 699.99, paymentMethod: 'Credit Card', createdAt: new Date(), updatedAt: new Date() },
      { orderId: 2, amount: 1299.99, paymentMethod: 'PayPal', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Payments', null, {});
  }
};
