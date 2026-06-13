const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' },
    isVerified: { type: Boolean, default: true },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    // Staff specific fields:
    cnic: { type: String },
    license: { type: String },
    vehicleNumber: { type: String },
    vehicleModel: { type: String },
    experience: { type: String },
    emergencyContact: { type: String },
    position: { type: String },
    department: { type: String },
    salary: { type: Number },
    address: { type: String },
    hireDate: { type: Date, default: Date.now },
    bankName: { type: String },
    bankAccountNumber: { type: String },
    // Role specific allowances/metrics:
    fuelAllowance: { type: Number, default: 0 },
    tourAllowance: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0 },
    departmentBudget: { type: Number, default: 0 },
    // Phase 3 additions:
    walletBalance: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 0 },
    wishlistTours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }],
    wishlistHotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, 'user');
