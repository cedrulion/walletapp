const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    accounts: [
        {
            type: { type: String, required: true }, 
            balance: { type: Number, required: true, default: 0 },
        },
    ],
    password: { type: String, required: true },
});

module.exports = mongoose.model('Account', accountSchema);
