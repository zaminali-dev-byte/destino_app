const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
    try {
        const data = await User.find({ role: { $in: ['staff', 'admin'] } }).select('-passwordHash');
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await User.findOne({ _id: req.params.id, role: { $in: ['staff', 'admin'] } }).select('-passwordHash');
        if (data) res.json(data);
        else res.status(404).json({ message: 'Not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { password, ...staffData } = req.body;
        const plainPassword = password || 'Staff@123!';
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(plainPassword, salt);

        const newData = new User({
            ...staffData,
            role: 'staff',
            passwordHash
        });
        
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.passwordHash = await bcrypt.hash(password, salt);
        }

        const updatedData = await User.findOneAndUpdate(
            { _id: req.params.id, role: { $in: ['staff', 'admin'] } }, 
            updateData, 
            { new: true }
        );
        res.json(updatedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteRecord = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const Booking = require('../models/Booking');
const Expense = require('../models/Expense');
const Payroll = require('../models/Payroll');
const JobApplication = require('../models/JobApplication');

exports.getStats = async (req, res) => {
    try {
        const dept = req.user.department;
        let stats = {};

        if (dept === 'Finance' || dept === 'Human Resources' || req.user.role === 'admin') {
            const expenses = await Expense.find();
            const payrolls = await Payroll.find();
            const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
            const totalPayroll = payrolls.reduce((sum, p) => sum + p.baseSalary + (p.bonus||0) - (p.deductions||0), 0);
            const staffCount = await User.countDocuments({ role: { $in: ['staff', 'admin'] } });
            const pendingApps = await JobApplication.countDocuments({ status: 'Pending' });
            
            stats.finance = {
                totalExpenses,
                totalPayroll,
                staffCount,
                pendingApps
            };
        }

        if (dept === 'Sales' || dept === 'Marketing' || dept === 'Customer Service' || req.user.role === 'admin') {
            const bookings = await Booking.find();
            const totalBookings = bookings.length;
            const completedBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Paid').length;
            
            // Simple monthly grouping
            const monthlyBookingsData = [0,0,0,0,0,0,0,0,0,0,0,0];
            bookings.forEach(b => {
                const m = new Date(b.createdAt).getMonth();
                monthlyBookingsData[m]++;
            });

            stats.sales = {
                totalBookings,
                completedBookings,
                monthlyBookingsData
            };
        }

        if (dept === 'Transport' || dept === 'Field Operations' || req.user.role === 'admin') {
            const myTasks = await Booking.find({ assignedStaff: req.user._id });
            const pendingTasks = myTasks.filter(t => t.assignmentStatus === 'Pending' || t.assignmentStatus === 'Assigned').length;
            const acceptedTasks = myTasks.filter(t => t.assignmentStatus === 'Accepted').length;
            
            stats.operations = {
                totalAssigned: myTasks.length,
                pendingTasks,
                acceptedTasks
            };
        }

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const Memo = require('../models/Memo');

exports.getActivity = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const [memos, tasks, payrolls, expenses] = await Promise.all([
            Memo.find({ author: userId }).sort({ createdAt: -1 }).limit(5),
            Booking.find({ assignedStaff: userId }).sort({ updatedAt: -1 }).limit(5),
            Payroll.find({ staffId: userId }).sort({ paymentDate: -1 }).limit(5),
            Expense.find({ staffId: userId }).sort({ date: -1 }).limit(5)
        ]);

        let activities = [];

        memos.forEach(m => activities.push({
            id: m._id,
            type: 'Memo',
            title: `Posted a memo: "${m.title}"`,
            date: m.createdAt,
            icon: 'fa-bullhorn',
            color: '#8b5cf6'
        }));

        tasks.forEach(t => activities.push({
            id: t._id,
            type: 'Task',
            title: `Trip status: ${t.assignmentStatus} for ${t.customerName}`,
            date: t.updatedAt || t.createdAt,
            icon: 'fa-car',
            color: '#3b82f6'
        }));

        payrolls.forEach(p => activities.push({
            id: p._id,
            type: 'Payroll',
            title: `Received Salary for ${p.month}: $${Math.round(p.netSalary)}`,
            date: p.paymentDate,
            icon: 'fa-money-check-alt',
            color: '#10b981'
        }));

        expenses.forEach(e => activities.push({
            id: e._id,
            type: 'Expense',
            title: `Logged Expense: $${e.amount} for ${e.category}`,
            date: e.date,
            icon: 'fa-receipt',
            color: '#f59e0b'
        }));

        // Sort combined activities by date descending
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        res.json(activities.slice(0, 15));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
