const JobApplication = require('../models/JobApplication');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Submit new application (Public)
exports.submitApplication = async (req, res) => {
    try {
        const app = new JobApplication(req.body);
        const savedApp = await app.save();
        res.status(201).json(savedApp);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Admin view all applications
exports.getApplications = async (req, res) => {
    try {
        const apps = await JobApplication.find().sort({ createdAt: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin HIRE applicant
exports.hireApplicant = async (req, res) => {
    try {
        const app = await JobApplication.findById(req.params.id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        
        if (app.status === 'Hired') {
            return res.status(400).json({ message: 'Applicant is already hired.' });
        }

        // Check if user with this email already exists
        const existingUser = await User.findOne({ email: app.email });
        if (existingUser) {
            existingUser.role = 'staff';
            existingUser.cnic = app.cnic;
            existingUser.license = app.license;
            existingUser.experience = app.coverLetter;
            await existingUser.save();
        } else {
            // Generate a temporary password (e.g. Staff123!)
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('Staff@123!', salt);
            
            const newUser = new User({
                name: app.name,
                email: app.email,
                phone: app.phone,
                role: 'staff',
                passwordHash,
                cnic: app.cnic,
                license: app.license,
                experience: app.coverLetter
            });
            await newUser.save();
        }

        // Update application status
        app.status = 'Hired';
        await app.save();

        res.json({ message: 'Applicant successfully hired. Temporary password is Staff@123!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin REJECT applicant
exports.rejectApplicant = async (req, res) => {
    try {
        const app = await JobApplication.findById(req.params.id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        
        app.status = 'Rejected';
        await app.save();
        res.json({ message: 'Applicant rejected' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
