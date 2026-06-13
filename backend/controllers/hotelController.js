const Hotel = require('../models/Hotel');

// Get all hotels
exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single hotel
exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (hotel) {
            res.json(hotel);
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new hotel
exports.createHotel = async (req, res) => {
    try {
        const hotel = new Hotel(req.body);
        const createdHotel = await hotel.save();
        res.status(201).json(createdHotel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a hotel
exports.updateHotel = async (req, res) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedHotel) {
            res.json(updatedHotel);
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a hotel
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (hotel) {
            res.json({ message: 'Hotel removed' });
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
