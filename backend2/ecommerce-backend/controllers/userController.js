// controllers/userController.js

const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure environment variables are loaded
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key'; // JWT secret key
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'; // Refresh token secret key

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// // Login user
// exports.loginUser = async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
//     const user = result.rows[0];

//     if (!user) {
//       console.error('User not found:', username); // Log if the user is not found
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     if (await bcrypt.compare(password, user.password)) {
//       // Generate a new access token and refresh token
//       const accessToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
//       const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' }); // Optional: Use separate secret for refresh token

//       // Set the refresh token in a cookie (optional)
//       res.cookie('refreshToken', refreshToken, { httpOnly: true });

//       // Respond with both tokens
//       res.status(200).json({
//         message: 'Login successful',
//         accessToken, // Send back the access token
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid username or password' });
//     }
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Failed to login user' });
//   }
// };

// Login user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      console.error('User not found:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (await bcrypt.compare(password, user.password)) {
      // Generate a new access token and refresh token
      const accessToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

      // Set the tokens in cookies
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
        accessToken // Send back the access token
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
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
    const result = await db.query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
      [username, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
