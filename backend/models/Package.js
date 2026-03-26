const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema, 'package');
