// // repositories/userRepository.js

// const { sequelize } = require('../models'); // Adjust the path according to your project structure

// class UserRepository {
//   // Use raw query to find user by username
//   async findUserByUsername(username) {
//     const [user] = await sequelize.query(
//       `SELECT id, username, password FROM "Users" WHERE username = :username`,
//       {
//         replacements: { username },
//         type: sequelize.QueryTypes.SELECT,
//       }
//     );
//     return user;
//   }

//   // Other methods can go here, e.g., createUser, getAllUsers, etc.
// }

// module.exports = new UserRepository();
