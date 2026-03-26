const Destination = require('../models/Destination');

// Get all destinations
exports.getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.json(destinations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single destination
exports.getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (destination) {
            res.json(destination);
        } else {
            res.status(404).json({ message: 'Destination not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
