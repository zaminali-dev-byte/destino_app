const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    department: { type: String },
    salary: { type: Number, required: true },
    hireDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema, 'staff');
