const express = require('express');
const { getTransactions, createTransaction } = require('../controllers/transactionController');
const router = express.Router();

router.route('/').get(getTransactions).post(createTransaction);

module.exports = router;
