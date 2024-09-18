'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      { 
        id: 1, // Explicit ID for foreign key reference
        username: 'john_doe', 
        email: 'john@example.com', 
        password: 'hashedpassword', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id: 2, // Explicit ID for foreign key reference
        username: 'jane_doe', 
        email: 'jane@example.com', 
        password: 'hashedpassword', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
