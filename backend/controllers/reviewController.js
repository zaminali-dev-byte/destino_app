const Review = require('../models/Review');

exports.createReview = async (req, res) => {
    try {
        const { targetId, targetType, overallRating, guideRating, cleanlinessRating, valueRating, comment } = req.body;

        const review = new Review({
            user: req.user._id,
            targetId,
            targetType,
            overallRating,
            guideRating,
            cleanlinessRating,
            valueRating,
            comment
        });

        const createdReview = await review.save();
        
        // Populate user details before returning
        await createdReview.populate('user', 'name email');

        res.status(201).json(createdReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getReviewsByTarget = async (req, res) => {
    try {
        const { targetId } = req.params;
        const reviews = await Review.find({ targetId })
                                    .populate('user', 'name email')
                                    .sort({ createdAt: -1 });
        
        res.status(200).json(reviews);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
