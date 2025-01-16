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
    const { account, type, amount, category, accountType } = req.body;  

    
    const accountToUpdate = await Account.findById(account);  
    if (!accountToUpdate) {
        return res.status(404).json({ message: 'Account not found' });
    }

    
    const transactionData = {
        account,
        accountType,  
        type,
        amount,
    };

    if (type === 'Expense' && category) {
        transactionData.category = category;
    }

    const transaction = new Transaction(transactionData);
    await transaction.save();

    if (type === 'Income') {
        accountToUpdate.balance += amount;
    } else {
        accountToUpdate.balance -= amount;
    }
    await accountToUpdate.save();

    res.status(201).json(transaction);
});


module.exports = { getTransactions, createTransaction };
