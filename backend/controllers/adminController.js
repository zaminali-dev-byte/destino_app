const Booking = require('../models/Booking');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const Tour = require('../models/Tour');
const Hotel = require('../models/Hotel');
const Package = require('../models/Package');
const Destination = require('../models/Destination');
const JobApplication = require('../models/JobApplication');
const Notification = require('../models/Notification');

exports.getStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalBookings,
            totalTours,
            totalHotels,
            totalComplaints,
            totalPackages,
            totalDestinations,
            totalStaff,
            pendingApplications,
            payments,
            recentBookingsAggregation,
            recentBookingsList,
            recentUsers
        ] = await Promise.all([
            User.countDocuments({ role: 'customer' }),
            Booking.countDocuments(),
            Tour.countDocuments(),
            Hotel.countDocuments(),
            Complaint.countDocuments(),
            Package.countDocuments(),
            Destination.countDocuments(),
            User.countDocuments({ role: { $in: ['staff', 'admin'] } }),
            JobApplication.countDocuments({ status: 'Pending' }),
            Payment.find({ status: 'Completed' }),
            Booking.aggregate([
                {
                    $group: {
                        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
                { $limit: 6 }
            ]),
            Booking.find().sort({ createdAt: -1 }).limit(5).populate('tourId').populate('hotelId'),
            User.find().sort({ createdAt: -1 }).limit(5)
        ]);

        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

        // Calculate simple monthly revenue mock (since we might not have enough real Payment data to group yet)
        const monthlyRevenue = [
            totalRevenue * 0.05, totalRevenue * 0.08, totalRevenue * 0.1, 
            totalRevenue * 0.07, totalRevenue * 0.12, totalRevenue * 0.15,
            totalRevenue * 0.1,  totalRevenue * 0.08, totalRevenue * 0.05,
            totalRevenue * 0.06, totalRevenue * 0.09, totalRevenue * 0.05
        ];
        
        // Combine and sort recent activity
        const recentActivity = [
            ...recentBookingsList.map(b => ({ type: 'Booking', message: `New booking for ${b.tourId ? b.tourId.title : (b.hotelId ? b.hotelId.name : 'a package')}`, date: b.createdAt })),
            ...recentUsers.map(u => ({ type: 'User', message: `New user registered: ${u.name}`, date: u.createdAt }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

        res.json({
            users: totalUsers,
            bookings: totalBookings,
            tours: totalTours,
            hotels: totalHotels,
            complaints: totalComplaints,
            packages: totalPackages,
            destinations: totalDestinations,
            staff: totalStaff,
            pendingApplications,
            revenue: totalRevenue,
            monthlyRevenueData: monthlyRevenue,
            monthlyBookingsData: recentBookingsAggregation.map(b => b.count),
            recentActivity
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
