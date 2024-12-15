// // const nodemailer = require('nodemailer');
// // const User = require('../models/userModel');
// // const EmailRecord = require('../models/emailrecords');
// // const templates = require('../routes/emailtemplate');
// // const validateEmail = require('../middlewares/emailvalidator');
// // const transporter = require('../config/nodemailer'); // Import the transporter
// // const translate = require('google-translate-api-x');

// // const sendEmail = async (req, res) => {
// //   const { subject, body, emailList, language } = req.body;

// //   if (!subject || !body || !emailList || !emailList.length) {
// //     return res.status(400).send('Missing email details');
// //   }

// //   try {
// //     const users = await User.findById(req.userId);
// //     if (!users) return res.status(400).send('User not found');

// //     let translatedBody = body;
// //     if (language && language !== 'en') {
// //       const translation = await translate(body, { to: language });
// //       translatedBody = translation.text;
// //     }

// //     const languageTemplate = templates[language] || templates.en;
// //     const personalizedBody = translatedBody.replace('{name}', users.name);

// //     // Use the transporter object to send the email
// //     const info = await transporter.sendMail({
// //       from: process.env.EMAIL_USER,  // From email (from .env)
// //       to: emailList.join(', '),      // List of recipient emails
// //       subject: subject || languageTemplate.subject,  // Subject
// //       text: personalizedBody,        // Email body content
// //     });

// //     // Save the email record to the database
// //     const emailRecord = new EmailRecord({
// //       senderEmail: users.email,
// //       recipients: emailList,
// //       subject: subject || languageTemplate.subject,
// //       body: personalizedBody,
// //       status: 'sent',
// //     });
// //     await emailRecord.save();

// //     res.status(200).send('Email sent successfully');
// //   } catch (err) {
// //     console.error('Error sending email:', err);

// //     // In case of an error, save a failed email record (optional)
// //     // const emailRecord = new EmailRecord({
// //     //   senderEmail: users.email,
// //     //   recipients: emailList,
// //     //   subject: subject,
// //     //   body: body,
// //     //   status: 'failed',
// //     // });
// //     // await emailRecord.save();

// //     res.status(500).send('Error sending email');
// //   }
// // };

// // module.exports = {
// //   sendEmail,
// // };

// const User = require('../models/userModel');
// const EmailRecord = require('../models/emailrecords');
// const templates = require('../routes/emailtemplate');
// const translate = require('google-translate-api-x');
// const sendMail = require('../config/nodemailer'); // Import the sendMail function

// const sendEmail = async (req, res) => {
//   const { subject, body, emailList, language } = req.body;

//   if (!subject || !body || !emailList || !emailList.length) {
//     return res.status(400).send('Missing email details');
//   }

//   try {
//     const users = await User.findById(req.userId);
//     if (!users) return res.status(400).send('User not found');

//     // Translation logic (if applicable)
//     let translatedBody = body;
//     if (language && language !== 'en') {
//       const translation = await translate(body, { to: language, forceTo: true  });
//       translatedBody = translation.text;
//     }

//     // Apply the correct language template
//     const languageTemplate = templates[language] || templates.en;
//     const personalizedBody = translatedBody.replace('{name}', users.name);

//     // Prepare email options
//     const emailOptions = {
//       email: emailList.join(', '),
//       subject: subject || languageTemplate.subject,
//       html: personalizedBody,  // Use the personalized HTML body
//     };

//     // Send email using the sendMail function
//     await sendMail(emailOptions);

//     // Save email record in the database
//     const emailRecord = new EmailRecord({
//       senderEmail: users.email,
//       recipients: emailList,
//       subject: subject || languageTemplate.subject,
//       body: personalizedBody,
//       status: 'sent',
//     });
//     await emailRecord.save();

//     res.status(200).send('Email sent successfully');
//   } catch (err) {
//     console.error(err);

//     // Save email record in case of failure
//     // const emailRecord = new EmailRecord({
//     //   senderEmail: users.email,
//     //   recipients: emailList,
//     //   subject: subject,
//     //   body: body,
//     //   status: 'failed',
//     // });
//     // await emailRecord.save();

//     res.status(500).send('Error sending email');
//   }
// };

// module.exports = {
//   sendEmail,
// };

// controllers/emailController.js
// controllers/emailController.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const translate = require('google-translate-api-x');
const User = require('../models/userModel');
const EmailRecord = require('../models/emailrecords');

// Enhanced Email Template
const emailTemplate = ({
  subject,

  body,
  name,
  year,
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        /* General Styles */
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            width: 100%;
            max-width: 800px;
            margin: 40px auto;
            padding: 40px;
            background-color: #ffffff;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            animation: fadeIn 1.5s ease-in-out;
        }
        h1 {
            font-size: 30px;
            color: #333;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .btn:hover {
            background-color: #0056b3;
            transform: translateY(-3px);
        }
        footer {
            text-align: center;
            color: #777;
            font-size: 14px;
            margin-top: 20px;
        }
        footer p {
            margin: 5px 0;
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            .email-container {
                padding: 20px;
                width: 90%;
            }
            h1 {
                font-size: 24px;
            }
            p {
                font-size: 14px;
            }
        }

        /* Animation */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>{subject},</h1>
        <p>${body}</p>
        <a href="#" class="btn">Welcome</a>
        <footer>
            <p>© ${year} Your Company</p>
        </footer>
    </div>
</body>
</html>
`;

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    secure: true,
    service: process.env.SERVICE,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_ID,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Email Sending Function
const sendEmail = async (req, res) => {
  const { subject, body, emailList, language, name } = req.body;

  if (!subject || !body || !emailList || !emailList.length) {
    return res.status(400).send('Missing email details');
  }

  try {
    const users = await User.findById(req.userId);
    if (!users) return res.status(400).send('User not found');

    // Translation logic for the body text (if applicable)
    let translatedBody = body;
    if (language && language !== 'en') {
      const translation = await translate(body, { to: language, forceTo: true });
      translatedBody = translation.text;
    }

    // Prepare the email content using the provided data and template
    const emailContent = emailTemplate({
      subject,
      name: users.name,
      body: translatedBody,
      year: new Date().getFullYear(),
    });

    // Send email using the sendMail function
    const emailOptions = {
      email: emailList.join(', '),
      subject: subject,
      html: emailContent,
    };

    await sendMail(emailOptions);

    // Save email record in the database
    const emailRecord = new EmailRecord({
      senderEmail: users.email,
      recipients: emailList,
      subject: subject,
      body: translatedBody,
      status: 'sent',
    });
    await emailRecord.save();

    res.status(200).send('Email sent successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending email');
  }
};

module.exports = {
  sendEmail,
};
