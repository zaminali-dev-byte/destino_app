const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    bedrooms: { type: Number, default: 1 },
    kitchens: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    amenities: { type: String },
    priceInfo: { type: String, required: true },
    rating: { type: Number, default: 5 },
    imageRight: { type: Boolean, default: false },
    delay: { type: String, default: "0" }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
