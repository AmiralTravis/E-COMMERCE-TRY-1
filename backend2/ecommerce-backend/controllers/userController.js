// // // controllers/userController.js

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const db = require('../models'); // Import the db object from models/index.js
// const User = db.User; // Get the User model from the db object
// const { Sequelize, DataTypes,Op } = db.Sequelize; // Sequelize operators for conditions
// require('dotenv').config(); // Ensure environment variables are loaded
// const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key'; // JWT secret key
// const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'; // Refresh token secret key
// const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
// const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';
// const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
// // Get all users (Admin only)
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.json(users);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// };

// // Get a user by ID
// exports.getUserById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findByPk(id);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch user' });
//   }
// };

// // const config = {
// //   bcryptSaltRounds: 10 // You can adjust this number as needed
// // };

// // Register a new user
// // exports.registerUser = async (req, res) => {
// //   const { username, email, password } = req.body;

// //   try {
// //     // Check if username or email already exists
// //     const existingUser = await User.findOne({
// //       where: {
// //         [Op.or]: [{ username }, { email }]
// //       }
// //     });

// //     if (existingUser) {
// //       return res.status(409).json({ error: 'Username or email already exists' });
// //     }

// //     // Hash the password using a consistent salt rounds setting
// //     const hashedPassword = await bcrypt.hash(password, 10); // Ensure salt rounds are set correctly here

// //     // Create new user
// //     const newUser = await User.create({
// //       username,
// //       email,
// //       password: hashedPassword
// //     });

// //     // Generate a new access token and refresh token
// //     let accessToken, refreshToken;
// //     try {
// //       accessToken = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' });
// //       refreshToken = jwt.sign({ id: newUser.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
// //     } catch (error) {
// //       console.error('Error generating tokens:', error);
// //       return res.status(500).json({ message: 'Failed to generate tokens' });
// //     }

// //     // Set the tokens in cookies
// //     res.cookie('accessToken', accessToken, {
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === 'production',
// //       sameSite: 'lax',
// //       maxAge: 60 * 60 * 1000 // 1 hour
// //     });
// //     res.cookie('refreshToken', refreshToken, {
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === 'production',
// //       sameSite: 'lax',
// //       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
// //     });

// //     // Respond with user info and access token
// //     res.status(201).json({
// //       message: 'Registration successful',
// //       user: {
// //         id: newUser.id,
// //         username: newUser.username,
// //         email: newUser.email
// //       },
// //       accessToken // Send back the access token
// //     });
// //   } catch (err) {
// //     console.error('Registration error:', err);
// //     res.status(500).json({ error: 'Failed to register user' });
// //   }
// // };
// // exports.registerUser = async (req, res) => {
// //   const { username, email, password } = req.body;

// //   try {
// //     // Input validation
// //     if (!username || !email || !password) {
// //       return res.status(400).json({ error: 'All fields are required' });
// //     }

