const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const redisClient = require('../../utils/redis');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime()
  });
});

router.get('/database', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'healthy' : 'unhealthy',
    database: isConnected ? 'connected' : 'disconnected'
  });
});

router.get('/redis', async (req, res) => {
  try {
    const ping = await redisClient.ping();
    if (ping === 'PONG') {
      return res.status(200).json({
        status: 'healthy',
        redis: 'connected'
      });
    }
    throw new Error('Redis ping failed');
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      redis: 'disconnected',
      error: error.message
    });
  }
});

module.exports = router;
