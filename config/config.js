const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/walletApp',
  PORT: process.env.PORT || 5000,
  secret: process.env.SESSION_SECRET || 'df390ee03b7f31fc0bdebf77562726c1f34c9e153c1fbb61ddb6d50f1b0f67c6',
};
