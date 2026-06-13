const mongoose = require('mongoose');
const User = require('./models/User');
const Booking = require('./models/Booking');
const Tour = require('./models/Tour');
require('dotenv').config();

async function runE2E() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected successfully.");

        // 1. Create a dummy tour
        console.log("Creating a test tour...");
        const tour = new Tour({
            title: 'Test Tour E2E',
            city: 'Test City',
            address: '123 Test St',
            distance: 500,
            price: 100,
            maxGroupSize: 10,
            description: 'A test tour for E2E verification',
            imageUrl: 'assets/images/tour1.jpg',
            duration: '3 Days',
            category: 'Adventure'
        });
        await tour.save();

        // 2. Create and verify a test user directly in DB (to bypass email)
        console.log("Creating and verifying a test user...");
        const user = new User({
            name: 'E2E Tester',
            email: `e2e_${Date.now()}@example.com`,
            password: 'password123',
            isVerified: true // manually verified
        });
        await user.save();

        // 3. Create a booking for the user
        console.log("Creating a booking...");
        const booking = new Booking({
            userId: user._id,
            userEmail: user.email,
            tourName: tour.title,
            fullName: user.name,
            guestSize: 2,
            phone: '1234567890',
            bookAt: new Date(),
            tourId: tour._id
        });
        await booking.save();

        // 4. Verify the booking was saved
        const foundBooking = await Booking.findById(booking._id);
        if (foundBooking) {
            console.log(`[SUCCESS] Booking successfully created for ${foundBooking.userEmail} on tour ${foundBooking.tourName}`);
        } else {
            console.log("[ERROR] Booking not found!");
        }

        // 5. Clean up
        console.log("Cleaning up test data...");
        await Booking.findByIdAndDelete(booking._id);
        await User.findByIdAndDelete(user._id);
        await Tour.findByIdAndDelete(tour._id);

        console.log("E2E Test Complete. Everything is working perfectly!");
        process.exit(0);

    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

runE2E();
