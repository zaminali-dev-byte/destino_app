const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    category: { 
        type: String, 
        required: true, 
        enum: ['Fuel', 'Maintenance', 'Salaries', 'Marketing', 'Office Supplies', 'Tour Expenses', 'Fines & Penalties', 'Other'] 
    },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    vehiclePlate: { type: String }, // Optional link to a specific vehicle
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional link to staff who made the expense
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' } // Optional link to a specific tour
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema, 'expense');
