const { Review } = require('../models'); // Adjust the import to your actual model file path

// Get all reviews for a product
exports.getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.findAll({
      where: { productId: productId },
    });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Add a review to a product
exports.addReview = async (req, res) => {
  const { productId } = req.params;
  const { userId, rating, comment } = req.body;

  try {
    const newReview = await Review.create({
      productId,
      userId,
      rating,
      comment,
    });
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Review.destroy({
      where: { id: id },
    });
    if (result === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
