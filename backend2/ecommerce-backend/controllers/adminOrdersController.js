async function updateOrderStatus(req, res) {
    const { orderId, status } = req.body;
    
    try {
      const order = await Order.findByPk(orderId);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      order.status = status;
      
      if (status === 'Shipped') {
        order.estimatedDeliveryDate = calculateShippedDeliveryDate();
      }
      
      if (status === 'Delivered') {
        await sendDeliveryNotification(order);
      }
  
      await order.save();
  
      res.json({ 
        success: true, 
        order 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  function calculateShippedDeliveryDate() {
    const today = new Date();
    today.setDate(today.getDate() + 3);  // 3 days shipping
    return today;
  }
  
  async function sendDeliveryNotification(order) {
    // Implement email/notification logic
  }
  
  module.exports = { updateOrderStatus };