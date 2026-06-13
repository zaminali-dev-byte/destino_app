const User = require('../models/User');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
// NOTE: For development, it logs the email to the console.
// For production, the user will add real SMTP credentials to .env
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal_pass'
    }
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        const normalizedEmail = email.toLowerCase();

        // Check if user exists
        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Generate 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create user
        const user = await User.create({
            name,
            email: normalizedEmail,
            passwordHash,
            phone,
            role: 'customer', // default
            isVerified: false,
            verificationCode,
            verificationCodeExpires
        });

        if (user) {
            // Attempt to send email
            try {
                const info = await transporter.sendMail({
                    from: '"Destino Tours" <noreply@destino.com>',
                    to: user.email,
                    subject: 'Your Destino Verification Code',
                    text: `Hello ${user.name},\n\nYour verification code is: ${verificationCode}\n\nIt will expire in 10 minutes.`,
                    html: `<p>Hello ${user.name},</p><p>Your verification code is: <strong>${verificationCode}</strong></p><p>It will expire in 10 minutes.</p>`
                });
                console.log(`[EMAIL DEV LOG] Verification email sent to ${user.email}. Code: ${verificationCode}`);
            } catch (emailErr) {
                console.error('Failed to send email. Code was:', verificationCode, emailErr);
            }

            res.status(201).json({
                message: 'Verification Required',
                email: user.email
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        const normalizedEmail = email.toLowerCase();

        // Check for user email
        const user = await User.findOne({ email: normalizedEmail });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            if (user.isVerified === false) {
                return res.status(401).json({ message: 'Please verify your email address before logging in.', requiresVerification: true });
            }
            const userData = user.toObject();
            delete userData.passwordHash;
            
            res.json({
                ...userData,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Email Code
// @route   POST /api/auth/verify
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ message: 'Email and code are required' });
        }

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (user.verificationCodeExpires < new Date()) {
            return res.status(400).json({ message: 'Verification code has expired. Please register again.' });
        }

        // Mark as verified
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        const userData = user.toObject();
        delete userData.passwordHash;
        
        // Log them in immediately
        res.json({
            ...userData,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6-digit reset code
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();

        try {
            await transporter.sendMail({
                from: '"Destino Security" <noreply@destino.com>',
                to: user.email,
                subject: 'Password Reset Request',
                text: `Hello ${user.name},\n\nYour password reset code is: ${resetToken}\n\nIt will expire in 15 minutes.`,
                html: `<p>Hello ${user.name},</p><p>Your password reset code is: <strong>${resetToken}</strong></p><p>It will expire in 15 minutes.</p>`
            });
            console.log(`[EMAIL DEV LOG] Password reset email sent to ${user.email}. Code: ${resetToken}`);
        } catch (emailErr) {
            console.error('Failed to send reset email', emailErr);
        }

        res.json({ message: 'Password reset code sent to email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.resetPasswordToken !== code) {
            return res.status(400).json({ message: 'Invalid reset code' });
        }

        if (user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ message: 'Reset code has expired. Please request a new one.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Create notification for admin
        await Notification.create({
            message: `User ${user.name} (${user.role}) reset their password via Forgot Password.`,
            type: 'Security'
        });

        res.json({ message: 'Password has been successfully reset' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    forgotPassword,
    resetPassword
};
