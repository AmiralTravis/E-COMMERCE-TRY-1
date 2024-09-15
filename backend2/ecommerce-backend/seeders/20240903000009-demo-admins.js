// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkInsert('Admins', [
//       { username: 'admin', email: 'admin@example.com', password: 'hashedpassword', createdAt: new Date(), updatedAt: new Date() }
//     ], {});
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Admins', null, {});
//   }
// };

// 'use strict';

// const bcrypt = require('bcrypt');

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash('yourplaintextpassword', saltRounds);

//     await queryInterface.bulkInsert('Admins', [
//       {
//         username: 'admin',
//         email: 'admin@example.com',
//         passwordHash: hashedPassword, // Use passwordHash instead of password
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ], {});
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Admins', null, {});
//   }
// };


// 'use strict';

// const bcrypt = require('bcrypt');

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash('yourplaintextpassword', saltRounds);

//     await queryInterface.bulkInsert('Admins', [
//       {
//         name: 'adminUncle', // Add a valid name here
//         email: 'admin@example.com',
//         passwordHash: hashedPassword, // Use passwordHash instead of password
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ], {});
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkDelete('Admins', null, {});
//   }
// };


'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('yourplaintextpassword', saltRounds);

    await queryInterface.bulkInsert('Admins', [
      {
        name: 'adminUncle',
        username: 'adminUncle', // Add username field
        email: 'admin@example.com',
        passwordHash: hashedPassword, // Use passwordHash instead of password
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Admins', null, {});
  }
};
