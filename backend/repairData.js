const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Destination = require('./models/Destination');
const Hotel = require('./models/Hotel');
const Tour = require('./models/Tour');

const destinationImages = {
    'Hunza Valley': 'https://images.unsplash.com/photo-1596423735880-5f2a689b903e?q=80&w=1000&auto=format&fit=crop',
    'Skardu Valley': 'https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1000&auto=format&fit=crop',
    'Naran Kaghan': 'https://images.unsplash.com/photo-1627895457810-7e448b47a13c?q=80&w=1000&auto=format&fit=crop',
    'Swat Valley': 'https://images.unsplash.com/photo-1587825027984-c4242afb4836?q=80&w=1000&auto=format&fit=crop',
    'Lahore': 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=1000&auto=format&fit=crop'
};

const hotelUpdates = {
    'Luxus Hunza': 'Hunza Valley',
    'Shangrila Resort': 'Skardu Valley',
    'Pearl Continental Bhurban': 'Naran Kaghan', // Repurposing to fit destinations
    'Walnut Heights Resort': 'Swat Valley',
    'Serena Hotel Islamabad': 'Lahore'           // Repurposing to fit destinations
};

const hotelImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542314831-c6a4d14b8fc4?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop'
];

const tourImage = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop';
const tourImage2 = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop';

const extraHotels = [
    { name: 'Hunza Darbar Hotel', location: 'Hunza Valley', priceInfo: '$100 / night', image: hotelImages[0], bedrooms: 2, bathrooms: 1 },
    { name: 'K2 Motel Skardu', location: 'Skardu Valley', priceInfo: '$80 / night', image: hotelImages[1], bedrooms: 1, bathrooms: 1 },
    { name: 'Swiss Woodhouse Naran', location: 'Naran Kaghan', priceInfo: '$150 / night', image: hotelImages[2], bedrooms: 3, bathrooms: 2 },
    { name: 'Swat Serena Hotel', location: 'Swat Valley', priceInfo: '$180 / night', image: hotelImages[3], bedrooms: 2, bathrooms: 1 },
    { name: 'Avari Hotel Lahore', location: 'Lahore', priceInfo: '$200 / night', image: hotelImages[4], bedrooms: 1, bathrooms: 1 }
];

const newTours = [
    { title: 'Hunza Heritage & Lakes', location: 'Hunza Valley', duration: '5 Days', price: 400, category: 'Heritage', imageUrl: tourImage, description: 'Explore the majestic lakes and forts of Hunza.' },
    { title: 'Attabad Lake Boat Tour', location: 'Hunza Valley', duration: '1 Day', price: 50, category: 'Adventure', imageUrl: tourImage2, description: 'A full day of boating and sightseeing on Attabad.' },
    
    { title: 'K2 Base Camp Trek', location: 'Skardu Valley', duration: '14 Days', price: 1500, category: 'Trekking', imageUrl: tourImage, description: 'The ultimate trekking experience to K2 Base Camp.' },
    { title: 'Deosai Plains Safari', location: 'Skardu Valley', duration: '2 Days', price: 200, category: 'Adventure', imageUrl: tourImage2, description: 'A thrilling jeep safari through the Deosai National Park.' },
    
    { title: 'Saiful Malook Expedition', location: 'Naran Kaghan', duration: '3 Days', price: 150, category: 'Nature', imageUrl: tourImage, description: 'Visit the legendary lake and enjoy serene landscapes.' },
    { title: 'Babusar Top Adventure', location: 'Naran Kaghan', duration: '2 Days', price: 120, category: 'Adventure', imageUrl: tourImage2, description: 'Reach the highest point in the valley on an epic road trip.' },
    
    { title: 'Kalam Forest Retreat', location: 'Swat Valley', duration: '4 Days', price: 250, category: 'Nature', imageUrl: tourImage, description: 'Relax in the beautiful pine forests of Kalam.' },
    { title: 'Malam Jabba Ski Trip', location: 'Swat Valley', duration: '3 Days', price: 300, category: 'Adventure', imageUrl: tourImage2, description: 'Winter sports and beautiful mountain views at Malam Jabba.' },
    
    { title: 'Lahore Fort & Badshahi', location: 'Lahore', duration: '1 Day', price: 60, category: 'Heritage', imageUrl: tourImage, description: 'A historic tour of the Mughal empires finest architecture.' },
    { title: 'Walled City Food Tour', location: 'Lahore', duration: '1 Day', price: 40, category: 'Food & Culture', imageUrl: tourImage2, description: 'Taste the best street food the historic walled city has to offer.' }
];

async function repairData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for Repair.');

        // 1. Fix Destinations Images
        for (const [name, imgUrl] of Object.entries(destinationImages)) {
            const dest = await Destination.findOne({ name });
            if (dest) {
                dest.image = imgUrl;
                await dest.save();
                console.log(`Updated image for Destination: ${name}`);
            }
        }

        // 2. Fix Broken Test Tour E2E image
        const brokenTour = await Tour.findOne({ title: 'Test Tour E2E' });
        if (brokenTour) {
            brokenTour.imageUrl = tourImage;
            await brokenTour.save();
            console.log('Fixed Test Tour E2E image');
        }

        // 3. Fix Hotel Locations & Images
        let i = 0;
        for (const [name, newLocation] of Object.entries(hotelUpdates)) {
            const hotel = await Hotel.findOne({ name });
            if (hotel) {
                hotel.location = newLocation;
                hotel.image = hotelImages[i];
                await hotel.save();
                console.log(`Updated location and image for Hotel: ${name} -> ${newLocation}`);
            }
            i++;
        }

        // 4. Insert 5 Extra Hotels
        for (const h of extraHotels) {
            const exists = await Hotel.findOne({ name: h.name });
            if (!exists) {
                await Hotel.create(h);
                console.log(`Inserted extra hotel: ${h.name}`);
            }
        }

        // 5. Insert 10 New Tours
        for (const t of newTours) {
            const exists = await Tour.findOne({ title: t.title });
            if (!exists) {
                await Tour.create(t);
                console.log(`Inserted tour: ${t.title}`);
            }
        }

        console.log('Repair and Expansion Complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

repairData();
