const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const asyncHandler = require('../middleware/asyncHandler');

// Get all transactions
const getTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find().populate('account category');
    res.json(transactions);
});

// Create a transaction
const createTransaction = asyncHandler(async (req, res) => {
    const { account, type, amount, category } = req.body;
    const transactionData = { account, type, amount };

    if (type === 'Expense' && category) {
        transactionData.category = category;
    }

    const transaction = new Transaction(transactionData);
    await transaction.save();

    const accountToUpdate = await Account.findById(account);
    if (type === 'Income') accountToUpdate.balance += amount;
    else accountToUpdate.balance -= amount;
    await accountToUpdate.save();

    res.status(201).json(transaction);
});

module.exports = { getTransactions, createTransaction };
