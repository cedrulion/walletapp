const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: { type: String, required: true },
    subcategories: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