// //     // Email format validation
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (!emailRegex.test(email)) {
// //       return res.status(400).json({ error: 'Invalid email format' });
// //     }

// //     // Password strength check (example: at least 8 characters)
// //     if (password.length < 8) {
// //       return res.status(400).json({ error: 'Password must be at least 8 characters long' });
// //     }

// //     // Check if username or email already exists
// //     const existingUser = await User.findOne({
// //       where: {
// //         [Op.or]: [{ username }, { email }]
// //       }
// //     });

// //     if (existingUser) {
// //       return res.status(409).json({ error: 'Username or email already exists' });
// //     }

// //     // Hash the password
// //     const saltRounds = 10;
// //     const hashedPassword = await bcrypt.hash(password, saltRounds);

// //     // Create new user
// //     const newUser = await User.create({
// //       username,
// //       email,
// //       password: hashedPassword
// //     });

// //     // Generate tokens
// //     const accessToken = jwt.sign(
// //       { id: newUser.id, username: newUser.username },
// //       process.env.JWT_SECRET,
// //       { expiresIn: '1h' }
// //     );
// //     const refreshToken = jwt.sign(
// //       { id: newUser.id },
// //       process.env.JWT_REFRESH_SECRET,
// //       { expiresIn: '7d' }
// //     );

// //     // Set cookies
// //     res.cookie('accessToken', accessToken, {
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === 'production',
// //       sameSite: 'lax',
// //       maxAge: 60 * 60 * 1000 // 1 hour
// //     });
// //     res.cookie('refreshToken', refreshToken, {
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === 'production',
// //       sameSite: 'lax',
// //       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
// //     });

// //     // Respond with user info and access token
// //     res.status(201).json({
// //       message: 'Registration successful',
// //       user: {
// //         id: newUser.id,
// //         username: newUser.username,
// //         email: newUser.email
// //       },
// //       accessToken
// //     });
// //   } catch (err) {
// //     console.error('Registration error:', err);
// //     res.status(500).json({ error: 'Failed to register user' });
// //   }
// // };
// // exports.registerUser = async (req, res) => {
// //   const { username, email, password } = req.body;

// //   try {
// //     // Input validation
// //     if (!username || !email || !password) {
// //       return res.status(400).json({ error: 'All fields are required' });
// //     }

// //     // Email format validation
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (!emailRegex.test(email)) {
// //       return res.status(400).json({ error: 'Invalid email format' });
// //     }

// //     // Password strength check (example: at least 8 characters)
// //     if (password.length < 8) {
// //       return res.status(400).json({ error: 'Password must be at least 8 characters long' });
// //     }

// //     // Check if username or email already exists
// //     const existingUser = await User.findOne({
// //       where: {
// //         [Op.or]: [{ username }, { email }]
// //       }
// //     });

// //     if (existingUser) {
// //       return res.status(409).json({ error: 'Username or email already exists' });
// //     }

// //     // Hash the password using bcrypt with 10 rounds
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     // Create new user
// //     const newUser = await User.create({
// //       username,
// //       email,
// //       password: hashedPassword
// //     });

// //     // Generate tokens
// //     const accessToken = jwt.sign(
// //       { id: newUser.id, username: newUser.username },
// //       process.env.JWT_SECRET,
// //       { expiresIn: '1h' }
// //     );
// //     const refreshToken = jwt.sign(
// //       { id: newUser.id },
// //       process.env.JWT_REFRESH_SECRET,
// //       { expiresIn: '7d' }
// //     );

// //     // Set cookies
// //     res.cookie('accessToken', accessToken, {
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === 'production',
// //       sameSite: 'lax',
// //       maxAge: 60 * 60 * 1000 // 1 hour
// //     });
// //     res.cookie('refreshToken', refreshToken, {
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === 'production',
// //       sameSite: 'lax',
// //       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
// //     });

// //     // Respond with user info and access token
// //     res.status(201).json({
// //       message: 'Registration successful',
// //       user: {
// //         id: newUser.id,
// //         username: newUser.username,
// //         email: newUser.email
// //       },
// //       accessToken
// //     });
// //   } catch (err) {
// //     console.error('Registration error:', err);
// //     res.status(500).json({ error: 'Failed to register user' });
// //   }
// // };

// // Register a new user
// exports.registerUser = async (req, res) => {
//   const { username, email, password } = req.body;
//   console.log("entered password that eached register function:"+password);
//   try {
//     // Check if username or email already exists
//     const existingUser = await User.findOne({ 
//       where: { 
//         [Op.or]: [{ username }, { email }] 
//       } 
//     });

//     if (existingUser) {
//       return res.status(409).json({ error: 'Username or email already exists' });
//     }

//     // Initial hash
//     const initialHash = await bcrypt.hash(password, 10);

//     // Create new user with the initial hashed password
//     const newUser = await User.create({ username, email, password: initialHash });
//     console.log("hashed and saved once..initial hash:"+ initialHash);

//     // Immediately update the password with a fresh hash
//     console.log("initializing another hash wokrflow..");
//     const updatedHash = await bcrypt.hash(password, 10);
//     await newUser.update({ password: updatedHash });
//     console.log("hashed and hopefully saved for second time.. second hash:"+updatedHash)
//     // Generate tokens
//     const accessToken = jwt.sign(
//       { id: newUser.id, username: newUser.username }, 
//       JWT_SECRET, 
//       { expiresIn: ACCESS_TOKEN_EXPIRY }
//     );
//     const refreshToken = jwt.sign(
//       { id: newUser.id }, 
//       JWT_REFRESH_SECRET, 
//       { expiresIn: REFRESH_TOKEN_EXPIRY }
//     );

//     // Set cookies
//     res.cookie('accessToken', accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 15 * 60 * 1000 // 15 minutes
//     });
//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//     });

//     // Respond with user info and access token
//     res.status(201).json({
//       message: 'Registration successful',
//       user: {
//         id: newUser.id,
//         username: newUser.username,
//         email: newUser.email
//       },
//       accessToken
//     });

//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({ error: 'Failed to register user' });
//   }
// };



// // Login user
// // exports.loginUser = async (req, res) => {
// //   console.log("Entering loginUser function....");
// //   const { username, password } = req.body;

// //   // Log the received plain password for debugging purposes
// //   console.log('Attempting to log in with password:', password);

// //   try {
// //     console.log('Login attempt for username:', username);
// //     console.log('Received password (plain):', password); // Log the plain password for comparison

// //     // Use Sequelize ORM to find the user by username, explicitly including the password
// //     const user = await User.findOne({
// //       where: { username },
// //       attributes: ['id', 'username', 'password'] // Explicitly include the password
// //     });

// //     if (!user) {
// //       console.log('User not found for username:', username);
// //       return res.status(401).json({ message: 'Invalid username or password' });
// //     }

// //     console.log('User found:', user.id);
// //     console.log('Stored hashed password from DB:', user.password); // Log the stored hashed password from DB

// //     // For debugging, hash the incoming password using the same method (for comparison) but don't compare it manually
// //     const hashedLoginPassword = await bcrypt.hash(password, config.bcryptSaltRounds); // Use the same bcrypt salt rounds as in registration
// //     console.log('Hashed version of the incoming password (for comparison purposes):', hashedLoginPassword); // Log the hashed version of incoming password

// //     // Compare provided plain password with the stored hashed password in the database
// //     const validPassword = await bcrypt.compare(password, user.password); // bcrypt.compare handles the comparison
// //     console.log('Password validation result:', validPassword); // Log result of password comparison

// //     if (validPassword) {
// //       // Generate a new access token and refresh token
// //       let accessToken, refreshToken;
// //       try {
// //         accessToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
// //         refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
// //       } catch (error) {
// //         console.error('Error generating tokens:', error);
// //         return res.status(500).json({ message: 'Failed to generate tokens' });
// //       }

// //       // Set the tokens in cookies
// //       res.cookie('accessToken', accessToken, {
// //         httpOnly: true,
// //         secure: process.env.NODE_ENV === 'production',
// //         sameSite: 'lax',
// //         maxAge: 60 * 60 * 1000 // 1 hour
// //       });
// //       res.cookie('refreshToken', refreshToken, {
// //         httpOnly: true,
// //         secure: process.env.NODE_ENV === 'production',
// //         sameSite: 'lax',
// //         maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
// //       });

// //       // Respond with user info and access token
// //       res.status(200).json({
// //         message: 'Login successful',
// //         user: {
// //           id: user.id,
// //           username: user.username
// //         },
// //         accessToken // Send back the access token
// //       });
// //     } else {
// //       console.log('Invalid password for user:', username);
// //       res.status(401).json({ message: 'Invalid username or password' });
// //     }
// //   } catch (err) {
// //     console.error('Login error:', err);
// //     res.status(500).json({ error: 'Failed to login user' });
// //   }
// // };

// exports.loginUser = async (req, res) => {
//   console.log("Entering loginUser function....");
//   const { username, password } = req.body;

//   try {
//     // Input validation
//     if (!username || !password) {
//       return res.status(400).json({ error: 'Username and password are required' });
//     }

//     console.log('Login attempt for username:', username);

//     // Find the user by username
//     const user = await User.findOne({
//       where: { username },
//       attributes: ['id', 'username', 'password']
//     });

//     if (!user) {
//       console.log('User not found for username:', username);
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     console.log('User found:', user.id);

//     // Compare provided password with the stored hashed password
//     const validPassword = await bcrypt.compare(password, user.password);
//     console.log('Password validation result:', validPassword);

//     if (!validPassword) {
//       console.log('Invalid password for user:', username);
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     // Generate tokens
//     const accessToken = jwt.sign(
//       { id: user.id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );
//     const refreshToken = jwt.sign(
//       { id: user.id },
//       process.env.JWT_REFRESH_SECRET,
//       { expiresIn: '7d' }
//     );

//     // Set cookies
//     res.cookie('accessToken', accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 60 * 60 * 1000 // 1 hour
//     });
//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//     });

//     // Respond with user info and access token
//     res.status(200).json({
//       message: 'Login successful',
//       user: {
//         id: user.id,
//         username: user.username
//       },
//       accessToken
//     });

//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Failed to login user' });
//   }
// };



// // Update user details
// exports.updateUser = async (req, res) => {
//   const { id } = req.params;
//   const { username, email } = req.body;
//   try {
//     const [updated] = await User.update({ username, email }, {
//       where: { id },
//       returning: true // For PostgreSQL
//     });

//     if (updated) {
//       const updatedUser = await User.findByPk(id);
//       return res.json(updatedUser);
//     }

//     return res.status(404).json({ error: 'User not found' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to update user' });
//   }
// };

// // Delete a user
// exports.deleteUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deleted = await User.destroy({
//       where: { id }
//     });

//     if (deleted) {
//       return res.status(204).send();
//     }

//     return res.status(404).json({ error: 'User not found' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to delete user' });
//   }
// };


// controllers/userController.js

const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const db = require('../models'); // Import the db object from models/index.js
const User = db.User; // Get the User model from the db object
const { Sequelize, DataTypes, Op } = db.Sequelize; // Sequelize operators for conditions
require('dotenv').config(); // Ensure environment variables are loaded

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key'; // JWT secret key
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'; // Refresh token secret key
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

// Argon2 options
const argon2Options = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64 MiB
  timeCost: 3, // 3 iterations
  parallelism: 1
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Entered password that reached register function:" + password);
  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ username }, { email }] 
      } 
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Hash password with Argon2
    const hashedPassword = await argon2.hash(password, argon2Options);

    // Create new user with the hashed password
    const newUser = await User.create({ username, email, password: hashedPassword });
    console.log("Password hashed and saved with Argon2");

    // Generate tokens
    const accessToken = jwt.sign(
      { id: newUser.id, username: newUser.username }, 
      JWT_SECRET, 
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
      { id: newUser.id }, 
      JWT_REFRESH_SECRET, 
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Respond with user info and access token
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      },
      accessToken
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  console.log("Entering loginUser function....");
  const { username, password } = req.body;

  try {
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    console.log('Login attempt for username:', username);

    // Find the user by username
    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username', 'password']
    });

    if (!user) {
      console.log('User not found for username:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log('User found:', user.id);

    // Compare provided password with the stored hashed password using Argon2
    const validPassword = await argon2.verify(user.password, password);
    console.log('Password validation result:', validPassword);

    if (!validPassword) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Respond with user info and access token
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username
      },
      accessToken
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login user' });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    const [updated] = await User.update({ username, email }, {
      where: { id },
      returning: true // For PostgreSQL
    });

    if (updated) {
      const updatedUser = await User.findByPk(id);
      return res.json(updatedUser);
    }

    return res.status(404).json({ error: 'User not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await User.destroy({
      where: { id }
    });

    if (deleted) {
      return res.status(204).send();
    }

    return res.status(404).json({ error: 'User not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};