// utils/receiptCleanup.js
const fs = require('fs');
const path = require('path');

class ReceiptCleanup {
  constructor(receiptDir = './receipts', maxAgeHours = 24) {
    this.receiptDir = path.resolve(receiptDir);
    this.maxAgeHours = maxAgeHours;
  }

  cleanup() {
    try {
      const files = fs.readdirSync(this.receiptDir);
      const currentTime = Date.now();

      files.forEach(file => {
        const filePath = path.join(this.receiptDir, file);
        const stats = fs.statSync(filePath);
        
        // Calculate file age in hours
        const fileAgeHours = (currentTime - stats.mtime.getTime()) / (1000 * 60 * 60);

        if (fileAgeHours > this.maxAgeHours) {
          fs.unlinkSync(filePath);
          console.log(`Deleted old receipt: ${file}`);
        }
      });
    } catch (error) {
      console.error('Error during receipt cleanup:', error);
    }
  }

  // Schedule periodic cleanup
  startScheduledCleanup(intervalHours = 12) {
    // Convert hours to milliseconds
    const interval = intervalHours * 60 * 60 * 1000;
    
    // Initial cleanup
    this.cleanup();

    // Schedule recurring cleanup
    setInterval(() => {
      this.cleanup();
    }, interval);

    console.log(`Receipt cleanup scheduled every ${intervalHours} hours`);
  }
}

module.exports = ReceiptCleanup;