module.exports = {
    up: async (queryInterface, Sequelize) => {
      // Add foreign key constraint to Addresses
      await queryInterface.addConstraint('Addresses', {
        fields: ['userId'],
        type: 'foreign key',
        name: 'fk_addresses_users',
        references: {
          table: 'Users',
          field: 'id',
        },
        onDelete: 'CASCADE',
      });
    },
  
    down: async (queryInterface) => {
      await queryInterface.removeConstraint('Addresses', 'fk_addresses_users');
    },
  };
  