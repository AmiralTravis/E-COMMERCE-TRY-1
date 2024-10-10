// // controllers/cartController.js
// const Cart = require('../models/cartModels');
// const Product = require('../models/productsModels');

// exports.getCart = async (req, res) => {
//   // Check if req.user is defined
//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   try {
//     const userId = req.user.id;
//     const cart = await Cart.findAll({
//       where: { userId },
//       include: [{
//         model: Product,
//         attributes: ['id', 'name', 'price', 'imageUrl']
//       }],
//       logging: console.log // Log the SQL query for debugging
//     });

//     console.log('Fetched cart items:', cart); // Log the cart items
//     res.json(cart);
//   } catch (error) {
//     console.error('Get cart error:', error);
//     res.status(500).json({ message: 'Failed to fetch cart items' });
//   }
// };

// exports.addToCart = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { productId, quantity = 1 } = req.body;

//     const existingItem = await Cart.findOne({
//       where: { userId, productId }
//     });

//     if (existingItem) {
//       // Update the quantity if the item already exists
//       existingItem.quantity += quantity;
//       await existingItem.save();
//       return res.json(existingItem);
//     } else {
//       // Create a new item in the cart if it doesn't exist
//       const newItem = await Cart.create({
//         userId,
//         productId,
//         quantity
//       });
//       return res.status(201).json(newItem);
//     }
//   } catch (error) {
//     console.error('Add to cart error:', error);
//     res.status(500).json({ message: 'Failed to add item to cart' });
//   }
// };

// exports.updateCart = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { productId } = req.params;
//     const { quantity } = req.body;

//     const cartItem = await Cart.findOne({
//       where: { userId, productId }
//     });

//     if (!cartItem) {
//       return res.status(404).json({ message: 'Cart item not found' });
//     }

//     // Update the quantity of the cart item
//     cartItem.quantity = quantity;
//     await cartItem.save();
//     res.json(cartItem);
//   } catch (error) {
//     console.error('Update cart error:', error);
//     res.status(500).json({ message: 'Failed to update cart item' });
//   }
// };

// exports.removeFromCart = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { productId } = req.params;

//     const result = await Cart.destroy({
//       where: { userId, productId }
//     });

//     if (!result) {
//       return res.status(404).json({ message: 'Cart item not found' });
//     }

//     // Successfully removed the item from the cart
//     res.status(204).send();
//   } catch (error) {
//     console.error('Remove from cart error:', error);
//     res.status(500).json({ message: 'Failed to remove item from cart' });
//   }
// };

// controllers/cartController.js
const Cart = require('../models/cartModels');
const Product = require('../models/productsModels');

exports.getCart = async (req, res) => {
  console.log('Entering getCart method...');

  // Check if req.user is defined
  if (!req.user || !req.user.id) {
    console.log('Unauthorized access attempt.');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userId = req.user.id;
    console.log('Fetching cart for user ID:', userId);
    const cart = await Cart.findAll({
      where: { userId },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'imageUrl']
      }],
      logging: console.log // Log the SQL query for debugging
    });

    console.log('Fetched cart items:', cart); // Log the cart items
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Failed to fetch cart items' });
  }
};

exports.addToCart = async (req, res) => {
  console.log('Entering addToCart method...');

  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    console.log(`User ID: ${userId}, Product ID: ${productId}, Quantity: ${quantity}`);
    const existingItem = await Cart.findOne({
      where: { userId, productId }
    });

    if (existingItem) {
      console.log('Item already exists in cart, updating quantity.');
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.json(existingItem);
    } else {
      console.log('Creating new item in cart.');
      const newItem = await Cart.create({
        userId,
        productId,
        quantity
      });
      return res.status(201).json(newItem);
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

exports.updateCart = async (req, res) => {
  console.log('Entering updateCart method...');

  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    console.log(`User ID: ${userId}, Product ID: ${productId}, New Quantity: ${quantity}`);
    const cartItem = await Cart.findOne({
      where: { userId, productId }
    });

    if (!cartItem) {
      console.log('Cart item not found for update.');
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Update the quantity of the cart item
    cartItem.quantity = quantity;
    await cartItem.save();
    console.log('Updated cart item:', cartItem);
    res.json(cartItem);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};

exports.removeFromCart = async (req, res) => {
  console.log('Entering removeFromCart method...');

  try {
    const userId = req.user.id;
    const { productId } = req.params;

    console.log(`User ID: ${userId}, Product ID: ${productId}`);
    const result = await Cart.destroy({
      where: { userId, productId }
    });

    if (!result) {
      console.log('Cart item not found for removal.');
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Successfully removed the item from the cart
    console.log('Successfully removed item from cart.');
    res.status(204).send();
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
};
