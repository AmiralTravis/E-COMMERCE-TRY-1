// /routes/placeholder.js
const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const axios = require('axios');
const cache = require('memory-cache'); // Add this package to your dependencies

// Cache duration in milliseconds (e.g., 1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

router.get('/:width/:height', async (req, res) => {
  const { width, height } = req.params;
  const imageUrl = req.query.url; // Get image URL from query parameter
  
  if (!imageUrl) {
    // Generate a placeholder if no URL is provided
    try {
      console.log("Enteronn placeholder func")
      const placeholder = await sharp({
        create: {
          width: parseInt(width),
          height: parseInt(height),
          channels: 4,
          background: { r: 240, g: 240, b: 240, alpha: 1 }
        }
      })
      .jpeg({ quality: 80 })
      .toBuffer();

      res.set('Content-Type', 'image/jpeg');
      res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      return res.send(placeholder);
    } catch (error) {
      console.error('Error generating placeholder:', error);
      return res.status(500).send('Error generating placeholder');
    }
  }

  // Create a cache key from the URL and dimensions
  const cacheKey = `${imageUrl}-${width}-${height}`;
  const cachedImage = cache.get(cacheKey);

  if (cachedImage) {
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000');
    return res.send(cachedImage);
  }

  try {
    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 5000 // 5 second timeout
    });

    const resizedImage = await sharp(response.data)
      .resize(parseInt(width), parseInt(height), {
        fit: 'cover',
        withoutEnlargement: true
      })
      .jpeg({ 
        quality: 80,
        progressive: true
      })
      .toBuffer();

    // Cache the resized image
    cache.put(cacheKey, resizedImage, CACHE_DURATION);

    // Set appropriate headers
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.send(resizedImage);

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image');
  }
});

module.exports = router;