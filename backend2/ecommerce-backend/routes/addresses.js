// ecommerce-backend/routes/addresses.js

const express = require('express');
const router = express.Router();
const { UserAddress } = require('../models');

// Save/Update Address
// router.post('/save-address', async (req, res) => {
//   console.log('Starting save-address request:', req.body);
  
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
//       isDefault 
//     } = req.body;

//     // Validate required fields
//     if (!userId || !fullName || !email || !addressLine1 || !city || !state || !postalCode || !country) {
//       return res.status(400).json({ 
//         error: 'Missing required fields',
//         receivedData: req.body 
//       });
//     }

//     // If setting as default address, wrap both operations in a transaction
//     if (isDefault) {
//       console.log('Attempting to set new default address for user:', userId);
      
//       const transaction = await UserAddress.sequelize.transaction();
      
//       try {
//         // First, unset any existing default addresses
//         console.log('Unsetting existing default addresses...');
//         await UserAddress.update(
//           { isDefault: false }, 
//           { 
//             where: { userId },
//             transaction
//           }
//         );
//         console.log('Successfully unset existing default addresses');

//         // Then create or update the new address
//         const [address, created] = await UserAddress.findOrCreate({
//           where: { 
//             userId, 
//             addressLine1,
//             postalCode
//           },
//           defaults: {
//             ...req.body,
//             isDefault: true
//           },
//           transaction
//         });

//         // If address existed but needs updating
//         if (!created) {
//           await address.update(req.body, { transaction });
//         }

//         await transaction.commit();
//         console.log('Transaction committed successfully');

//         return res.status(200).json({
//           message: created ? 'Address created' : 'Address updated',
//           address
//         });

//       } catch (error) {
//         console.error('Transaction failed:', error);
//         await transaction.rollback();
//         throw error;
//       }
//     } else {
//       // If not setting as default, simply create/update the address
//       console.log('Creating/updating non-default address');
//       const [address, created] = await UserAddress.findOrCreate({
//         where: { 
//           userId, 
//           addressLine1,
//           postalCode
//         },
//         defaults: req.body
//       });

//       // If address existed but needs updating
//       if (!created) {
//         await address.update(req.body);
//       }

//       console.log('Address operation completed successfully');
//       return res.status(200).json({
//         message: created ? 'Address created' : 'Address updated',
//         address
//       });
//     }

//   } catch (error) {
//     console.error('Error in save-address route:', error);
//     return res.status(500).json({ 
//       error: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// });
router.post('/save-address', async (req, res) => {
  console.log('Starting save-address request:', req.body);

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
      isDefault 
    } = req.body;

    // Validate required fields
    if (!userId || !fullName || !email || !addressLine1 || !city || !state || !postalCode || !country) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        receivedData: req.body 
      });
    }

    // Handle setting a new default address
    if (isDefault) {
      const transaction = await UserAddress.sequelize.transaction();
      try {
        // Unset existing default addresses
        await UserAddress.update(
          { isDefault: false },
          { where: { userId }, transaction }
        );

        // Create or update the new address
        const [address, created] = await UserAddress.findOrCreate({
          where: { 
            userId, 
            addressLine1,
            postalCode
          },
          defaults: { ...req.body, isDefault: true },
          transaction
        });

        if (!created) {
          await address.update(req.body, { transaction });
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
      // Create or update a non-default address
      const [address, created] = await UserAddress.findOrCreate({
        where: { 
          userId, 
          addressLine1,
          postalCode
        },
        defaults: req.body
      });

      if (!created) {
        await address.update(req.body);
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

module.exports = router;
