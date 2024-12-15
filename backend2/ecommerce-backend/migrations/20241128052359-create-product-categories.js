'use strict';

// migrations/YYYYMMDDHHMMSS-create-product-categories.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, remove the categoryId from Products table
    await queryInterface.removeColumn('Products', 'categoryId');

    // Then create the junction table
    await queryInterface.createTable('ProductCategories', {
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Products',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });

    // Add a composite primary key
    await queryInterface.addConstraint('ProductCategories', {
      fields: ['productId', 'categoryId'],
      type: 'primary key',
      name: 'product_categories_pkey'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // First drop the junction table
    await queryInterface.dropTable('ProductCategories');

    // Then add back the categoryId column
    await queryInterface.addColumn('Products', 'categoryId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Categories',
        key: 'id'
      },
      onDelete: 'SET NULL'
    });
  }
};
