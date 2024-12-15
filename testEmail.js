const nodemailer = require('nodemailer');
const transporter = require('./config/nodemailer');

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: 'your-email@gmail.com', // replace with your email
      to: 'recipient-email@example.com', // replace with a test email
      subject: 'Test Email',
      text: 'This is a test email sent using Nodemailer!',
    });
    console.log('Test email sent successfully:', info);
  } catch (error) {
    console.log('Error sending test email:', error);
  }
}

sendTestEmail();
