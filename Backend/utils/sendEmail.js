// server/utils/sendEmail.js
const axios = require('axios');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: 'TaskFlow',
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
        },
      }
    );

    console.log(`Email sent to ${to}:`, response.data.messageId);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error(`Failed to send email to ${to}:`, message);
    throw new Error(message);
  }
};

module.exports = sendEmail;