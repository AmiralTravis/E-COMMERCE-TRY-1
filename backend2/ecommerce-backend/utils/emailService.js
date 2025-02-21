// // ecommerce-backend/utils/emailService.js
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD
//   }
// });

// async function sendOrderConfirmationEmail(user, order) {
//   const subject = `Order Confirmation - Order #${order.trackingNumber}`;
//   const text = `
// Hello ${user.username},

// Your order has been successfully placed!

// Order Details:
// - Order Number: ${order.trackingNumber}
// - Total Amount: $${order.totalAmount}
// - Status: ${order.status}
// - Estimated Delivery: ${order.estimatedDeliveryDate.toLocaleDateString()}

// Thank you for your purchase!
// `;

//   await sendEmail(user.email, subject, text);
// }


// async function sendDeliveryNotificationEmail(user, order) {
//   if (!user || !user.email) {
//     console.warn('Cannot send delivery notification: User or email missing.');
//     return;
//   }

//   const subject = `Your Order #${order.trackingNumber} is Out for Delivery`;
//   const text = `
// Hello ${user.username},

// Your order is out for delivery today!

// Order Details:
// - Order Number: ${order.trackingNumber}
// - Delivery Date: ${new Date(order.estimatedDeliveryDate).toLocaleDateString()}

// Thank you for your business!
// `;

//   try {
//     await sendEmail(user.email, subject, text);
//   } catch (error) {
//     console.error('Error sending delivery notification email:', error);
//     throw error;
//   }
// }

// module.exports = {
//   sendOrderConfirmationEmail,
//   sendDeliveryNotificationEmail, // Keep it here
// };


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

// module.exports = { 
//   sendOrderConfirmationEmail, 
//   sendDeliveryNotificationEmail 
// };
// ecommerce-backend/utils/emailService.js
const nodemailer = require('nodemailer');

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Send order confirmation email
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

// Send delivery notification email
async function sendDeliveryNotificationEmail(user, order) {
  if (!user || !user.email) {
    console.warn('Cannot send delivery notification: User or email missing.');
    return;
  }

  const subject = `Your Order #${order.trackingNumber} is Out for Delivery`;
  const text = `
Hello ${user.username},

Your order is out for delivery today!

Order Details:
- Order Number: ${order.trackingNumber}
- Delivery Date: ${new Date(order.estimatedDeliveryDate).toLocaleDateString()}

Thank you for your business!
`;

  try {
    await sendEmail(user.email, subject, text);
  } catch (error) {
    console.error('Error sending delivery notification email:', error);
    throw error;
  }
}

// Send password reset email
async function sendPasswordResetEmail(user, resetToken) {
  const subject = 'Password Reset Request';
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const text = `
Hello ${user.username},

You requested a password reset. Please click the link below to continue:

${resetUrl}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.
`;

  try {
    await sendEmail(user.email, subject, text);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

// Generic email sending function
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
  sendDeliveryNotificationEmail,
  sendPasswordResetEmail
};