const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can be a Tour or Hotel ID
    targetType: { type: String, enum: ['Tour', 'Hotel'], required: true },
    overallRating: { type: Number, required: true, min: 1, max: 5 },
    guideRating: { type: Number, min: 1, max: 5 }, // Primarily for Tours
    cleanlinessRating: { type: Number, min: 1, max: 5 }, // Primarily for Hotels
    valueRating: { type: Number, min: 1, max: 5 },
    comment: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
