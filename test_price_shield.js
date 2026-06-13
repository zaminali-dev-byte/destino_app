const mongoose = require('mongoose');
const BookingController = require('./backend/controllers/bookingController');
const Coupon = require('./backend/models/Coupon');
const User = require('./backend/models/User');
const Booking = require('./backend/models/Booking');

async function testPriceShield() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/destino');
        console.log('Connected for test');

        const user = await User.findOne({ email: 'user@destino.com' });
        
        // Mock req and res
        const req = {
            user: user,
            body: {
                customerName: 'Test Buyer',
                email: 'user@destino.com',
                baseAmount: 1000,
                couponCode: 'WELCOME10', // 10% off -> total should be 900
                date: new Date(),
                guests: 2
            }
        };

        const res = {
            status: function(s) { 
                console.log('Status:', s); 
                return this; 
            },
            json: function(j) { 
                console.log('JSON Output:', JSON.stringify(j, null, 2)); 
                return this;
            }
        };

        await BookingController.createBooking(req, res);
        
        // Test with invalid coupon
        const reqInvalid = {
            user: user,
            body: {
                customerName: 'Fraud Buyer',
                email: 'user@destino.com',
                baseAmount: 1000,
                couponCode: 'FAKECODE',
                date: new Date(),
                guests: 1
            }
        };
        console.log('\n--- Testing Invalid Coupon ---');
        await BookingController.createBooking(reqInvalid, res);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testPriceShield();
