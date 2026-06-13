const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    featured: { type: Boolean, default: false },
    location: { type: String, default: 'Pakistan' },
    lat: { type: Number, default: 33.6844 },
    lng: { type: Number, default: 73.0479 }
}, { timestamps: true });

module.exports = mongoose.model('Tour', tourSchema);
