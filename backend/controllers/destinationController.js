const Destination = require('../models/Destination');

// Get all destinations
exports.getDestinations = async (req, res) => {
    try {
        const query = req.query.q ? { name: { $regex: req.query.q, $options: 'i' } } : {};
        const destinations = await Destination.find(query);
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

// Create a new destination
exports.createDestination = async (req, res) => {
    try {
        const destination = new Destination(req.body);
        const createdDestination = await destination.save();
        res.status(201).json(createdDestination);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a destination
exports.updateDestination = async (req, res) => {
    try {
        const updatedDestination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedDestination) {
            res.json(updatedDestination);
        } else {
            res.status(404).json({ message: 'Destination not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a destination
exports.deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);
        if (destination) {
            res.json({ message: 'Destination removed' });
        } else {
            res.status(404).json({ message: 'Destination not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
