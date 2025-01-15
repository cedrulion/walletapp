const express = require('express');
const { getAccounts, createAccount, loginAccount } = require('../controllers/accountController');
const router = express.Router();

// Get all accounts
router.route('/').get(getAccounts).post(createAccount);

// Login an account
router.route('/login').post(loginAccount);

module.exports = router;
