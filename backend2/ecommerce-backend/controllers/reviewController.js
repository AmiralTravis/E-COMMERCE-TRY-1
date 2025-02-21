// // controllers/reviewController.js
// const { Review, User, Product, VerifiedPurchases } = require('../models');
// const { Op } = require('sequelize');

// exports.getReviewsByProduct = async (req, res) => {
//   const { productId } = req.params;
//   try {
//     const reviews = await Review.findAll({
//       where: { productId: productId },
//       include: [{ model: User, attributes: ['username'] }]
//     });
//     res.json(reviews);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch reviews' });
//   }
// };

// exports.addReview = async (req, res) => {
//   const { productId } = req.params;
//   const { userId, rating, comment } = req.body;

//   try {
//     const newReview = await Review.create({
//       productId,
//       userId,
//       rating,
//       comment,
//     });
    
//     await Product.updateAverageRating(productId);
//     res.status(201).json(newReview);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create review' });
//   }
// };

// exports.updateReview = async (req, res) => {
//   const { id } = req.params;
//   const { rating, comment } = req.body;

//   try {
//     const review = await Review.findByPk(id);
//     if (!review) {
//       return res.status(404).json({ error: 'Review not found' });
//     }

//     review.rating = rating;
//     review.comment = comment;
//     await review.save();
    
//     await Product.updateAverageRating(review.productId);
//     res.json(review);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to update review' });
//   }
// };

// exports.deleteReview = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const review = await Review.findByPk(id);
//     if (!review) {
//       return res.status(404).json({ error: 'Review not found' });
//     }
    
//     const productId = review.productId;
//     await review.destroy();
//     await Product.updateAverageRating(productId);
    
//     res.status(204).send();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to delete review' });
//   }
// };

// exports.checkReviewEligibility = async (req, res) => {
//   const { productId } = req.params;
//   const userId = req.user.id;

//   try {
//     const verifiedPurchase = await VerifiedPurchases.findOne({
//       where: { 
//         userId,
//         productId,
//         delivered: true
//       }
//     });
    
//     res.json({ canReview: !!verifiedPurchase });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to check eligibility' });
//   }
// };

// exports.getUserReview = async (req, res) => {
//   const { productId } = req.params;
//   const userId = req.user.id; // Ensure this is correctly set by the auth middleware

//   try {
//     const review = await Review.findOne({
//       where: { productId, userId },
//       include: [{ model: User, attributes: ['username'] }],
//     });

//     if (!review) {
//       return res.status(404).json({ error: 'Review not found' });
//     }

//     res.json(review);
//   } catch (error) {
//     console.error('Error fetching user review:', error);
//     res.status(500).json({ error: 'Failed to fetch user review' });
//   }
// };


// // controllers/reviewController.js

const { Review, User, Product, VerifiedPurchases } = require('../models');
const { Op } = require('sequelize');

exports.getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.findAll({
      where: { productId: productId },
      include: [{ model: User, attributes: ['username', 'profilePicUrl'] }]
    });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

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
    
    await Product.updateAverageRating(productId);
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

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
    
    await Product.updateAverageRating(review.productId);
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    const productId = review.productId;
    await review.destroy();
    await Product.updateAverageRating(productId);
    
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

exports.checkReviewEligibility = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const verifiedPurchase = await VerifiedPurchases.findOne({
      where: { 
        userId,
        productId,
        delivered: true
      }
    });
    
    res.json({ canReview: !!verifiedPurchase });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check eligibility' });
  }
};

exports.getUserReview = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id; // Ensure this is correctly set by the auth middleware

  try {
    const review = await Review.findOne({
      where: { productId, userId },
      include: [{ model: User, attributes: ['username', 'profilePicUrl'] }],
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Error fetching user review:', error);
    res.status(500).json({ error: 'Failed to fetch user review' });
  }
};

exports.getTopReviewsByProduct = async (req, res) => {
  const { productId } = req.params;
  const limit = 8; // Number of top reviews to return

  try {
    const reviews = await Review.findAll({
      where: { productId: productId },
      include: [{ model: User, attributes: ['username', 'profilePicUrl'] }],
      order: [['rating', 'DESC']], // Sort by rating in descending order
      limit: limit, // Limit to top 8 reviews
      attributes: ['id', 'rating', 'comment', 'updatedAt'] // Include updatedAt field
    });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top reviews' });
  }
};