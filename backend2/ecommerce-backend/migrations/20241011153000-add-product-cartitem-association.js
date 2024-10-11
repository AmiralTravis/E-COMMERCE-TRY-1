'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column already exists before trying to add it
    const exists = await queryInterface.describeTable('CartItems');

    if (!exists.productId) {
      await queryInterface.addColumn('CartItems', 'productId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Products', // Make sure this matches your products table name
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Or 'CASCADE', based on your requirement
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('CartItems', 'productId');
  }
};
