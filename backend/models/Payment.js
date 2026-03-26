const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentMethod: { type: String, enum: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash'], required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Pending' },
    transactionId: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema, 'payment');
