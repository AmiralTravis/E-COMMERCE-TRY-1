// routes/placeholder.js
const express = require('express');
const router = express.Router();

router.get('/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  const placeholderUrl = `https://via.placeholder.com/${width}x${height}`;
  res.redirect(placeholderUrl);
});

module.exports = router;
