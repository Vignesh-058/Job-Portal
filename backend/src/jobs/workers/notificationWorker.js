const { Worker } = require('bullmq');
const Notification = require('../../repositories/models/Notification');
const socketConfig = require('../../config/socket');
const logger = require('../../config/logger');

const redisClient = require('../../utils/redis');

let notificationWorker;

if (redisClient.isMock) {
  logger.info('Using Mock Notification Worker (no real Worker started)');
  notificationWorker = {};
} else {
  notificationWorker = new Worker('notificationQueue', async job => {
    if (job.name === 'sendNotification') {
      const { userId, title, message, type, jobId, status } = job.data;
      
      // Save to DB
      await Notification.create({
        userId,
        title,
        message
      });

      // Emit Real-Time Socket Event
      const io = socketConfig.getIo();
      io.emit(`notification-${userId}`, {
        type,
        jobId,
        status,
        title,
        message
      });
    }
  }, { connection: redisClient });

  notificationWorker.on('completed', job => {
    logger.info(`Notification job ${job.id} has completed!`);
  });

  notificationWorker.on('failed', (job, err) => {
    logger.error(`Notification job ${job.id} has failed with ${err.message}`);
  });
}

module.exports = notificationWorker;
