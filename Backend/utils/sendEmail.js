// server/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Use explicitly instead of service: 'gmail'
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // This specifically forces Nodemailer to use IPv4
});

    const info = await transporter.sendMail({
      from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

module.exports = sendEmail;