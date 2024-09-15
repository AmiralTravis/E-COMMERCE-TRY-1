const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// Get all addresses for a user
router.get('/:userId', addressController.getAddresses);

// Add a new address for a user
router.post('/:userId', addressController.addAddress);

// Update an address by ID
router.put('/:id', addressController.updateAddress);

// Delete an address by ID
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
