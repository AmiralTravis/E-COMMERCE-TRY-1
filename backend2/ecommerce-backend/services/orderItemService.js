// // services/orderItemService.js
// const { OrderItem, sequelize } = require('../models');

// exports.createOrderItems = async (orderId, cartItems) => {
//   const t = await sequelize.transaction();
  
//   try {
//     const orderItems = await Promise.all(
//       cartItems.map(item => OrderItem.create({
//         orderId: orderId,
//         productId: item.productId,
//         quantity: item.quantity,
//         subtotal: item.price * item.quantity
//       }, { transaction: t }))
//     );

//     await t.commit();
//     return orderItems;
//   } catch (error) {
//     await t.rollback();
//     throw error;
//   }
// };

const { OrderItems } = require('../models');
const sequelize = require('../models').sequelize;

exports.createOrderItems = async (orderId, cartItems) => {
  const t = await sequelize.transaction();
  
  try {
    const orderItems = await Promise.all(
      cartItems.map(item => OrderItems.create({
        orderId: orderId,
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }, { transaction: t }))
    );

    await t.commit();
    return orderItems;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};