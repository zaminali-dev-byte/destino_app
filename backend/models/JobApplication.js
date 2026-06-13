const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    cnic: { type: String, required: true },
    education: { type: String, required: true },
    license: { type: String },
    coverLetter: { type: String },
    status: { type: String, enum: ['Pending', 'Hired', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
