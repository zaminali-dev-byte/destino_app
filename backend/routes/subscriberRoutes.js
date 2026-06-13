const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// @route   POST /api/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'Already subscribed' });
        }

        const subscriber = new Subscriber({ email });
        await subscriber.save();

        res.status(201).json({ message: 'Successfully subscribed to the newsletter!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
