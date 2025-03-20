// // controllers/cartController.js

const db = require('../models');
const { Cart, Product } = db;

exports.getCart = async (req, res) => {
  console.log('Entering getCart method...');

  if (!req.user || !req.user.id) {
    console.log('Unauthorized access attempt.');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userId = req.user.id;
    console.log('Fetching cart for user ID:', userId);
    
    const cart = await Cart.findAll({
      where: { userId: userId },
      include: [{
        model: Product,
        as: 'product', // Specify the alias here
        attributes: ['id', 'name', 'price', 'imageUrl'],
      }],
      logging: console.log
    });

    console.log('Fetched cart items:', JSON.stringify(cart, null, 2));
    console.log('Cart Associations:', Cart.associations);
    console.log('Product Associations:', Product.associations);

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
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    console.log(`User ID: ${userId}, Cart Item ID: ${cartItemId}, New Quantity: ${quantity}`);
    
    const cartItem = await Cart.findOne({
      where: { id: cartItemId, userId }
    });

    if (!cartItem) {
      console.log('Cart item not found for update.');
      return res.status(404).json({ message: 'Cart item not found' });
    }

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
    const { cartItemId } = req.params;

    console.log(`User ID: ${userId}, Cart Item ID: ${cartItemId}`);
    
    const result = await Cart.destroy({
      where: { id: cartItemId, userId }
    });

    if (!result) {
      console.log('Cart item not found for removal.');
      return res.status(404).json({ message: 'Cart item not found' });
    }

    console.log('Successfully removed item from cart.');
    res.status(204).send();
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
};

exports.clearCart = async (req, res) => {
  console.log('Entering clearCart method...');

  try {
    const userId = req.user.id;
    console.log(`Clearing cart for User ID: ${userId}`);
    
    const result = await Cart.destroy({
      where: { userId }
    });

    if (!result) {
      console.log('No cart items found to clear.');
      return res.status(404).json({ message: 'No cart items found' });
    }

    console.log('Successfully cleared cart.');
    res.status(204).send();
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};