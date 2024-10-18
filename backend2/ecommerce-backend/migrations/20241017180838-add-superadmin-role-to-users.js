'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('user', 'admin', 'superadmin'), // Add 'superadmin' to the ENUM
      allowNull: false,
      defaultValue: 'user',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('user', 'admin'), // Remove 'superadmin' in case of rollback
      allowNull: false,
      defaultValue: 'user',
    });
  },
};
