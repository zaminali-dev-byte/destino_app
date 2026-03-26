const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Tour', tourSchema);
