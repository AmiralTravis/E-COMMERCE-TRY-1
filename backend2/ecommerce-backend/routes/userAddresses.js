router.post('/save-address', async (req, res) => {
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
  
      // Optional: Validate input
      if (!userId || !fullName || !email || !addressLine1 || !city || !state || !postalCode || !country) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // If setting as default, unset other default addresses
      if (isDefault) {
        await UserAddress.update(
          { isDefault: false }, 
          { where: { userId: userId } }
        );
      }
  
      // Create or update address
      const [address, created] = await UserAddress.findOrCreate({
        where: { 
          userId: userId, 
          addressLine1: addressLine1,
          postalCode: postalCode
        },
        defaults: {
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
        }
      });
  
      res.status(200).json({
        message: created ? 'Address created' : 'Address updated',
        address
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Route to get user addresses
  router.get('/user-addresses/:userId', async (req, res) => {
    try {
      const addresses = await UserAddress.findAll({
        where: { userId: req.params.userId },
        order: [['isDefault', 'DESC']]
      });
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });