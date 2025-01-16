
//model
import mongoose from 'mongoose';

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

const Account = mongoose.model('Account', accountSchema);

export default Account;
