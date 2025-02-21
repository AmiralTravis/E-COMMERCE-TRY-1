// jobs/cleanupTempAddresses.js
const cleanupTemporaryAddresses = async () => {
    const result = await UserAddress.destroy({
      where: {
        isTemporary: true,
        expiresAt: {
          [Sequelize.Op.lt]: new Date()
        }
      }
    });
    console.log(`Cleaned up ${result} temporary addresses`);
  };
  
  // Run daily at 3 AM
  cron.schedule('0 3 * * *', cleanupTemporaryAddresses);