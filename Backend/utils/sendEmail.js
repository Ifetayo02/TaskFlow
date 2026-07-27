// server/utils/sendEmail.js
const Brevo = require('@getbrevo/brevo');

const client = Brevo.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new Brevo.TransactionalEmailsApi();

const sendEmail = async ({ to, subject, html }) => {
  try {
    const email = new Brevo.SendSmtpEmail();

    email.subject = subject;
    email.htmlContent = html;
    email.sender = {
      name: 'TaskFlow',
      email: process.env.BREVO_SENDER_EMAIL,
    };
    email.to = [{ email: to }];

    const data = await apiInstance.sendTransacEmail(email);
    console.log(`Email sent to ${to}:`, data.messageId || 'sent');
    return data;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

module.exports = sendEmail;