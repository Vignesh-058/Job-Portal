const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'ethereal_user',
    pass: process.env.SMTP_PASS || 'ethereal_pass'
  }
});

const sendEmail = async (options) => {
  try {
    const message = {
      from: `${process.env.FROM_NAME || 'JobPortal'} <${process.env.FROM_EMAIL || 'noreply@jobportal.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message // Fallback to raw text if html is not provided
    };

    const info = await transporter.sendMail(message);
    logger.info(`Message sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    // If running without real SMTP, we might just log it and proceed so testing isn't blocked.
    if (process.env.NODE_ENV === 'production') throw error;
  }
};

module.exports = sendEmail;
