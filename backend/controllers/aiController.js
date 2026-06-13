// This is a mock controller for Phase 2 AI Integration.
// In a real production scenario, this would use the OpenAI SDK.
const Tour = require('../models/Tour');

const generateItinerary = async (req, res) => {
    try {
        const { destination, duration, budget, interests, groupSize } = req.body;

        if (!destination || !duration || !budget) {
            return res.status(400).json({ message: 'Destination, duration, and budget are required.' });
        }

        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Generate mock day-by-day itinerary based on the duration requested (max 7 days for the mock)
        const days = Math.min(parseInt(duration), 7) || 3;
        const itinerary = [];

        for (let i = 1; i <= days; i++) {
            itinerary.push({
                day: i,
                title: i === 1 ? `Arrival in ${destination} & Acclimatization` 
                     : i === days ? `Departure from ${destination}` 
                     : `Exploring ${destination} Highlights`,
                activities: [
                    {
                        time: '09:00 AM',
                        description: i === 1 ? 'Hotel check-in and breakfast.' : `Morning guided tour of local ${interests ? interests.split(',')[0] : 'attractions'}.`,
                        location: `Central ${destination}`,
                        cost: budget === 'Luxury' ? '$$$' : budget === 'Moderate' ? '$$' : '$'
                    },
                    {
                        time: '01:00 PM',
                        description: 'Lunch at a recommended local restaurant.',
                        location: 'City Center',
                        cost: budget === 'Luxury' ? '$$$' : budget === 'Moderate' ? '$$' : '$'
                    },
                    {
                        time: '03:00 PM',
                        description: i === days ? 'Final shopping and airport transfer.' : 'Afternoon leisure activity or optional excursion.',
                        location: 'Various',
                        cost: 'Free'
                    }
                ],
                accommodation: budget === 'Luxury' ? '5-Star Resort' : budget === 'Moderate' ? '4-Star Hotel' : 'Boutique Hostel',
                mealsIncluded: ['Breakfast']
            });
        }

        const generatedTrip = {
            id: `ai-${Date.now()}`,
            destination,
            duration: `${days} Days`,
            budget,
            groupSize: groupSize || '1',
            interests: interests || 'General',
            summary: `A customized ${budget.toLowerCase()} trip to ${destination} tailored for a group of ${groupSize || 1}, focusing on ${interests || 'general sightseeing'}.`,
            itinerary,
            createdAt: new Date()
        };

        // Fetch related tours from database
        const searchRegex = new RegExp(destination.split(' ')[0], 'i'); // basic match on first word
        const relatedTours = await Tour.find({ 
            $or: [
                { title: searchRegex },
                { description: searchRegex }
            ]
        }).limit(3);

        res.json({ success: true, data: generatedTrip, relatedTours });

    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate itinerary. Please try again.' });
    }
};

module.exports = {
    generateItinerary
};
