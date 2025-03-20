// // // routes/admin.js



// const express = require('express');
// const router = express.Router();
// const adminController = require('../controllers/adminController');
// const { authenticateToken, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware');

// const multer = require('multer');
// const upload = multer({
//   storage: multer.memoryStorage(), // Store files in memory
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//     files: 20, // Max 20 files
//   },
// //   fileFilter: (req, file, cb) => {
// //     if (file.mimetype.startsWith('image/')) {
// //       cb(null, true); // Accept the file
// //     } else {
// //       cb(new Error('Invalid file type. Only images are allowed.'), false);
// //     }
// //   },
// fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       'image/jpeg', 
//       'image/png',
//       'image/webp',
//       'image/gif'
//     ];
    
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error(`Unsupported file type: ${file.mimetype}. We accept: JPEG, PNG, WEBP, GIF`), false);
//     }
//   }
// });

// // Apply authentication and admin check to all routes
// router.use(authenticateToken, isAdmin);

// // Product management
// router.get('/products', adminController.getAllProducts);
// router.post('/products', adminController.addProduct);
// router.get('/products/:id', adminController.getProductById);
// router.put('/products/:id', adminController.editProduct);
// router.delete('/products/:id', adminController.deleteProduct);
// router.patch('/products/:id/stock', adminController.updateStock);

// // Main image upload
// router.put('/products/:id/main-image', upload.single('image'), adminController.uploadMainImage);

// // Thumbnail upload
// router.post('/products/:id/thumbnails', upload.array('thumbnails', 20), adminController.uploadThumbnails);

// // Delete thumbnail
// router.delete('/products/:productId/images/:imageId', adminController.deleteImage);

// // Order management
// router.get('/orders', adminController.getAllOrders);
// router.put('/orders/:id/fulfill', adminController.fulfillOrder);
// router.put('/orders/:id/cancel', adminController.cancelOrder);
// router.post('/orders/:id/refund', adminController.refundOrder);

// // Sales report
// router.get('/sales-report', adminController.getSalesReport);

// // Low stock alerts
// router.get('/low-stock-alerts', adminController.getLowStockAlerts);

// // Admin management
// router.get('/admins', adminController.getAllAdmins);
// router.post('/change-role', adminController.changeUserRole);
// router.post('/create-admin', adminController.createAdminAccount);
// router.get('/users', adminController.getAllUsers);
// router.post('/promote-to-admin', adminController.promoteToAdmin);

// // Superadmin routes
// router.post('/remove-admin', authenticateToken, isSuperAdmin, adminController.removeAdmin);
// router.get('/all-admins', adminController.getAllAdmins);

// // Order status update
// router.put('/orders/:id/update-status', adminController.updateOrderStatus);

// module.exports = router;

// routes/admin.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController')
const { authenticateToken, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware');

const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 20, // Max 20 files
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type: ${file.mimetype}. We accept: JPEG, PNG, WEBP, GIF`), false);
        }
    }
});

// Apply authentication and admin check to all routes
router.use(authenticateToken, isAdmin);

// Product management
router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.addProduct);
router.get('/products/:id', adminController.getProductById);
router.put('/products/:id', adminController.editProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.patch('/products/:id/stock', adminController.updateStock);

// Main image upload
router.put('/products/:id/main-image', upload.single('image'), adminController.uploadMainImage);

// Thumbnail upload
router.post('/products/:id/thumbnails', upload.array('thumbnails', 20), adminController.uploadThumbnails);

// Delete thumbnail
router.delete('/products/:productId/images/:imageId', adminController.deleteImage);

// Order management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/fulfill', adminController.fulfillOrder);
router.put('/orders/:id/cancel', adminController.cancelOrder);
router.post('/orders/:id/refund', adminController.refundOrder);

// Sales report
router.get('/sales-report', adminController.getSalesReport);

// Low stock alerts
router.get('/low-stock-alerts', adminController.getLowStockAlerts);

// Admin management
router.get('/admins', adminController.getAllAdmins);
router.post('/change-role', adminController.changeUserRole);
router.post('/create-admin', adminController.createAdminAccount);
router.post('/promote-to-admin', adminController.promoteToAdmin);

// User Management
router.get('/users', authenticateToken, isAdmin, userController.getAllUsers);
router.patch('/users/:id/approve', authenticateToken, isAdmin, userController.approveSeller);
router.delete('/users/:id/reject', authenticateToken, isAdmin, userController.rejectSeller);
router.delete('/users/:id', authenticateToken, isAdmin, userController.deleteUser);

// Superadmin routes
router.post('/remove-admin', authenticateToken, isSuperAdmin, adminController.removeAdmin);
router.get('/all-admins', adminController.getAllAdmins);

// Order status update
router.put('/orders/:id/update-status', adminController.updateOrderStatus);

module.exports = router;