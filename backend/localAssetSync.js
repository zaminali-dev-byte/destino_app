const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Destination = require('./models/Destination');
const Hotel = require('./models/Hotel');
const Tour = require('./models/Tour');

const localDestImages = {
    'Hunza Valley': 'assets/images/destinations/hunza.png',
    'Skardu Valley': 'assets/images/destinations/skardu.png',
    'Lahore': 'assets/images/destinations/destination1.jpg',
    'Swat Valley': 'assets/images/destinations/swat.png',
    'Naran Kaghan': 'assets/images/destinations/naran.png',
    'Fairy Meadows': 'assets/images/destinations/fairy_meadows.png',
    'Neelum Valley': 'assets/images/destinations/neelum.png'
};

const localHotelImages = [
    'assets/images/destinations/hunza_darbar.png',
    'assets/images/destinations/shangrila_resort.png',
    'assets/images/destinations/swat_continental.png',
    'assets/images/destinations/serena_gilgit.png',
    'assets/images/destinations/fairy_meadows_huts.png',
    'assets/images/destinations/hotel1.jpg',
    'assets/images/destinations/hotel2.jpg',
    'assets/images/destinations/hotel3.jpg',
    'assets/images/destinations/hotel4.jpg',
    'assets/images/destinations/hotel5.jpg'
];

const localTourImages = [
    'assets/images/destinations/tour1.jpg',
    'assets/images/destinations/tour2.jpg',
    'assets/images/destinations/tour3.jpg',
    'assets/images/destinations/tour4.jpg',
    'assets/images/destinations/tour5.jpg',
    'assets/images/destinations/tour6.jpg',
    'assets/images/destinations/tour7.jpg',
    'assets/images/destinations/tour8.jpg',
    'assets/images/destinations/tour-list1.webp',
    'assets/images/destinations/tour-list2.jpg'
];

async function syncLocal() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB. Reverting to reliable local assets...');

        // Update Destinations
        for (const [name, img] of Object.entries(localDestImages)) {
            const dest = await Destination.findOne({ name });
            if (dest) {
                dest.image = img;
                await dest.save();
                console.log(`Updated Destination: ${name} -> ${img}`);
            }
        }

        // Update all Hotels with sequential local images
        const hotels = await Hotel.find();
        for (let i = 0; i < hotels.length; i++) {
            hotels[i].image = localHotelImages[i % localHotelImages.length];
            await hotels[i].save();
            console.log(`Updated Hotel: ${hotels[i].name} -> ${hotels[i].image}`);
        }

        // Update all Tours with sequential local images
        const tours = await Tour.find();
        for (let i = 0; i < tours.length; i++) {
            tours[i].imageUrl = localTourImages[i % localTourImages.length];
            await tours[i].save();
            console.log(`Updated Tour: ${tours[i].title} -> ${tours[i].imageUrl}`);
        }

        console.log('✅ Local asset sync complete! No more broken links.');
        process.exit(0);
    } catch (err) {
        console.error('Data Sync Failed:', err);
        process.exit(1);
    }
}

syncLocal();
