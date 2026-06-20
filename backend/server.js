const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const http = require('http');
const RedisStore = require('rate-limit-redis').default;
const redisClient = require('./src/utils/redis');

const connectDB = require('./src/config/db');
const logger = require('./src/config/logger');
const socketConfig = require('./src/config/socket');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

// Start Workers (Skip in tests to prevent BullMQ connection loops)
if (process.env.NODE_ENV !== 'test') {
  require('./src/jobs/workers/emailWorker');
  require('./src/jobs/workers/notificationWorker');
}

// Load env vars
dotenv.config();

// Connect to Database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();
const server = http.createServer(app);

// Init Socket.io
socketConfig.init(server);

// Logging Middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  store: (process.env.NODE_ENV === 'test' || redisClient.isMock) ? undefined : new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});
app.use('/api/', limiter);

// Routes
const healthRoute = require('./src/api/v1/health');
const authRoute = require('./src/api/v1/auth');
const jobsRoute = require('./src/api/v1/jobs');
const applicationsRoute = require('./src/api/v1/applications');
const profileRoute = require('./src/api/v1/profile');
const adminRoute = require('./src/api/v1/admin');
const companyRoute = require('./src/api/v1/company');
const notificationsRoute = require('./src/api/v1/notifications');
const savedJobsRoute = require('./src/api/v1/savedJobs');
const recruiterRoute = require('./src/api/v1/recruiter');

app.use('/health', healthRoute);

for (const prefix of ['/api/v1', '/api']) {
  app.use(`${prefix}/auth`, authRoute);
  app.use(`${prefix}/jobs`, jobsRoute);
  app.use(`${prefix}/applications`, applicationsRoute);
  app.use(`${prefix}/profile`, profileRoute);
  app.use(`${prefix}/admin`, adminRoute);
  app.use(`${prefix}/company`, companyRoute);
  app.use(`${prefix}/notifications`, notificationsRoute);
  app.use(`${prefix}/saved-jobs`, savedJobsRoute);
  app.use(`${prefix}/recruiter`, recruiterRoute);
}

// Swagger Docs
const swaggerDocs = require('./src/config/swagger');
swaggerDocs(app);

// Basic route
app.get('/', (req, res) => {
  res.send('Job Portal Enterprise API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
