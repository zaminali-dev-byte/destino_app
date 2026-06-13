const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
    try {
        const { category, amount, description, date, vehiclePlate, staffId, tourId } = req.body;
        const newExpense = new Expense({ category, amount, description, date, vehiclePlate, staffId, tourId });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find()
            .sort({ date: -1 })
            .populate('staffId', 'name position')
            .populate('tourId', 'title');
        res.status(200).json(expenses);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getMyExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ staffId: req.user._id })
            .sort({ date: -1 })
            .populate('tourId', 'title');
        res.status(200).json(expenses);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
