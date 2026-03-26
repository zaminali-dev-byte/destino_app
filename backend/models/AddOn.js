const mongoose = require('mongoose');

const addOnSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ['Meal', 'Equipment', 'Guide', 'Transport', 'Other'], default: 'Other' },
    available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('AddOn', addOnSchema, 'add_on');
