const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, default: '#' },
    toursCount: { type: Number, default: 0 },
    activityCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
