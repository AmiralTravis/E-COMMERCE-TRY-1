// controllers/userController.js

const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const db = require('../models'); // Import the db object from models/index.js
const User = db.User; // Get the User model from the db object
const { Sequelize, DataTypes, Op } = db.Sequelize; // Sequelize operators for conditions
require('dotenv').config(); // Ensure environment variables are loaded
const { generateAvatar } = require('../utils/avatarGenerator');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/emailService');

const { Image } = require('../models');
const { processImage } = require('../utils/imageProcessor');


// JWT secrets and expiry settings
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('Missing JWT secret environment variables.');
}

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
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.json(users);
//   } catch (err) {
//     console.error('Error fetching users:', err);
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// };
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt']
    });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Approve a pending seller
exports.approveSeller = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user || user.role !== 'pending_seller') {
      return res.status(404).json({ error: 'Pending seller not found' });
    }
    await user.update({ role: 'seller', sellerApproved: true });
    res.json({ message: 'Seller approved successfully' });
  } catch (err) {
    console.error('Error approving seller:', err);
    res.status(500).json({ error: 'Failed to approve seller' });
  }
};

// Reject a pending seller
exports.rejectSeller = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user || user.role !== 'pending_seller') {
      return res.status(404).json({ error: 'Pending seller not found' });
    }
    await user.update({ role: 'user', sellerApproved: false, businessName: null, taxId: null });
    res.json({ message: 'Seller rejected successfully' });
  } catch (err) {
    console.error('Error rejecting seller:', err);
    res.status(500).json({ error: 'Failed to reject seller' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};


// Get a user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] } // Exclude password from response
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Register a new user

// exports.registerUser = async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//       // Check if username or email already exists
//       const existingUser = await User.findOne({
//           where: {
//               [Op.or]: [{ username }, { email }]
//           }
//       });

//       if (existingUser) {
//           return res.status(409).json({ error: 'Username or email already exists' });
//       }

//       // Hash password with Argon2
//       const hashedPassword = await argon2.hash(password, argon2Options);

//       // Create new user WITHOUT the id:
//       const newUser = await User.create({ 
//           username, 
//           email, 
//           password: hashedPassword // No id here!
//       });

//       // Generate avatar URL using the new user's id and username
//       const profilePicUrl = await generateAvatar(newUser.id, username);

//       // Update the user with the generated profile picture URL
//       await newUser.update({ profilePicUrl });

//       // Generate tokens (no changes needed here)
//       const accessToken = jwt.sign(
//           { id: newUser.id, username: newUser.username },
//           JWT_SECRET,
//           { expiresIn: ACCESS_TOKEN_EXPIRY }
//       );
//       const refreshToken = jwt.sign(
//           { id: newUser.id },
//           JWT_REFRESH_SECRET,
//           { expiresIn: REFRESH_TOKEN_EXPIRY }
//       );

//       // Set cookies (no changes needed here)
//       res.cookie('accessToken', accessToken, { /* ... */ });
//       res.cookie('refreshToken', refreshToken, { /* ... */ });

//       // Respond with user info and access token (no changes needed here)
//       res.status(201).json({
//           message: 'Registration successful',
//           user: {
//               id: newUser.id,
//               username: newUser.username,
//               email: newUser.email,
//               profilePicUrl: newUser.profilePicUrl
//           },
//           accessToken
//       });

//   } catch (err) {
//       console.error('Registration error:', err);
//       res.status(500).json({ error: 'Failed to register user' });
//   }
// };
// exports.registerUser = async (req, res) => {
//   const { username, email, password } = req.body;

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

//     // Hash password with Argon2
//     const hashedPassword = await argon2.hash(password, argon2Options);

//     // Create new user with the default role of 'user'
//     const newUser = await User.create({ 
//       username, 
//       email, 
//       password: hashedPassword,
//       role: 'user' // Explicitly set the role to 'user'
//     });

//     // Generate avatar URL using the new user's id and username
//     const profilePicUrl = await generateAvatar(newUser.id, username);

//     // Update the user with the generated profile picture URL
//     await newUser.update({ profilePicUrl });

//     // Generate tokens
//     const accessToken = jwt.sign(
//       { id: newUser.id, username: newUser.username, role: newUser.role },
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
//       maxAge: 60 * 60 * 1000 // 1 hour
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
//         email: newUser.email,
//         profilePicUrl: newUser.profilePicUrl,
//         role: newUser.role // Include role in the response
//       },
//       accessToken
//     });

//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({ error: 'Failed to register user' });
//   }
// };
exports.registerUser = async (req, res) => {
  const { username, email, password, businessName, taxId } = req.body;

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

    // Determine the role based on the endpoint
    const isSellerRegistration = req.originalUrl.includes('/register-seller');
    const role = isSellerRegistration ? 'pending_seller' : 'user';

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      businessName: isSellerRegistration ? businessName : null, // Only set for sellers
      taxId: isSellerRegistration ? taxId : null, // Only set for sellers
      sellerApproved: isSellerRegistration ? false : null // Only set for sellers
    });

    // Generate avatar URL using the new user's id and username
    const profilePicUrl = await generateAvatar(newUser.id, username);

    // Update the user with the generated profile picture URL
    await newUser.update({ profilePicUrl });

    // Generate tokens
    const accessToken = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
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
      maxAge: 60 * 60 * 1000 // 1 hour
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
        email: newUser.email,
        role: newUser.role,
        profilePicUrl: newUser.profilePicUrl,
        businessName: newUser.businessName,
        taxId: newUser.taxId
      },
      accessToken
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login user

