// // ecommerce-backend/routes/auth.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/usersModels');
// const userController = require('../controllers/userController');
// const { authenticateToken } = require('../middleware/authMiddleware');

// const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
// const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

// // Debugging logs to ensure functions are imported correctly
// console.log('registerUser:', userController.registerUser);
// console.log('loginUser:', userController.loginUser);

// // Registration route
// router.post('/register', userController.registerUser);

// // Login route
// router.post('/login', userController.loginUser);

// // Forgot password route
// router.post('/forgot-password', userController.forgotPassword);

// // Reset password route
// router.post('/reset-password', userController.resetPassword);

// // Change password route (requires authentication)
// router.post('/change-password', authenticateToken, userController.changePassword);

// // Refresh token route
// router.post('/refresh', authenticateToken, async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).json({ message: 'No refresh token' });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
//     const user = await User.findOne({
//       where: { id: decoded.id },
//       attributes: ['id', 'username']
//     });

//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     const accessToken = jwt.sign(
//       { id: user.id, username: user.username },
//       ACCESS_TOKEN_SECRET,
//       { expiresIn: '15m' }
//     );

//     res.cookie('accessToken', accessToken, {
//       maxAge: 15 * 60 * 1000,
//       httpOnly: true,
//       sameSite: 'lax',
//       secure: process.env.NODE_ENV === 'production'
//     });

//     res.json({
//       message: 'Token refreshed successfully',
//       user: {
//         id: user.id,
//         username: user.username
//       }
//     });
//   } catch (error) {
//     console.error('Refresh token error:', error);
//     res.status(401).json({ message: 'Invalid refresh token' });
//   }
// });

// // Verify token route
// router.get('/verify', authenticateToken, (req, res) => {
//   res.json({ user: req.user });
// });

// // Logout route
// router.post('/logout', (req, res) => {
//   res.clearCookie('accessToken', {
//     httpOnly: true,
//     sameSite: 'lax',
//     secure: process.env.NODE_ENV === 'production'
//   });

//   res.clearCookie('refreshToken', {
//     httpOnly: true,
//     sameSite: 'lax',
//     secure: process.env.NODE_ENV === 'production'
//   });

//   res.json({ message: 'Logout successful' });
// });

// module.exports = router;

// ecommerce-backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/usersModels');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

// Debugging logs to ensure functions are imported correctly
console.log('registerUser:', userController.registerUser);
console.log('loginUser:', userController.loginUser);

// Registration route
router.post('/register', userController.registerUser);

// Login route
router.post('/login', userController.loginUser);

// Seller registration route (requires authentication)
router.post('/register-seller', userController.registerUser);

// Forgot password route
router.post('/forgot-password', userController.forgotPassword);

// Reset password route
router.post('/reset-password', userController.resetPassword);

// Change password route (requires authentication)
router.post('/change-password', authenticateToken, userController.changePassword);

// Refresh token route
router.post('/refresh', authenticateToken, async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: ['id', 'username']
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('accessToken', accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({
      message: 'Token refreshed successfully',
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Verify token route
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  res.json({ message: 'Logout successful' });
});

module.exports = router;