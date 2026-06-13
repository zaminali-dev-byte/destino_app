const User = require('../models/User');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
    try {
        const data = await User.find().select('-passwordHash');
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await User.findById(req.params.id).select('-passwordHash');
        if (data) res.json(data);
        else res.status(404).json({ message: 'Not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newData = new User(req.body);
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updatedData = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            
            // Staff/Admin specific professional profile fields
            if (user.role === 'staff' || user.role === 'admin') {
                user.cnic = req.body.cnic || user.cnic;
                user.license = req.body.license || user.license;
                user.vehicleNumber = req.body.vehicleNumber || user.vehicleNumber;
                user.vehicleModel = req.body.vehicleModel || user.vehicleModel;
                user.experience = req.body.experience || user.experience;
                user.emergencyContact = req.body.emergencyContact || user.emergencyContact;
            }
            
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                cnic: updatedUser.cnic,
                license: updatedUser.license,
                vehicleNumber: updatedUser.vehicleNumber,
                vehicleModel: updatedUser.vehicleModel,
                experience: updatedUser.experience,
                emergencyContact: updatedUser.emergencyContact
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.toggleWishlist = async (req, res) => {
    try {
        const { itemId, itemType } = req.body; // itemType: 'Tour' or 'Hotel'
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const listName = itemType === 'Hotel' ? 'wishlistHotels' : 'wishlistTours';
        
        // Ensure array exists
        if (!user[listName]) {
            user[listName] = [];
        }

        const index = user[listName].indexOf(itemId);
        let isSaved = false;

        if (index === -1) {
            user[listName].push(itemId);
            isSaved = true;
        } else {
            user[listName].splice(index, 1);
            isSaved = false;
        }

        await user.save();
        res.json({ success: true, isSaved, [listName]: user[listName] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Create notification for admin
        await Notification.create({
            message: `User ${user.name} (${user.role}) changed their password from their profile dashboard.`,
            type: 'Security'
        });

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
