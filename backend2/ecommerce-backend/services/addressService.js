// services/addressService.js
const checkAddressLimit = async (userId) => {
    const count = await UserAddress.count({
      where: {
        userId,
        isTemporary: false
      }
    });
    return count >= 5;
  };
  
  const createAddress = async (addressData) => {
    const isTemporary = await checkAddressLimit(addressData.userId);
    
    return UserAddress.create({
      ...addressData,
      isTemporary,
      expiresAt: isTemporary ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null // 30 days expiry
    });
  };