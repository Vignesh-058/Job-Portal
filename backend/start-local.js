const { MongoMemoryServer } = require('mongodb-memory-server');

async function start() {
  console.log('Starting in-memory MongoDB...');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  console.log(`In-memory MongoDB started at ${uri}`);
  
  // Set required environment variables
  process.env.MONGO_URI = uri;
  process.env.JWT_SECRET = 'local_jwt_secret_for_dev';
  process.env.JWT_REFRESH_SECRET = 'local_jwt_refresh_secret_for_dev';
  process.env.PORT = '5000';
  
  // Start the actual server
  require('./server.js');
}

start().catch(err => {
  console.error('Failed to start local server:', err);
  process.exit(1);
});
