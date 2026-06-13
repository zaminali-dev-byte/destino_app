const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true }, // Format: YYYY-MM
    baseSalary: { type: Number, required: true },
    deductions: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Paid' },
    leavesTaken: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Payroll', payrollSchema, 'payroll');
