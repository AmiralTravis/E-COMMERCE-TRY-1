// const sequelize = require('./config/db');
// const User = require('./models/usersModels');

// async function testDatabase() {
//     try {
//         // Test database connection
//         await sequelize.authenticate();
//         console.log('Database connection successful');

//         // Test User model and query
//         const users = await User.findAll();
//         console.log('Users found:', users.length);
//         console.log('First user:', users[0] ? users[0].toJSON() : 'No users found');
        
//     } catch (error) {
//         console.error('Database test failed:', error);
//     } finally {
//         await sequelize.close();
//     }
// }

// testDatabase();

const sequelize = require('./config/db');
const User = require('./models/usersModels');

async function testDatabase() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connection successful');

        // Test User model and query
        const users = await User.findAll();
        console.log('Users found:', users.length);
        console.log('First user:', users[0] ? users[0].username : 'No users found');
        
    } catch (error) {
        console.error('Database test failed:', error);
    } finally {
        await sequelize.close();
    }
}

testDatabase();