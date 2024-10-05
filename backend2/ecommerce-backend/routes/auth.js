// const express = require('express');
// const User = require('../models/usersModels');
// const router = express.Router();
// const jwt = require('jsonwebtoken');

// const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// router.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;
//   console.log('Register attempt:', { username, email });

//   try {
//     const user = await User.create({ username, email, password });
//     const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1d' });
    
//     console.log('User registered successfully:', { id: user.id, username: user.username });
//     res.status(201).json({
//       message: 'User registered successfully',
//       token,
//       user: { id: user.id, username: user.username, email: user.email }
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       return res.status(400).json({ message: 'Username or email already exists' });
//     }
//     res.status(500).json({ message: 'Error registering user', error: error.message });
//   }
// });

// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   console.log('Login attempt:', { username });

//   try {
//     const user = await User.findOne({ where: { username } });
//     console.log('User found:', user ? 'Yes' : 'No');

//     if (user && await user.validatePassword(password)) {
//       const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1d' });
      
//       console.log('Login successful:', { id: user.id, username: user.username });
//       res.status(200).json({
//         message: 'Login successful',
//         token,
//         user: { id: user.id, username: user.username, email: user.email }
//       });
//     } else {
//       console.log('Login failed: Invalid username or password');
//       res.status(401).json({ message: 'Invalid username or password' });
//     }
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Error logging in', error: error.message });
//   }
// });

// module.exports = router;















// const express = require('express');
// const User = require('../models/usersModels');
// const router = express.Router();
// const jwt = require('jsonwebtoken');

// const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// router.post('/login', async (req, res) => {
//   try {
//     console.log('=== Login Request Started ===');
//     console.log('Request body:', req.body);
    
//     if (!req.body.username || !req.body.password) {
//       console.log('Missing credentials in request');
//       return res.status(400).json({ message: 'Username and password are required' });
//     }

//     const { username, password } = req.body;
//     console.log('Searching for user:', username);
    
//     const user = await User.findOne({ 
//       where: { username },
//       // Temporarily include password for login
//       attributes: {
//         include: ['password']
//       }
//     });
    
//     console.log('User found:', user ? 'Yes' : 'No');

//     if (!user) {
//       console.log('No user found with username:', username);
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     console.log('Validating password...');
//     const isValidPassword = await user.validatePassword(password);
//     console.log('Password valid:', isValidPassword ? 'Yes' : 'No');

//     if (!isValidPassword) {
//       console.log('Invalid password for user:', username);
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     console.log('Creating JWT token...');
//     const token = jwt.sign(
//       { id: user.id, username: user.username },
//       SECRET_KEY,
//       { expiresIn: '1d' }
//     );
    
//     console.log('Login successful for user:', username);
//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email
//       }
//     });

//   } catch (error) {
//     console.error('=== Login Error ===');
//     console.error('Error details:', error);
//     console.error('Error stack:', error.stack);
//     res.status(500).json({ 
//       message: 'Error logging in',
//       error: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// });

// module.exports = router;






const express = require('express');
const User = require('../models/usersModels');
const router = express.Router();
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

router.post('/login', async (req, res) => {
  console.log('=== Login Request Received ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  try {
    if (!req.body || !req.body.username || !req.body.password) {
      console.log('Invalid request body:', req.body);
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const { username, password } = req.body;
    console.log('Attempting to find user:', username);
    
    // Force synchronous logging in case of crash
    process.stdout.write('Querying database...\n');
    
    const user = await User.findOne({ 
      where: { username },
      attributes: {
        include: ['password']
      }
    });
    
    process.stdout.write('Database query complete\n');
    console.log('User found:', !!user);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = await user.validatePassword(password);
    console.log('Password validation result:', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1d' }
    );
    
    console.log('Login successful for:', username);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    // Force synchronous error logging
    process.stdout.write('=== Login Error ===\n');
    process.stdout.write(`Error message: ${error.message}\n`);
    process.stdout.write(`Stack trace: ${error.stack}\n`);
    
    res.status(500).json({ 
      message: 'Error logging in',
      error: error.message
    });
  }
});

module.exports = router;