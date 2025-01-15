require('dotenv').config();
const cors = require('cors');

const express = require('express');
const connectDB = require('./config/db');
const { MONGO_URI, PORT } = require('./config/config');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

// Set up database connection
connectDB();

const app = express();

// CORS configuration to allow frontend URL
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://walletapp-9wli.onrender.com' : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true  // Allow credentials (cookies, etc.)
};

// Apply CORS middleware with the configuration
app.use(cors(corsOptions));

app.use(express.json());

// Route handlers
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
const server = app.listen(process.env.PORT || 10000, () => {
  console.log(`Server running on port ${process.env.PORT || 10000}`);
});

server.keepAliveTimeout = 120000;  // 120 seconds
server.headersTimeout = 120000;    // 120 seconds
