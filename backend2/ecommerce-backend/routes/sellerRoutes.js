// /routes/sellerRoutes.js

const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const adminController = require('../controllers/adminController');
const { authenticateToken, isSeller } = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig'); // For file uploads

// Seller Registration
router.post('/register', authenticateToken, sellerController.registerSeller);

router.get('/sales', authenticateToken, isSeller, sellerController.getSalesData);





// Product Management
router.get('/products', authenticateToken, isSeller, sellerController.getSellerProducts);
router.post('/products', authenticateToken, isSeller, upload.array('images', 5), sellerController.createProduct);
// router.put('/products/:id', authenticateToken, isSeller, upload.array('images', 5), sellerController.updateProduct);
router.get('/products/:id',authenticateToken, isSeller, adminController.getProductById);
router.put('/products/:id',authenticateToken, isSeller, adminController.editProduct);
router.delete('/products/:id', authenticateToken, isSeller, sellerController.deleteProduct);
router.patch('/products/:id/stock',authenticateToken, isSeller, adminController.updateStock);


// Main image upload
router.put('/products/:id/main-image', upload.single('image'), adminController.uploadMainImage);

// Thumbnail upload
router.post('/products/:id/thumbnails', upload.array('thumbnails', 20), adminController.uploadThumbnails);

// Delete thumbnail
router.delete('/products/:productId/images/:imageId', adminController.deleteImage);

router.get('/products/:productId/performance', authenticateToken, isSeller, sellerController.getProductPerformance);
router.get('/inventory-status', authenticateToken, isSeller, sellerController.getInventoryStatus);


// Order Management
router.get('/orders', authenticateToken, isSeller, sellerController.getSellerOrders);

// Dashboard Stats
router.get('/stats', authenticateToken, isSeller, sellerController.getSellerStats);

module.exports = router;