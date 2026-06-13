const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName:   { type: String, required: true },
    email:          { type: String, required: true },
    phone:          { type: String },
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tourId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
    hotelId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    destinationId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
    assignedStaff:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date:           { type: Date, required: true },
    guests:         { type: Number, required: true, default: 1 },
    baseAmount:     { type: Number, default: 0 },       // price × guests before discount
    discountAmount: { type: Number, default: 0 },       // savings from coupon
    totalAmount:    { type: Number, default: 0 },       // final amount paid
    couponCode:     { type: String, default: null },
    status:         { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
    paymentStatus:  { type: String, enum: ['Unpaid', 'Paid', 'Refunded'], default: 'Unpaid' },
    paymentMethod:  { type: String, enum: ['Online Banking', 'Cash'], default: 'Online Banking' },
    
    // Assignment fields
    assignmentStatus: { 
        type: String, 
        enum: ['None', 'Assigned', 'Accepted', 'Rejected'], 
        default: 'None' 
    },
    tripDetails: {
        route: { type: String },
        pickupLocation: { type: String },
        specialRequirements: { type: String }
    },
    rejectionReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
