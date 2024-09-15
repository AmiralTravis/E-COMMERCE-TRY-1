const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users (Admin only)
router.get('/', userController.getAllUsers);

// Get a single user by ID
router.get('/:id', userController.getUserById);

// Register a new user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Update user information
router.put('/:id', userController.updateUser);

// Delete a user by ID (Admin only)
router.delete('/:id', userController.deleteUser);

module.exports = router;
