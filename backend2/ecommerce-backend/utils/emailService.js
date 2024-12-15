// // ecommerce-backend/emailService.js
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD
//   }
// });

// async function sendEmail(to, subject, text) {
//   try {
//     const info = await transporter.sendMail({
//       from: process.env.GMAIL_USER,
//       to: to,
//       subject: subject,
//       text: text
//     });
//     console.log('Email sent: %s', info.messageId);
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// }

// module.exports = { sendEmail };

// ecommerce-backend/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

async function sendOrderConfirmationEmail(user, order) {
  const subject = `Order Confirmation - Order #${order.trackingNumber}`;
  const text = `
Hello ${user.username},

Your order has been successfully placed!

Order Details:
- Order Number: ${order.trackingNumber}
- Total Amount: $${order.totalAmount}
- Status: ${order.status}
- Estimated Delivery: ${order.estimatedDeliveryDate.toLocaleDateString()}

Thank you for your purchase!
`;

  await sendEmail(user.email, subject, text);
}

async function sendDeliveryNotificationEmail(user, order) {
  const subject = `Your Order #${order.trackingNumber} is Out for Delivery`;
  const text = `
Hello ${user.username},

Your order is out for delivery today!

Order Details:
- Order Number: ${order.trackingNumber}
- Delivery Date: ${new Date().toLocaleDateString()}

Thank you for your business!
`;

  await sendEmail(user.email, subject, text);
}

async function sendEmail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject,
      text: text
    });
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = { 
  sendOrderConfirmationEmail, 
  sendDeliveryNotificationEmail 
};