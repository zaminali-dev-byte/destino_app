const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    adminReply: { type: String },
    status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
