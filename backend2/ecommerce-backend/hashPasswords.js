const argon2 = require('argon2');

// List of usernames and plaintext passwords
const users = [
    { username: 'John', password: 'john123' },
    { username: 'James', password: 'james123' },
    { username: 'Ahmed', password: 'ahmed123' },
    { username: 'Maria', password: 'maria123' },
    { username: 'David', password: 'david123' },
    { username: 'Sarah', password: 'sarah123' },
    { username: 'Michael', password: 'michael123' },
    { username: 'Emily', password: 'emily123' },
    { username: 'Daniel', password: 'daniel123' },
    { username: 'Laura', password: 'laura123' },
    { username: 'Robert', password: 'robert123' },
    { username: 'Sophia', password: 'sophia123' },
    { username: 'William', password: 'william123' },
    { username: 'Olivia', password: 'olivia123' },
    { username: 'Joseph', password: 'joseph123' },
    { username: 'Emma', password: 'emma123' },
    { username: 'Charles', password: 'charles123' },
    { username: 'Ava', password: 'ava123' },
    { username: 'Thomas', password: 'thomas123' },
    { username: 'Mia', password: 'mia123' },
    { username: 'Christopher', password: 'christopher123' },
    { username: 'Amelia', password: 'amelia123' },
    { username: 'Matthew', password: 'matthew123' },
    { username: 'Isabella', password: 'isabella123' },
    { username: 'Andrew', password: 'andrew123' },
    { username: 'Charlotte', password: 'charlotte123' },
    { username: 'Joshua', password: 'joshua123' },
    { username: 'Harper', password: 'harper123' },
    { username: 'Ethan', password: 'ethan123' },
    { username: 'Evelyn', password: 'evelyn123' },
    { username: 'Ryan', password: 'ryan123' },
    { username: 'Abigail', password: 'abigail123' },
    { username: 'Nathan', password: 'nathan123' },
    { username: 'Ella', password: 'ella123' },
    { username: 'Jacob', password: 'jacob123' },
    { username: 'Scarlett', password: 'scarlett123' },
    { username: 'Logan', password: 'logan123' },
    { username: 'Grace', password: 'grace123' },
    { username: 'Owen', password: 'owen123' },
    { username: 'Lily', password: 'lily123' },
    { username: 'Samuel', password: 'samuel123' },
    { username: 'Chloe', password: 'chloe123' },
    { username: 'Gabriel', password: 'gabriel123' },
    { username: 'Zoey', password: 'zoey123' },
    { username: 'Caleb', password: 'caleb123' },
    { username: 'Madison', password: 'madison123' },
    { username: 'Isaac', password: 'isaac123' },
    { username: 'Riley', password: 'riley123' },
    { username: 'Luke', password: 'luke123' },
    { username: 'Avery', password: 'avery123' }
];

// Function to hash passwords
async function hashPasswords() {
    try {
        const hashedUsers = await Promise.all(
            users.map(async (user) => {
                const hashedPassword = await argon2.hash(user.password);
                return { ...user, hashedPassword };
            })
        );

        // Log the results
        console.log('Hashed Users:');
        console.log(hashedUsers);

        // Optionally, save the results to a file or use them in your SQL command
    } catch (err) {
        console.error('Error hashing passwords:', err);
    }
}

// Run the script
hashPasswords();