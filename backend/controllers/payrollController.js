const Payroll = require('../models/Payroll');
const User = require('../models/User');

exports.processPayroll = async (req, res) => {
    try {
        const { staffId, month, leavesTaken = 0, bonus = 0 } = req.body;
        
        const staff = await User.findById(staffId);
        if (!staff) return res.status(404).json({ message: 'Staff member not found' });

        const baseSalary = staff.salary;
        const dailyWage = baseSalary / 30; // Assuming 30 days a month for simple calculation
        const leaveDeduction = dailyWage * leavesTaken;
        const netSalary = baseSalary - leaveDeduction + Number(bonus);

        staff.walletBalance = (staff.walletBalance || 0) + netSalary;
        await staff.save();

        const payroll = new Payroll({
            staffId,
            month,
            baseSalary,
            leavesTaken,
            leaveDeduction,
            bonus,
            netSalary,
            status: 'Paid'
        });

        await payroll.save();
        res.status(201).json(payroll);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getPayroll = async (req, res) => {
    try {
        const payrolls = await Payroll.find().sort({ paymentDate: -1 }).populate('staffId', 'name position department');
        res.status(200).json(payrolls);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
