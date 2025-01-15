import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate a JWT Token
export const generateToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '15h',
    });
};

// Hash a Password
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

// Compare Passwords
export const comparePassword = async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
};
