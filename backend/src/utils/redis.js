const Redis = require('ioredis');
const RedisMock = require('ioredis-mock');
const logger = require('../config/logger');

// Auto-fallback to mock redis if there's no REDIS_URI defined to prevent crashing
const isLocalDev = !process.env.REDIS_URI;

const redisClient = isLocalDev 
  ? new RedisMock() 
  : new Redis(process.env.REDIS_URI);

redisClient.isMock = isLocalDev;

if (isLocalDev) {
  redisClient.call = function(command, ...args) {
    if (typeof this[command] === 'function') {
      return this[command](...args);
    }
    throw new Error(`Command ${command} is not supported on mock redis`);
  };
}

redisClient.on('connect', () => {
  logger.info(`Connected to ${isLocalDev ? 'Mock ' : ''}Redis`);
});

redisClient.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

module.exports = redisClient;
