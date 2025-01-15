require('dotenv').config();
const cors = require('cors');

const express = require('express');
const connectDB = require('./config/db');
const { MONGO_URI, PORT } = require('./config/config');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

connectDB();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);

app.use(errorMiddleware);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
