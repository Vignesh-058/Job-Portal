const { Queue } = require('bullmq');
const redisClient = require('../../utils/redis');

const logger = require('../../config/logger');

let notificationQueue;
if (process.env.NODE_ENV === 'test') {
  notificationQueue = { add: jest.fn() };
} else if (redisClient.isMock) {
  notificationQueue = {
    add: async (name, data) => {
      logger.info(`[Mock Notification Queue] Adding job: ${name}`);
      setImmediate(async () => {
        try {
          const Notification = require('../../repositories/models/Notification');
          const socketConfig = require('../../config/socket');
          if (name === 'sendNotification') {
            const { userId, title, message, type, jobId, status } = data;
            
            // Save to DB
            await Notification.create({
              userId,
              title,
              message
            });

            // Emit Real-Time Socket Event
            const io = socketConfig.getIo();
            if (io) {
              io.emit(`notification-${userId}`, {
                type,
                jobId,
                status,
                title,
                message
              });
            }
          }
          logger.info(`[Mock Notification Queue] Job ${name} completed successfully.`);
        } catch (err) {
          logger.error(`[Mock Notification Queue] Job ${name} failed: ${err.message}`);
        }
      });
      return { id: `mock-notification-${Date.now()}` };
    }
  };
} else {
  notificationQueue = new Queue('notificationQueue', { connection: redisClient });
}

module.exports = notificationQueue;
