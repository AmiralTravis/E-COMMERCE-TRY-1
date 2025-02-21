// /ecommerce-backend/routes/profile.js

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { generateAvatar } = require('../utils/avatarGenerator');
// const User = require('../models/usersModels');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const db = require('../models'); // Import the db object
const User = db.User; // Get User model from the db instance
// Update profile picture


router.post('/upload', authenticateToken, async (req, res) => {
    try {
      console.log('Request headers:', req.headers); // Log headers
      console.log('Request files:', req.files); // Log files
      console.log('Request body:', req.body); // Log body
  
      if (!req.files || !req.files.image) {
        return res.status(400).json({ error: 'No image uploaded' });
      }
  
      const image = req.files.image;
      const userId = req.user.id;
      const fileName = `avatar-${userId}-${Date.now()}${path.extname(image.name)}`;
      const filePath = path.join(__dirname, '../public/profile-pics', fileName);
  
      // Process image
      await sharp(image.data)
        .resize(500, 500)
        .jpeg({ quality: 90 })
        .toFile(filePath);
  
      // Update user
      const user = await User.findByPk(userId);
      const profilePicUrl = `/profile-pics/${fileName}`;
    // const profilePicUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/profile-pics/${fileName}`;

      user.profilePicUrl = profilePicUrl;
      await user.save();
  
    //   res.json({ profilePicUrl });
    // res.json({
    //     profilePicUrl: `${process.env.BASE_URL || 'http://localhost:5000'}${profilePicUrl}`
    //   });
    res.json({
      profilePicUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/profile-pics/${fileName}`
    });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload profile picture' });
    }
  });

// Remove profile picture

router.delete('/remove', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const avatarPath = `public/generated-avatars/generated-${user.id}.png`;
    
    if (!fs.existsSync(avatarPath)) {
      await generateAvatar(user.id, user.username);
    }

    // Update with full URL
    user.profilePicUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/generated-avatars/generated-${user.id}.png`;
    await user.save();
    
    res.json({ profilePicUrl: user.profilePicUrl });
  } catch (error) {
    console.error('Remove error:', error);
    res.status(500).json({ error: 'Failed to remove profile picture' });
  }
});

module.exports = router;