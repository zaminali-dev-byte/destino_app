const Tour = require('../models/Tour');

// Get all tours
exports.getTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.json(tours);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single tour
exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (tour) {
            res.json(tour);
        } else {
            res.status(404).json({ message: 'Tour not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new tour
exports.createTour = async (req, res) => {
    try {
        const tour = new Tour(req.body);
        const createdTour = await tour.save();
        res.status(201).json(createdTour);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a tour
exports.updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedTour) {
            res.json(updatedTour);
        } else {
            res.status(404).json({ message: 'Tour not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a tour
exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        if (tour) {
            res.json({ message: 'Tour removed' });
        } else {
            res.status(404).json({ message: 'Tour not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