// exports.loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Input validation
//     if (!username || !password) {
//       return res.status(400).json({ error: 'Username/Email and password are required' });
//     }

//     // Find the user by username or email, including the role
//     const user = await User.findOne({
//       where: {
//         [Op.or]: [{ username }, { email: username }]
//       },
//       attributes: ['id', 'username', 'password', 'role'] // Include role here
//     });

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid username/email or password' });
//     }

//     // Compare provided password with the stored hashed password using Argon2
//     const validPassword = await argon2.verify(user.password, password);

//     if (!validPassword) {
//       return res.status(401).json({ message: 'Invalid username/email or password' });
//     }

//     // Generate tokens
//     const accessToken = jwt.sign(
//       { id: user.id, username: user.username, role: user.role }, // Include role in token payload
//       JWT_SECRET,
//       { expiresIn: ACCESS_TOKEN_EXPIRY }
//     );
//     const refreshToken = jwt.sign(
//       { id: user.id },
//       JWT_REFRESH_SECRET,
//       { expiresIn: REFRESH_TOKEN_EXPIRY }
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
//         username: user.username,
//         role: user.role,
//         hasAddresses: user.addresses && user.addresses.length > 0
//       }
//     });

//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Failed to login user' });
//   }
// };
// exports.loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Input validation
//     if (!username || !password) {
//       return res.status(400).json({ error: 'Username/Email and password are required' });
//     }

//     // Find the user by username or email, including the role
//     const user = await User.findOne({
//       where: {
//         [Op.or]: [{ username }, { email: username }]
//       },
//       attributes: ['id', 'username', 'password', 'role'] // Include role here
//     });

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid username/email or password' });
//     }

//     // Compare provided password with the stored hashed password using Argon2
//     const validPassword = await argon2.verify(user.password, password);

//     if (!validPassword) {
//       return res.status(401).json({ message: 'Invalid username/email or password' });
//     }

//     // Generate tokens
//     const accessToken = jwt.sign(
//       { id: user.id, username: user.username, role: user.role }, // Include role in token payload
//       JWT_SECRET,
//       { expiresIn: ACCESS_TOKEN_EXPIRY }
//     );
//     const refreshToken = jwt.sign(
//       { id: user.id },
//       JWT_REFRESH_SECRET,
//       { expiresIn: REFRESH_TOKEN_EXPIRY }
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
//         username: user.username,
//         role: user.role, // Include role in the response
//         hasAddresses: user.addresses && user.addresses.length > 0
//       }
//     });

//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Failed to login user' });
//   }
// };
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email: username }]
      },
      attributes: ['id', 'username', 'password', 'role']
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    // Block pending sellers from logging in
    if (user.role === 'pending_seller') {
      return res.status(403).json({ message: 'Your seller account is pending approval' });
    }

    // Verify password
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    // Generate tokens and respond
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    res.cookie('accessToken', accessToken, { /* cookie options */ });
    res.cookie('refreshToken', refreshToken, { /* cookie options */ });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        hasAddresses: user.addresses && user.addresses.length > 0
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login user' });
  }
};

// // Update user details

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body; // Include username in the request body

  try{
    if (username) {
      const existingUser = await User.findOne({
        where: {
          username,
          id: {[Op.ne]: id}
        }
      });
      if (existingUser) return res.status(409).json ({ error: 'Username taken'});
    }

    const [updated] = await User.update(
      { username, email },
      { where: { id } }
    );

    if(!updated) return res.status(404).json({ error : 'User not found' });

    const updatedUser = await User.findByPk(id, {
      attributes: {exclude: ['password'] } 
    });

    res.json(updatedUser);
    
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a user
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
//     console.error('Delete error:', err);
//     res.status(500).json({ error: 'Failed to delete user' });
//   }
// };



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpiry = Date.now() + 3600000; // 1 hour
    
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpiry
    });

    // Use existing email service
    await sendPasswordResetEmail(user, resetToken);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Error processing password reset' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashedPassword = await argon2.hash(password, argon2Options);
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Error resetting password' });
  }
};





// exports.changePassword = async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   try {
//     // Explicitly include password field
//     const user = await User.findByPk(req.user.id, {
//       attributes: ['id', 'password'] // Must explicitly include password
//     });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Add validation for empty password field
//     if (!user.password || user.password === '') {
//       console.error('No password hash found for user:', user.id);
//       return res.status(500).json({ error: 'Password reset required' });
//     }

