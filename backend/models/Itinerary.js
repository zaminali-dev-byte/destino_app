const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    activities: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema, 'itinerary');
