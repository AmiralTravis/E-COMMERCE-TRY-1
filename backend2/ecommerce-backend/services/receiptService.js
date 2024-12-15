// services/receiptService.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { Order, OrderItems, Product, UserAddress } = require('../models');

class ReceiptService {
  constructor(transporter) {
    this.transporter = transporter;
  }

  async generateReceipt(orderId) {
    // Fetch complete order details
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItems,
          include: [{ model: Product }]
        },
        { model: UserAddress }
      ]
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Create PDF
    const pdfPath = path.resolve(`./receipts/receipt-${orderId}.pdf`);
    const doc = new PDFDocument();
    
    doc.pipe(fs.createWriteStream(pdfPath));

    // Receipt Design
    doc.fontSize(20).text('Amazon Clone Order Receipt', { align: 'center' });
    doc.moveDown();
    
    // Order Details
    doc.fontSize(10)
       .text(`Order Number: #${order.id}`)
       .text(`Date: ${new Date().toLocaleDateString()}`)
       .moveDown();

    // Shipping Details
    const shippingAddress = order.UserAddress;
    doc.text('Shipping Address:')
       .text(`${shippingAddress.fullName}`)
       .text(`${shippingAddress.addressLine1}`)
       .text(`${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}`)
       .moveDown();

    // Items
    doc.text('Order Items:', { underline: true });
    let total = 0;
    order.OrderItems.forEach(item => {
      const itemTotal = item.quantity * item.Product.price;
      total += itemTotal;
      doc.text(`${item.Product.name} x ${item.quantity} - $${itemTotal.toFixed(2)}`);
    });

    doc.moveDown();
    doc.text(`Subtotal: $${total.toFixed(2)}`)
       .text(`Tax: $${(total * 0.08).toFixed(2)}`)
       .text(`Total: $${(total * 1.08).toFixed(2)}`, { bold: true });

    doc.end();

    return pdfPath;
  }

  async sendReceiptEmail(orderId, userEmail) {
    const receiptPath = await this.generateReceipt(orderId);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - Order #${orderId}`,
      html: `
        <h1>Thank you for your purchase!</h1>
        <p>Your order #${orderId} has been successfully processed.</p>
        <p>Please find the receipt attached.</p>
      `,
      attachments: [
        {
          filename: `receipt-${orderId}.pdf`,
          path: receiptPath
        }
      ]
    };

    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = ReceiptService;