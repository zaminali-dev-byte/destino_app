const Complaint = require('../models/Complaint');

// Get all complaints (Admin)
exports.getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get personal complaints (Customer)
exports.getMyComplaints = async (req, res) => {
    try {
        if (!req.user || !req.user.email) return res.status(401).json({ message: 'User not authenticated' });
        const complaints = await Complaint.find({ email: req.user.email }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a complaint (Customer)
exports.createComplaint = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            customerName: req.user.name,
            email: req.user.email
        };
        const newComplaint = new Complaint(payload);
        const savedComplaint = await newComplaint.save();
        res.status(201).json(savedComplaint);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update complaint status/reply (Admin)
exports.updateComplaint = async (req, res) => {
    try {
        const updated = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete complaint (Admin)
exports.deleteComplaint = async (req, res) => {
    try {
        await Complaint.findByIdAndDelete(req.params.id);
        res.json({ message: 'Complaint deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
