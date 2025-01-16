import Account from '../models/Account.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config.js';

import { generateToken, hashPassword, comparePassword } from './authHelpers.js'; // Import helper functions

// Get all accounts
export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching accounts', error });
    }
};

// Create new account
export const createAccount = async (req, res) => {
    const { name, email, type, balance, password } = req.body;

    try {
        // Check if the user exists
        let userAccount = await Account.findOne({ email });

        if (userAccount) {
            // Check if the account type already exists
            const accountIndex = userAccount.accounts.findIndex(
                (account) => account.type === type
            );

            if (accountIndex >= 0) {
                // Update the balance of the existing account type
                userAccount.accounts[accountIndex].balance += balance;
            } else {
                // Add a new account type if it doesn't exist
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

        // Create a new account if none exists
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
// Login account
export const loginAccount = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password' });
    }

    try {
        // Find the account by email
        const account = await Account.findOne({ email });

        if (!account) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, account.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: account._id, name: account.name, email: account.email }, // Include user details in the token payload
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
            }, // Include user details in the response
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};
