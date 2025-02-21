// /middleware/imageHandler.js
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const processImage = async (filePath, sizes) => {
  const results = {};
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);

  try {
    for (const [sizeName, dimensions] of Object.entries(sizes)) {
      const outputPath = path.join(dir, `${baseName}-${sizeName}${ext}`);
      await sharp(filePath)
        .resize(dimensions.width, dimensions.height)
        .toFile(outputPath);
      results[sizeName] = outputPath;
    }
    return results;
  } catch (error) {
    // Clean up any created files
    Object.values(results).forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
    throw error;
  }
};

module.exports = {
  processImage,
  imageSizes: {
    large: { width: 1000, height: 1000 },
    medium: { width: 500, height: 500 },
    small: { width: 250, height: 250 },
    thumbnail: { width: 100, height: 100 }
  }
};