const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_API_KEY,
      },
    });

    const info = await transporter.sendMail({
      from: `"TaskFlow" <${process.env.BREVO_EMAIL}>`,
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