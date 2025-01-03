// // // routes/admin.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware');

// Apply authentication and admin check to all routes
router.use(authenticateToken, isAdmin);

// Product management
router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.addProduct);
router.put('/products/:id', adminController.editProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.put('/products/:id/stock', adminController.updateStock);

// Order management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/fulfill', adminController.fulfillOrder);
router.put('/orders/:id/cancel', adminController.cancelOrder);
router.post('/orders/:id/refund', adminController.refundOrder);

// Sales report
router.get('/sales-report', adminController.getSalesReport);

// Low stock alerts
router.get('/low-stock-alerts', adminController.getLowStockAlerts);

// newly added routes..
router.get('/admins', authenticateToken, isAdmin, adminController.getAllAdmins);
router.post('/change-role', authenticateToken, isAdmin, adminController.changeUserRole);
router.post('/create-admin', authenticateToken, isAdmin, adminController.createAdminAccount);
router.get('/users', authenticateToken, isAdmin, adminController.getAllUsers);
router.post('/promote-to-admin', adminController.promoteToAdmin);

//superadmin routes.. 
router.post('/remove-admin', authenticateToken, isSuperAdmin, adminController.removeAdmin);
router.get('/all-admins', authenticateToken, isAdmin, adminController.getAllAdmins);

// In routes/admin.js
router.put('/orders/:id/update-status', adminController.updateOrderStatus);

module.exports = router;