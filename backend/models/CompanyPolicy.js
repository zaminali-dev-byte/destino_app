const mongoose = require('mongoose');

const companyPolicySchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['HR', 'Legal', 'Customer Service', 'General'], default: 'General' },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('CompanyPolicy', companyPolicySchema, 'company policy');
