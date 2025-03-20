// /routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const imageUpload = require('../middleware/imageUpload');
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Product images
router.post('/products/:id/images',
  isAdmin,
  imageUpload.array('images', 5),
  productController.uploadProductImages
);

// User avatar
router.put('/users/avatar',
  authenticateToken,
  imageUpload.single('avatar'),
  userController.updateAvatar
);

module.exports = router;