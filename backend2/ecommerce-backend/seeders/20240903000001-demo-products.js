// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkInsert('Products', [
//       { name: 'Smartphone', description: 'Latest model', price: 699.99, categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Laptop', description: 'Powerful performance', price: 1299.99, categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Novel', description: 'Bestseller', price: 19.99, categoryId: 2, createdAt: new Date(), updatedAt: new Date() }
//     ], {});
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Products', null, {});
//   }
// };


'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      { id: 1, name: 'Smartphone', description: 'Latest model', price: 699.99, categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Laptop', description: 'Powerful performance', price: 1299.99, categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Novel', description: 'Bestseller', price: 19.99, categoryId: 2, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
