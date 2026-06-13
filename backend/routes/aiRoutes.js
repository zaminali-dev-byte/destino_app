const express = require('express');
const router = express.Router();
const { generateItinerary } = require('../controllers/aiController');

// @route   POST /api/ai/generate-itinerary
// @desc    Generate an AI itinerary based on user preferences
// @access  Public (or could be restricted to logged-in users later)
router.post('/generate-itinerary', generateItinerary);

module.exports = router;
