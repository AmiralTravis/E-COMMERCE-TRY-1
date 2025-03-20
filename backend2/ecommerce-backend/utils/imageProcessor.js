// /utils/imageProcessor.js

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = {
  avatar: { 
    thumbnail: 100,
    small: 200,
    medium: 400 
  },
  product: {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1200
  }
};

async function processImage(filePath, type) {
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const dir = path.dirname(filePath);
  const publicDir = dir.replace('uploads', 'public');

  const results = {};
  
  try {
    for (const [sizeName, size] of Object.entries(sizes[type])) {
      const outputPath = path.join(publicDir, `${baseName}-${sizeName}${ext}`);
      
      await sharp(filePath)
        .resize(size, size, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(outputPath);

      results[sizeName] = outputPath.replace(/\\/g, '/').split('public/')[1];
    }

    return results;
  } catch (error) {
    // Cleanup on error
    Object.values(results).forEach(file => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });
    throw error;
  }
}

module.exports = { processImage };