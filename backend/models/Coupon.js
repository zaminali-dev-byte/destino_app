const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code:           { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType:   { type: String, enum: ['Percentage', 'Fixed'], required: true },
    discountValue:  { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },       // minimum subtotal to apply coupon
    maxDiscount:    { type: Number, default: null },     // cap for percentage discounts (null = no cap)
    validFrom:      { type: Date, required: true },
    validTo:        { type: Date, required: true },
    usageLimit:     { type: Number, default: 100 },
    usedCount:      { type: Number, default: 0 },
    active:         { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema, 'coupon');
