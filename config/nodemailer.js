const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (options) => {
  // Create transporter using SMTP configuration
  const transporter = nodemailer.createTransport({
    secure: true,
    service: process.env.SERVICE, // E.g., Gmail, Outlook
    auth: {
      user: process.env.MAIL_ID, // Your email address
      pass: process.env.MAIL_PASSWORD, // Your email password or app-specific password
    },
  });

  // Email options configuration
  const mailOptions = {
    from: process.env.MAIL_ID,
    to: options.email, // Recipient email address
    subject: options.subject, // Subject of the email
    html: options.html, // HTML body of the email
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Throw error so controller can handle it
  }
};

module.exports = sendMail;
        