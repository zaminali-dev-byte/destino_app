const Booking = require('../models/Booking');

// Create new booking
exports.createBooking = async (req, res) => {
    try {
        const booking = new Booking(req.body);
        const savedBooking = await booking.save();
        res.status(201).json(savedBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all bookings (for admin)
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('tourId').populate('destinationId');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
