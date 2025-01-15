import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    balance: { type: Number, required: true },
    password: { type: String, required: true }, // Ensure this field exists
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
