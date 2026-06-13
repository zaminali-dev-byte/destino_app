const Booking = require('../models/Booking');
const Coupon  = require('../models/Coupon');

// ─── Create new booking (requires authentication) ─────────────────────────────
exports.createBooking = async (req, res) => {
    try {
        const {
            customerName, email, phone,
            tourId, hotelId, destinationId,
            date, guests,
            baseAmount, couponCode
        } = req.body;

        const subtotal = parseFloat(baseAmount) || 0;
        let discount = 0;
        let verifiedCouponCode = null;

        // 🛡️ Price Shield: Re-validate coupon and recalculate logic on backend
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase(), active: true });
            
            if (coupon) {
                const now = new Date();
                const isValidDate = now >= new Date(coupon.validFrom) && now <= new Date(coupon.validTo);
                const isUnderLimit = coupon.usedCount < coupon.usageLimit;
                const meetsMinAmount = subtotal >= coupon.minOrderAmount;

                if (isValidDate && isUnderLimit && meetsMinAmount) {
                    if (coupon.discountType === 'Percentage') {
                        discount = (subtotal * coupon.discountValue) / 100;
                        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                            discount = coupon.maxDiscount;
                        }
                    } else {
                        discount = coupon.discountValue;
                    }
                    verifiedCouponCode = coupon.code;
                    
                    // Increment usage
                    coupon.usedCount += 1;
                    await coupon.save();
                }
            }
        }

        const total = Math.max(0, subtotal - discount);

        const bookingData = {
            customerName,
            email,
            phone,
            userId: req.user._id,
            date,
            guests,
            baseAmount:     subtotal,
            discountAmount: Math.round(discount * 100) / 100,
            totalAmount:    Math.round(total * 100) / 100,
            couponCode:     verifiedCouponCode,
            status:         'Pending',
            paymentStatus:  'Unpaid'
        };

        if (tourId)        bookingData.tourId        = tourId;
        if (hotelId)       bookingData.hotelId       = hotelId;
        if (destinationId) bookingData.destinationId = destinationId;

        const booking = new Booking(bookingData);
        const savedBooking = await booking.save();
        res.status(201).json(savedBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ─── Get all bookings (admin/staff) ──────────────────────────────────────────
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .sort({ createdAt: -1 })
            .populate('tourId', 'title price')
            .populate('hotelId', 'name priceInfo')
            .populate('destinationId', 'name location')
            .populate('assignedStaff', '-passwordHash');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Get personal bookings (authenticated user) ──────────────────────────────
exports.getMyBookings = async (req, res) => {
    try {
        const email = req.params.email;
        const bookings = await Booking.find({ email })
            .sort({ createdAt: -1 })
            .populate('tourId', 'title price imageUrl')
            .populate('hotelId', 'name priceInfo image')
            .populate('destinationId', 'name location image')
            .populate('assignedStaff', '-passwordHash');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Cancel personal booking ──────────────────────────────────────────────────
exports.cancelPersonalBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.email !== req.user.email) {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        booking.status = 'Cancelled';
        await booking.save();
        res.json({ message: 'Booking cancelled', booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Update booking (admin/staff) ─────────────────────────────────────────────
exports.updateBooking = async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedBooking) {
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ─── Delete booking (admin only) ─────────────────────────────────────────────
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (booking) {
            res.json({ message: 'Booking removed' });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Assign staff member to a booking (Admin/Staff) ─────────────────────────
exports.assignStaff = async (req, res) => {
    try {
        const { staffId, tripDetails } = req.body;
        
        const updateData = {
            assignedStaff: staffId || null,
            assignmentStatus: staffId ? 'Assigned' : 'None'
        };
        
        if (tripDetails) {
            updateData.tripDetails = tripDetails;
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('assignedStaff', '-passwordHash');

        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Get tasks assigned to the logged-in staff member ───────────────────────
exports.getMyStaffTasks = async (req, res) => {
    try {
        const tasks = await Booking.find({ assignedStaff: req.user._id })
            .sort({ date: 1 }) // Soonest trips first
            .populate('tourId', 'title description imageUrl')
            .populate('hotelId', 'name location image')
            .populate('destinationId', 'name location image');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── Staff: Respond to an assigned task (Accept/Reject) ─────────────────────
exports.respondToTask = async (req, res) => {
    try {
        const { status, reason } = req.body; // status: 'Accepted' or 'Rejected'
        
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Security check: only the assigned staff can respond
        if (booking.assignedStaff.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not assigned to this trip.' });
        }

        booking.assignmentStatus = status;
        if (status === 'Rejected') {
            booking.rejectionReason = reason || 'No reason provided';
            // Optional: reset assignment after rejection? 
            // Better to keep it so Admin knows WHO rejected it.
        }

        await booking.save();
        res.json({ message: `Trip ${status.toLowerCase()} successfully`, booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
