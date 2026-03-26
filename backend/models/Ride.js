const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    driverName: { type: String, required: true },
    vehicleType: { type: String, required: true },
    licensePlate: { type: String, required: true },
    capacity: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Booked', 'Maintenance'], default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema, 'ride');
