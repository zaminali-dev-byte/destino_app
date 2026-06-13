const Coupon = require('../models/Coupon');

// ─── Public: Validate a coupon code against an order amount ───────────────────
exports.validateCoupon = async (req, res) => {
    try {
        const { code, subtotal } = req.body;

        if (!code) {
            return res.status(400).json({ valid: false, message: 'Coupon code is required.' });
        }

        const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ valid: false, message: 'Coupon code not found.' });
        }

        if (!coupon.active) {
            return res.status(400).json({ valid: false, message: 'This coupon is no longer active.' });
        }

        const now = new Date();
        if (now < new Date(coupon.validFrom) || now > new Date(coupon.validTo)) {
            return res.status(400).json({ valid: false, message: 'This coupon has expired or is not yet valid.' });
        }

        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ valid: false, message: 'This coupon has reached its usage limit.' });
        }

        const orderAmount = parseFloat(subtotal) || 0;
        if (coupon.minOrderAmount > 0 && orderAmount < coupon.minOrderAmount) {
            return res.status(400).json({
                valid: false,
                message: `Minimum order of $${coupon.minOrderAmount} required for this coupon.`
            });
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'Percentage') {
            discountAmount = (orderAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        } else {
            discountAmount = coupon.discountValue;
            if (discountAmount > orderAmount) discountAmount = orderAmount;
        }

        discountAmount = Math.round(discountAmount * 100) / 100;
        const finalAmount = Math.max(0, orderAmount - discountAmount);

        return res.json({
            valid: true,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount,
            finalAmount,
            message: coupon.discountType === 'Percentage'
                ? `${coupon.discountValue}% off applied! You save $${discountAmount.toFixed(2)}`
                : `$${discountAmount.toFixed(2)} off applied!`
        });
    } catch (err) {
        res.status(500).json({ valid: false, message: err.message });
    }
};

// ─── Admin: Get all coupons ───────────────────────────────────────────────────
exports.getAll = async (req, res) => {
    try {
        const data = await Coupon.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await Coupon.findById(req.params.id);
        if (data) res.json(data);
        else res.status(404).json({ message: 'Not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newData = new Coupon(req.body);
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updatedData = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteRecord = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
