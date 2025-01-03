// /services/verifiedPurchaseService.js

const { Order, OrderItems, VerifiedPurchase } = require('../models');

/**
 * Create Verified Purchases for a given order ID if the order status is "Delivered".
 * @param {number} orderId - The ID of the delivered order.
 */
const createVerifiedPurchases = async (orderId) => {
  try {
    console.log(`Attempting to create Verified Purchases for Order ID: ${orderId}`);
    
    // Fetch the delivered order along with its items
    const order = await Order.findOne({
      where: { id: orderId, status: 'Delivered' },
      include: [{
        model: OrderItems,
        attributes: ['productId'],
      }],
    });

    if (!order) {
      console.warn(`Order with ID ${orderId} not found or is not in "Delivered" status.`);
      return;
    }

    console.log(`Order retrieved:`, {
      userId: order.userId,
      orderId: order.id,
      itemCount: order.OrderItems.length,
    });

    // Map order items to create verified purchase entries
    const verifiedPurchases = order.OrderItems.map((item) => ({
      userId: order.userId,
      productId: item.productId,
      orderId: order.id,
    }));

    console.log(`Prepared Verified Purchase entries:`, verifiedPurchases);

    // Bulk insert the records, ignoring duplicates
    const createdRecords = await VerifiedPurchase.bulkCreate(verifiedPurchases, {
      ignoreDuplicates: true,
    });

    console.log(`${createdRecords.length} Verified Purchases successfully added for Order ID: ${orderId}`);
  } catch (err) {
    console.error(`Failed to create Verified Purchases for Order ID: ${orderId}`, err);
    throw err;
  }
};

module.exports = {
  createVerifiedPurchases,
};
