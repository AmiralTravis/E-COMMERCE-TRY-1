// // // routes/admin.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

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

module.exports = router;