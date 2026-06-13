const express = require('express');
const router = express.Router();
const {
    createBooking, getBookings, getMyBookings, getMyStaffTasks, respondToTask,
    updateBooking, deleteBooking, cancelPersonalBooking, assignStaff
} = require('../controllers/bookingController');
const { protect, admin, adminOrStaff } = require('../middleware/authMiddleware');

// User must be logged in to create a booking
router.post('/', protect, createBooking);

// Admin / Staff: view all bookings
router.get('/', protect, adminOrStaff, getBookings);

// Staff: view their assigned tasks & respond
router.get('/staff-tasks', protect, getMyStaffTasks);
router.put('/:id/respond', protect, respondToTask);

// Customer: view own bookings (by email, no auth to allow fetching)
router.get('/my/:email', getMyBookings);

// Customer: cancel own booking (soft cancel — sets status to Cancelled)
router.delete('/my/:id', protect, cancelPersonalBooking);

// Admin / Staff: assign staff, update booking status
router.put('/:id/assign-staff', protect, adminOrStaff, assignStaff);
router.put('/:id', protect, adminOrStaff, updateBooking);

// Admin only: permanently delete booking
router.delete('/:id', protect, admin, deleteBooking);

module.exports = router;
