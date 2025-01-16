const Account = require('../models/Account'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');
const config = require('../config/config'); 
const { generateToken, hashPassword, comparePassword } = require('./authHelpers'); // Import helper functions


const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching accounts', error });
    }
};

const createAccount = async (req, res) => {
    const { name, email, type, balance, password } = req.body;

    try {

        let userAccount = await Account.findOne({ email });

        if (userAccount) {

            const accountIndex = userAccount.accounts.findIndex(
                (account) => account.type === type
            );

            if (accountIndex >= 0) {
                userAccount.accounts[accountIndex].balance += balance;
            } else {
                if (userAccount.accounts.length >= 3) {
                    return res.status(400).json({
                        message: 'You can only create up to three accounts with the same email.',
                    });
                }

                userAccount.accounts.push({ type, balance });
            }

            await userAccount.save();
            return res.status(200).json(userAccount);
        }

        const hashedPassword = await hashPassword(password);

        const newAccount = new Account({
            name,
            email,
            accounts: [{ type, balance }],
            password: hashedPassword,
        });

        await newAccount.save();
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(500).json({ message: 'Error creating or updating account', error });
    }
};

const loginAccount = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password' });
    }

    try {
        const account = await Account.findOne({ email });

        if (!account) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, account.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: account._id, name: account.name, email: account.email },
            config.secret,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: account._id,
                name: account.name,
                email: account.email,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};

module.exports = { getAccounts, createAccount, loginAccount };
