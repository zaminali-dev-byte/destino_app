const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// ─── Admin: Get all payments ──────────────────────────────────────────────────
exports.getAll = async (req, res) => {
    try {
        const data = await Payment.find()
            .sort({ createdAt: -1 })
            .populate('bookingId')
            .populate('userId', 'name email');
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await Payment.findById(req.params.id);
        if (data) res.json(data);
        else res.status(404).json({ message: 'Not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Create payment & auto-confirm booking ────────────────────────────────────
exports.create = async (req, res) => {
    try {
        const { bookingId, amount, paymentMethod, couponCode, discountAmount } = req.body;

        if (!bookingId) {
            return res.status(400).json({ message: 'bookingId is required.' });
        }

        // Build transaction ID
        const transactionId = 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 9000 + 1000);

        const paymentData = {
            bookingId,
            userId:        req.user._id,
            amount:        parseFloat(amount) || 0,
            paymentMethod: paymentMethod || 'Credit Card',
            status:        'Completed',
            transactionId
        };

        const newPayment = new Payment(paymentData);
        const savedPayment = await newPayment.save();

        // Auto-confirm the associated booking
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: 'Confirmed', paymentStatus: 'Paid' },
            { new: true }
        );

        res.status(201).json({
            ...savedPayment.toObject(),
            booking: updatedBooking
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ─── Customer: Get own payments ───────────────────────────────────────────────
exports.getPersonal = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const data = await Payment.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('bookingId');
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updatedData = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteRecord = async (req, res) => {
    try {
        await Payment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
