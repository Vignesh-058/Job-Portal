const { Queue } = require('bullmq');
const redisClient = require('../../utils/redis');

const logger = require('../../config/logger');

let emailQueue;
if (process.env.NODE_ENV === 'test') {
  emailQueue = { add: jest.fn() };
} else if (redisClient.isMock) {
  emailQueue = {
    add: async (name, data) => {
      logger.info(`[Mock Email Queue] Adding job: ${name}`);
      setImmediate(async () => {
        try {
          const sendEmail = require('../../config/mailer');
          if (name === 'sendVerificationEmail') {
            await sendEmail({
              email: data.email,
              subject: 'Verify your Job Portal Account',
              message: `Please verify your account by clicking the link: \n\n ${data.verifyUrl}`
            });
          } else if (name === 'sendPasswordResetEmail') {
            await sendEmail({
              email: data.email,
              subject: 'Password Reset OTP Code',
              message: `You requested a password reset. Your OTP code is: \n\n ${data.otp} \n\n This code will expire in 10 minutes.`
            });
          }
          logger.info(`[Mock Email Queue] Job ${name} completed successfully.`);
        } catch (err) {
          logger.error(`[Mock Email Queue] Job ${name} failed: ${err.message}`);
        }
      });
      return { id: `mock-email-${Date.now()}` };
    }
  };
} else {
  emailQueue = new Queue('emailQueue', { connection: redisClient });
}

module.exports = emailQueue;
