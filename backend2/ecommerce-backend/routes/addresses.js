// ecommerce-backend/routes/addresses.js

const express = require('express');
const router = express.Router();
const { UserAddress } = require('../models');
const { verifyAddressOwnership } = require('../middleware/addressMiddleware');
const addressController = require('../controllers/addressController');

// Save/Update Address


// router.post('/save-address', async (req, res) => {
//   console.log('Starting save-address request:', req.body);
//   console.log('Request body:', req.body);

//   try {
//     const { 
//       userId, 
//       fullName, 
//       email, 
//       phoneNumber, 
//       addressLine1, 
//       addressLine2, 
//       city, 
//       state, 
//       postalCode, 
//       country, 
//       isDefault,
//       id, // <-- Destructure id here so it can be used or ignored.
//       ...rest // <--- This will capture any extra fields in case there are some.
//     } = req.body;

//     const addressData = { // <--- Create a new object without the id
//       userId, 
//       fullName, 
//       email, 
//       phoneNumber, 
//       addressLine1, 
//       addressLine2, 
//       city, 
//       state, 
//       postalCode, 
//       country, 
//       isDefault,
//       ...rest // <--- Include the rest of the fields.
//     };

//     // Validate required fields (using addressData now)
//     if (!addressData.userId || !addressData.fullName || !addressData.email || !addressData.addressLine1 || !addressData.city || !addressData.state || !addressData.postalCode || !addressData.country) {
//       return res.status(400).json({ 
//         error: 'Missing required fields',
//         receivedData: req.body 
//       });
//     }

//     // Add phone validation in route
//     const phoneRegex = /^[0-9]{6,15}$/;

//     if (!phoneRegex.test(addressData.phoneNumber)) {
//       return res.status(400).json({
//         error: 'Phone number must be 6-15 digits',
//         field: 'phoneNumber'
//       });
//     }

//     if (isDefault) {
//       const transaction = await UserAddress.sequelize.transaction();
//       try {
//         await UserAddress.update(
//           { isDefault: false },
//           { where: { userId }, transaction }
//         );

//         const [address, created] = await UserAddress.findOrCreate({
//           where: { 
//             userId: addressData.userId, // Use addressData
//             addressLine1: addressData.addressLine1, // Use addressData
//             postalCode: addressData.postalCode // Use addressData
//           },
//           defaults: { ...addressData, isDefault: true }, // Use addressData
//           transaction
//         });

//         if (!created) {
//           await address.update(addressData, { transaction }); // Use addressData
//         }

//         await transaction.commit();
//         return res.status(200).json({ 
//           message: created ? 'Default address created' : 'Default address updated',
//           address
//         });
//       } catch (error) {
//         await transaction.rollback();
//         console.error('Transaction error:', error);
//         return res.status(500).json({ error: error.message });
//       }
//     } else {
//       const [address, created] = await UserAddress.findOrCreate({
//         where: { 
//           userId: addressData.userId, // Use addressData
//           addressLine1: addressData.addressLine1, // Use addressData
//           postalCode: addressData.postalCode // Use addressData
//         },
//         defaults: addressData // Use addressData
//       });

//       if (!created) {
//         await address.update(addressData); // Use addressData
//       }

//       return res.status(200).json({
//         message: created ? 'Address created' : 'Address updated',
//         address
//       });
//     }
//   } catch (error) {
//     console.error('Error in save-address route:', error);
//     return res.status(500).json({ error: error.message });
//   }
// });
router.post('/save-address', async (req, res) => {
  console.log('Starting save-address request:', req.body);
  console.log('Request body:', req.body);

  try {
    const { 
      userId, 
      fullName, 
      email, 
      phoneNumber, 
      addressLine1, 
      addressLine2, 
      city, 
      state, 
      postalCode, 
      country, 
      isDefault,
      id,
      countryCode, // Add this line to destructure countryCode
      ...rest 
    } = req.body;

    const addressData = { 
      userId, 
      fullName, 
      email, 
      phoneNumber, 
      addressLine1, 
      addressLine2, 
      city, 
      state, 
      postalCode, 
      country,
      countryCode, // Add this line
      isDefault,
      ...rest
    };

    // Validate required fields
    if (!addressData.userId || !addressData.fullName || !addressData.email || 
        !addressData.addressLine1 || !addressData.city || !addressData.state || 
        !addressData.postalCode || !addressData.country || !addressData.countryCode) { // Add countryCode validation
      return res.status(400).json({ 
        error: 'Missing required fields',
        receivedData: req.body 
      });
    }

    if (isDefault) {
      const transaction = await UserAddress.sequelize.transaction();
      try {
        await UserAddress.update(
          { isDefault: false },
          { where: { userId }, transaction }
        );

        const [address, created] = await UserAddress.findOrCreate({
          where: { 
            userId: addressData.userId,
            addressLine1: addressData.addressLine1,
            postalCode: addressData.postalCode,
            countryCode: addressData.countryCode // Add this line
          },
          defaults: { ...addressData, isDefault: true },
          transaction
        });

        if (!created) {
          await address.update(addressData, { transaction });
        }

        await transaction.commit();
        return res.status(200).json({ 
          message: created ? 'Default address created' : 'Default address updated',
          address
        });
      } catch (error) {
        await transaction.rollback();
        console.error('Transaction error:', error);
        return res.status(500).json({ error: error.message });
      }
    } else {
      const [address, created] = await UserAddress.findOrCreate({
        where: { 
          userId: addressData.userId,
          addressLine1: addressData.addressLine1,
          postalCode: addressData.postalCode,
          countryCode: addressData.countryCode // Add this line
        },
        defaults: addressData
      });

      if (!created) {
        await address.update(addressData);
      }

      return res.status(200).json({
        message: created ? 'Address created' : 'Address updated',
        address
      });
    }
  } catch (error) {
    console.error('Error in save-address route:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Get User Addresses
router.get('/user-addresses/:userId', async (req, res) => {
  console.log('Fetching addresses for user:', req.params.userId);
  
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const addresses = await UserAddress.findAll({
      where: { userId: req.params.userId },
      order: [['isDefault', 'DESC']],
    });

    console.log(`Found ${addresses.length} addresses for user ${req.params.userId}`);
    return res.status(200).json(addresses);
    
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});


// Protected routes
router.put('/:id', verifyAddressOwnership, addressController.updateAddress);
router.delete('/:id', verifyAddressOwnership, addressController.deleteAddress);
router.put('/:id/set-default', verifyAddressOwnership, addressController.setDefaultAddress);

module.exports = router;
