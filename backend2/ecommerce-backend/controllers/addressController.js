// ecommerce-backend/controllers/addressController.js

const db = require('../config/db');
// const db = require('../models'); // Import the db object
// const UserAddress = db.UserAddress;
const { UserAddress } = require('../models');  // Import directly from models
const { Op } = require('sequelize');
const { sequelize } = require('../models');



// Get all addresses for a user
exports.getAddresses = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM addresses WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

// Add a new address
// exports.addAddress = async (req, res) => {
//   const { userId, address } = req.body;
//   try {
//     const result = await db.query(
//       'INSERT INTO addresses (user_id, address) VALUES ($1, $2) RETURNING *',
//       [userId, address]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to add address' });
//   }
// };

// Update an address
// exports.updateAddress = async (req, res) => {
//   const { id } = req.params;
//   const { address } = req.body;
//   try {
//     const result = await db.query(
//       'UPDATE addresses SET address = $1 WHERE id = $2 RETURNING *',
//       [address, id]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Address not found' });
//     }
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to update address' });
//   }
// };

exports.updateAddress = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const address = await UserAddress.findByPk(id);
    if (!address) return res.status(404).json({ error: 'Address not found' });

    // Handle setting default
    if (updates.isDefault) {
      await UserAddress.update(
        { isDefault: false },
        { where: { userId: address.userId } }
      );
    }

    await address.update(updates);
    res.json(address);
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
};

// // Delete an address
// exports.deleteAddress = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await db.query('DELETE FROM addresses WHERE id = $1 RETURNING *', [id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Address not found' });
//     }
//     res.status(204).send();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to delete address' });
//   }
// };
exports.deleteAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await UserAddress.destroy({
      where: { id: id } // Use the correct table name and Sequelize's destroy method
    });

    if (result === 0) { // Check if any rows were deleted
      return res.status(404).json({ error: 'Address not found' });
    }

    res.status(204).send(); // 204 No Content is standard for successful delete
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};



exports.createAddress = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { user } = req;
    const addressData = req.body;

    // Validation
    if (!addressData.fullName || !addressData.addressLine1) {
      throw new Error('Missing required fields');
    }

    // Check address limit
    const existingCount = await UserAddress.count({
      where: { userId: user.id, isTemporary: false }
    });

    const isTemporary = existingCount >= 5;
    
    // Create address
    const address = await UserAddress.create({
      ...addressData,
      userId: user.id,
      isTemporary,
      expiresAt: isTemporary ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
    }, { transaction });

    // Set default if first address
    if (existingCount === 0) {
      await address.update({ isDefault: true }, { transaction });
    }

    await transaction.commit();
    res.status(201).json(address);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

// Remove the old addAddress and updateAddress functions

// exports.setDefaultAddress = async (req, res) => {
//   const transaction = await sequelize.transaction();
//   try {
//     // Reset all defaults
//     await UserAddress.update(
//       { isDefault: false },
//       { where: { userId: req.user.id }, transaction }
//     );

//     // Set new default
//     const address = await UserAddress.findOne({
//       where: { id: req.params.id, userId: req.user.id },
//       transaction
//     });
    
//     if (!address) throw new Error('Address not found');
//     if (address.isTemporary) throw new Error('Temporary addresses cannot be set as default');

//     await address.update({ isDefault: true }, { transaction });
//     await transaction.commit();
//     res.json(address);
//   } catch (error) {
//     await transaction.rollback();
//     res.status(400).json({ error: error.message });
//   }
// };



exports.setDefaultAddress = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Get address from middleware
    const { address } = req;

    // 1. Check if address is temporary
    if (address.isTemporary) {
      throw new Error('Temporary addresses cannot be set as default');
    }

    // 2. Reset all defaults for this user except current address
    await UserAddress.update(
      { isDefault: false },
      {
        where: { 
          userId: address.userId,
          id: { [Op.ne]: address.id }
        },
        transaction
      }
    );

    // 3. Set new default
    await address.update({ isDefault: true }, { transaction });

    await transaction.commit();

    // 4. Return updated address
    const updatedAddress = await UserAddress.findByPk(address.id);
    res.json(updatedAddress);
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error setting default address:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to set default address',
      code: 'SET_DEFAULT_FAILED'
    });
  }
};