//     const validPassword = await argon2.verify(user.password, currentPassword);
    
//     if (!validPassword) {
//       return res.status(401).json({ error: 'Current password is incorrect' });
//     }

//     // Validate new password length
//     if (newPassword.length < 8) {
//       return res.status(400).json({ error: 'Password must be at least 8 characters' });
//     }

//     const hashedPassword = await argon2.hash(newPassword, argon2Options);
//     await user.update({ password: hashedPassword });

//     res.json({ message: 'Password changed successfully' });
//   } catch (error) {
//     console.error('Change password error:', error);
    
//     // More specific error messages
//     let errorMessage = 'Error changing password';
//     if (error.message.includes('pchstr must be a non-empty string')) {
//       errorMessage = 'Invalid password format - please reset your password';
//     }
    
//     res.status(500).json({ error: errorMessage });
//   }
// };
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Find the user by ID, explicitly including the password field
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'password'] // Ensure password is included
    });

    // If user not found, return 404 error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user's password hash is missing or invalid
    if (!user.password || !user.password.startsWith('$argon2')) {
      console.error('Invalid or missing password hash for user:', user.id);
      return res.status(400).json({ 
        error: 'Your account requires a password reset. Please use the "Forgot Password" feature.' 
      });
    }

    // Verify the current password
    const validPassword = await argon2.verify(user.password, currentPassword);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Validate the new password length
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword, argon2Options);

    // Update the user's password in the database
    await user.update({ password: hashedPassword });

    // Return success message
    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);

    // Handle specific errors
    let errorMessage = 'Error changing password';
    if (error.message.includes('pchstr must be a non-empty string')) {
      errorMessage = 'Invalid password format - please reset your password';
    } else if (error.message.includes('Invalid hash')) {
      errorMessage = 'Your password hash is invalid. Please reset your password.';
    }

    // Return a 500 error with the appropriate message
    res.status(500).json({ error: errorMessage });
  }
};



// Add to existing exports
exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const processed = await processImage(req.file.path, 'avatar');
    
    // Update user
    await User.update(
      { profilePicUrl: processed.medium },
      { where: { id: userId } }
    );

    // Store all sizes in Image table
    await Image.create({
      type: 'avatar',
      original: processed.medium,
      large: processed.medium,
      medium: processed.medium,
      small: processed.small,
      thumbnail: processed.thumbnail,
      userId
    });

    res.json({ 
      profilePicUrl: `${process.env.BASE_URL}/${processed.medium}`
    });
  } catch (error) {
    console.error('Avatar update error:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
};


// exports.registerSeller = async (req, res) => {
//   console.log('Request Body:', req.body); // Log the request body

//   const { businessName, taxId } = req.body;

//   try {
//     const user = await User.findByPk(req.user.id);

//     // Validate user can become a seller
//     if (user.role !== 'user') {
//       return res.status(400).json({ error: 'Only regular users can become sellers' });
//     }

//     // Update user to pending seller
//     await user.update({
//       role: 'pending_seller',
//       businessName,
//       taxId,
//       sellerApproved: false
//     });

//     // Notify admin for approval
//     await sendEmail(
//       process.env.ADMIN_EMAIL,
//       'New Seller Registration',
//       `User ${user.username} (${user.email}) has registered as a seller. Please review their application.`
//     );

//     res.json({
//       message: 'Seller registration submitted for approval',
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         businessName: user.businessName,
//         taxId: user.taxId
//       }
//     });
//   } catch (error) {
//     console.error('Seller registration error:', error);
//     res.status(500).json({ error: 'Failed to register as seller' });
//   }
// };


// exports.registerUser = async (req, res) => {
//   const { username, email, password, businessName, taxId } = req.body;

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

//     // Hash password with Argon2
//     const hashedPassword = await argon2.hash(password, argon2Options);

//     // Determine the role based on the endpoint
//     const isSellerRegistration = req.originalUrl.includes('/register-seller');
//     const role = isSellerRegistration ? 'pending_seller' : 'user';

//     // Create new user
//     const newUser = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//       role,
//       businessName: isSellerRegistration ? businessName : null, // Only set for sellers
//       taxId: isSellerRegistration ? taxId : null, // Only set for sellers
//       sellerApproved: isSellerRegistration ? false : null // Only set for sellers
//     });

//     // Generate avatar URL using the new user's id and username
//     const profilePicUrl = await generateAvatar(newUser.id, username);

//     // Update the user with the generated profile picture URL
//     await newUser.update({ profilePicUrl });

//     // Generate tokens
//     const accessToken = jwt.sign(
//       { id: newUser.id, username: newUser.username, role: newUser.role },
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
//       maxAge: 60 * 60 * 1000 // 1 hour
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
//         email: newUser.email,
//         role: newUser.role,
//         profilePicUrl: newUser.profilePicUrl,
//         businessName: newUser.businessName,
//         taxId: newUser.taxId
//       },
//       accessToken
//     });

//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({ error: 'Failed to register user' });
//   }
// };