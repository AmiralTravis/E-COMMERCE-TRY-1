// controllers/cartController.js
const { Carts, Product } = require('../models/index'); // Import from indexModels.js


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
    
    // Query to include the Product model
    const cart = await Carts.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Product,
        as: 'product', // Use the alias defined in indexModels.js
        attributes: ['id', 'name', 'price'], // Specify the attributes you want to retrieve
      }],
      logging: console.log // Log the SQL query for debugging
    });

    console.log('Fetched cart items:', JSON.stringify(cart, null, 2)); // Log the cart items

    // Log the associations
    console.log('Carts Associations:', Carts.associations);
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
    const existingItem = await Carts.findOne({ // Updated to use Carts
      where: { userId, productId }
    });

    if (existingItem) {
      console.log('Item already exists in cart, updating quantity.');
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.json(existingItem);
    } else {
      console.log('Creating new item in cart.');
      const newItem = await Carts.create({ // Updated to use Carts
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
    const { cartItemId } = req.params; // Use cartItemId instead of productId
    const { quantity } = req.body;

    console.log(`User ID: ${userId}, Cart Item ID: ${cartItemId}, New Quantity: ${quantity}`);
    
    // Find the cart item by its cartItemId and userId
    const cartItem = await Carts.findOne({
      where: { id: cartItemId, userId } // Ensure it's for the correct cart item and user
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
    const { cartItemId } = req.params; // Changed to cartItemId

    console.log(`User ID: ${userId}, Cart Item ID: ${cartItemId}`);
    
    // Use cartItemId to find the cart item for the specific user
    const result = await Carts.destroy({
      where: { userId, id: cartItemId } // Use id instead of productId
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
