const { Worker } = require('bullmq');
const { sendEmail } = require('../../config/mailer');
const logger = require('../../config/logger');
const redisClient = require('../../utils/redis');

let emailWorker;

if (redisClient.isMock) {
  logger.info('Using Mock Email Worker (no real Worker started)');
  emailWorker = {};
} else {
  emailWorker = new Worker('emailQueue', async job => {
    if (job.name === 'sendVerificationEmail') {
      await sendEmail({
        email: job.data.email,
        subject: 'Verify your Job Portal Account',
        message: `Please verify your account by clicking the link: \n\n ${job.data.verifyUrl}`
      });
    } else if (job.name === 'sendPasswordResetEmail') {
      await sendEmail({
        email: job.data.email,
        subject: 'Password Reset Request',
        message: `You requested a password reset. Please make a PUT request to: \n\n ${job.data.resetUrl}`
      });
    }
  }, { connection: redisClient });

  emailWorker.on('completed', job => {
    logger.info(`Email job ${job.id} has completed!`);
  });

  emailWorker.on('failed', (job, err) => {
    logger.error(`Email job ${job.id} has failed with ${err.message}`);
  });
}

module.exports = emailWorker;
