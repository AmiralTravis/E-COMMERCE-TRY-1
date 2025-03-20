// // ecommerce-backend/routes/users.js
// // const db = require('../config/db');
// const db = require('../models'); // Import the db object
// // const User = db.User; // Access the User model from the db object

// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');
// const {authenticateToken} = require('../middleware/authMiddleware'); // Import middleware
// // const User = require('../models/usersModels');
// const User = db.User;
// const imageRoutes = require('./imageRoutes');




// // Get all users (Admin only)
// // router.get('/', userController.getAllUsers);

// // Get a single user by ID
// // router.get('/:id', userController.getUserById);

// // Register a new user
// // router.post('/register', userController.registerUser);

// // Login user
// // router.post('/login', userController.loginUser);

// // Get current user's profile
// // router.get('/me', authenticateToken, async (req, res) => {
// //     try {
// //       const user = await User.findByPk(req.user.id, {
// //         attributes: { exclude: ['password'],
// //             include: ['profilePicUrl'] // Ensure this is included

// //          } // Exclude sensitive fields
        
// //       });
  
// //       if (!user) {
// //         return res.status(404).json({ error: 'User not found' });
// //       }
  
// //       res.json(user);
// //     } catch (error) {
// //       console.error('Error fetching user data:', error);
// //       res.status(500).json({ error: 'Failed to fetch user data' });
// //     }
// //   });
// router.get('/me', authenticateToken, async (req, res) => {
//     try {
//       const user = await User.findByPk(req.user.id, {
//         attributes: { 
//           exclude: ['password'],
//           include: ['profilePicUrl'] // Ensure this is explicitly included
//         }
//       });
      
//       // Force absolute URL
//       const profilePic = user.profilePicUrl.startsWith('http') 
//         ? user.profilePicUrl
//         : `${process.env.BASE_URL}${user.profilePicUrl}`;
  
//       res.json({
//         ...user.toJSON(),
//         profilePicUrl: profilePic
//       });
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       res.status(500).json({ error: 'Failed to fetch user data' });
//     }
//   });

// // router.put('/:id', authenticateToken, userController.updateUser); // Make sure the route is protected
// router.put('/:id', authenticateToken, async (req, res) => {
//     console.log('Update user request received:', req.params.id, req.body);
//     await userController.updateUser(req, res);
//   });


// router.use('/avatar', imageRoutes);

// // Update user information
// // router.put('/:id', userController.updateUser);

// // Delete a user by ID (Admin only)
// // router.delete('/:id', userController.deleteUser);

// module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware'); 
const db = require('../models'); 
const User = db.User;
const imageRoutes = require('./imageRoutes');

// PUBLIC ROUTES
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// AUTHENTICATED USER ROUTES
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { 
                exclude: ['password'],
                include: ['profilePicUrl'] 
            }
        });

        const profilePic = user.profilePicUrl.startsWith('http') 
            ? user.profilePicUrl
            : `${process.env.BASE_URL}${user.profilePicUrl}`;

        res.json({
            ...user.toJSON(),
            profilePicUrl: profilePic
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

router.put('/:id', authenticateToken, userController.updateUser);
router.use('/avatar', imageRoutes);

// ADMIN ROUTES (if needed, wrap in an `isAdmin` middleware)
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;
