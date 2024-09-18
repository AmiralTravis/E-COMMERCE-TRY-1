// // routes/auth.js
// const express = require('express');
// const User = require('../models/usersModels'); // Adjust path as needed
// const router = express.Router();

// router.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const user = await User.create({
//       username,
//       email,
//       passwordHash: password, // Password in plain text, will be hashed
//     });

//     res.status(201).json({ message: 'User registered successfully', user });
//   } catch (error) {
//     res.status(500).json({ message: 'Error registering user', error });
//   }
// });

// module.exports = router;


// const express = require('express');
// const User = require('../models/usersModels');
// const router = express.Router();
// const jwt = require('jsonwebtoken');

// const SECRET_KEY = 'your-secret-key'; // Use a secure key

// // Registration route
// router.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const user = await User.create({
//       username,
//       email,
//       passwordHash: password, // Password in plain text, will be hashed
//     });

//     res.status(201).json({ message: 'User registered successfully', user });
//   } catch (error) {
//     res.status(500).json({ message: 'Error registering user', error });
//   }
// });

// // Login route
// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ where: { username } });

//     if (user && await user.validatePassword(password)) {
//       const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      
//       res.status(200).json({ message: 'Login successful', token });
//     } else {
//       res.status(401).json({ message: 'Invalid username or password' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error logging in', error });
//   }
// });

// module.exports = router;

// const express = require('express');
// const User = require('../models/usersModels');
// const router = express.Router();
// const jwt = require('jsonwebtoken');

// const SECRET_KEY = 'your-secret-key'; // Use a secure key

// // Registration route
// router.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const user = await User.create({
//       username,
//       email,
//       password, // Use 'password' field
//     });

//     res.status(201).json({ message: 'User registered successfully', user });
//   } catch (error) {
//     res.status(500).json({ message: 'Error registering user', error });
//   }
// });

// // Login route
// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ where: { username } });

//     if (user && await user.validatePassword(password)) {
//       const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      
//       res.status(200).json({ message: 'Login successful', token });
//     } else {
//       res.status(401).json({ message: 'Invalid username or password' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error logging in', error });
//   }
// });

// module.exports = router;

const express = require('express');
const User = require('../models/usersModels');
const router = express.Router();
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key'; // Use a secure key

// Registration route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password, // Updated from passwordHash to password
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (user && await user.validatePassword(password)) {
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;
