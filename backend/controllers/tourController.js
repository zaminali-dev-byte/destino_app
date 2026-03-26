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
