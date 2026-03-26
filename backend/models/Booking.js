const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
    date: { type: Date, required: true },
    guests: { type: Number, required: true, default: 1 },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
