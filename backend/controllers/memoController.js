const Memo = require('../models/Memo');

exports.getMemos = async (req, res) => {
    try {
        const userDept = req.user.department;
        // Staff should see memos targeted to 'All' or their specific department
        // Admins can see all memos
        let query = {};
        if (req.user.role !== 'admin') {
            query = { departmentTarget: { $in: ['All', userDept] } };
        }
        const memos = await Memo.find(query).populate('author', 'name role department').sort({ createdAt: -1 });
        res.json(memos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createMemo = async (req, res) => {
    try {
        const { title, content, departmentTarget } = req.body;
        const newMemo = new Memo({
            title,
            content,
            departmentTarget: departmentTarget || 'All',
            author: req.user._id
        });
        const savedMemo = await newMemo.save();
        const populatedMemo = await Memo.findById(savedMemo._id).populate('author', 'name role department');
        res.status(201).json(populatedMemo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteMemo = async (req, res) => {
    try {
        const memo = await Memo.findById(req.params.id);
        if (!memo) return res.status(404).json({ message: 'Memo not found' });
        
        // Only author or admin can delete
        if (memo.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this memo' });
        }
        
        await memo.deleteOne();
        res.json({ message: 'Memo deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
