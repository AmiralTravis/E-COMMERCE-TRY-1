// ecommerce-backend/middleware/addressMiddleware.js
const { UserAddress } = require('../models');

const verifyAddressOwnership = async (req, res, next) => {
  try {
    const address = await UserAddress.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!address) {
      return res.status(404).json({ 
        error: 'Address not found or access denied',
        code: 'ADDRESS_NOT_FOUND'
      });
    }

    req.address = address;
    next();
  } catch (error) {
    console.error('Ownership verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify address ownership',
      code: 'OWNERSHIP_VERIFICATION_FAILED'
    });
  }
};

module.exports = { verifyAddressOwnership };