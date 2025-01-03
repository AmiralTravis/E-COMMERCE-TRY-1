// controllers/verifiedPurchaseController.js
const { VerifiedPurchase } = require('../models');

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

exports.checkReviewEligibility = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user?.id;
  
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  
    try {
      const verifiedPurchase = await VerifiedPurchase.findOne({
        where: { 
          userId,
          productId,
        //   delivered: true
        }
      });
      
      console.log('Eligibility check:', { userId, productId, hasVerifiedPurchase: !!verifiedPurchase });
      res.json({ canReview: !!verifiedPurchase });
    } catch (error) {
      console.error('Eligibility check failed:', error);
      res.status(500).json({ error: 'Failed to check eligibility' });
    }
  };