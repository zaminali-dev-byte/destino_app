const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/tours', require('./routes/tourRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// New Phase 1 Routes
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/itineraries', require('./routes/itineraryRoutes'));
app.use('/api/rides', require('./routes/rideRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/company-policies', require('./routes/companypolicyRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/addons', require('./routes/addonRoutes'));

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../frontend-react/dist')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-react/dist/index.html'));
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('MongoDB connection established');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => console.error('MongoDB connection error:', err));
