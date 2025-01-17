// /routes/placeholder.js 
const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const axios = require('axios');
const cache = require('memory-cache');

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

router.get('/:width/:height', async (req, res) => {
  const { width, height } = req.params;
  const imageUrl = req.query.url;

  // Generate a placeholder if no URL is provided
  if (!imageUrl) {
    try {
      const placeholder = await sharp({
        create: {
          width: parseInt(width),
          height: parseInt(height),
          channels: 4,
          background: { r: 240, g: 240, b: 240, alpha: 1 },
        },
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

  // Cache key for the image
  const cacheKey = `${imageUrl}-${width}-${height}`;
  const cachedImage = cache.get(cacheKey);

  if (cachedImage) {
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000');
    return res.send(cachedImage);
  }

  try {
    // Fetch the image from the URL
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 5000, // 5-second timeout
    });

    // Resize and optimize the image
    const resizedImage = await sharp(response.data)
      .resize(parseInt(width), parseInt(height), {
        fit: 'cover',
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 80,
        progressive: true,
      })
      .toBuffer();

    // Cache the resized image
    cache.put(cacheKey, resizedImage, CACHE_DURATION);

    // Set headers and send the image
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.send(resizedImage);
  } catch (error) {
    console.error('Error processing image:', error);
    // Fallback to placeholder if the image URL fails
    const placeholder = await sharp({
      create: {
        width: parseInt(width),
        height: parseInt(height),
        channels: 4,
        background: { r: 240, g: 240, b: 240, alpha: 1 },
      },
    })
      .jpeg({ quality: 80 })
      .toBuffer();

    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.send(placeholder);
  }
});

module.exports = router;