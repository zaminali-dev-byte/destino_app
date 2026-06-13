const mongoose = require('mongoose');
require('dotenv').config();

const models = {
    AddOn: require('./models/AddOn'),
    Booking: require('./models/Booking'),
    CompanyPolicy: require('./models/CompanyPolicy'),
    Complaint: require('./models/Complaint'),
    Contact: require('./models/Contact'),
    Coupon: require('./models/Coupon'),
    Destination: require('./models/Destination'),
    Hotel: require('./models/Hotel'),
    Itinerary: require('./models/Itinerary'),
    JobApplication: require('./models/JobApplication'),
    Package: require('./models/Package'),
    Payment: require('./models/Payment'),
    Ride: require('./models/Ride'),
    Staff: require('./models/Staff'),
    Tour: require('./models/Tour'),
    User: require('./models/User')
};

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Database Verification ---');
        for (const [name, model] of Object.entries(models)) {
            const count = await model.countDocuments();
            console.log(`${name.padEnd(20)}: ${count}`);
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
