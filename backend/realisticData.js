const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Destination = require('./models/Destination');
const Hotel = require('./models/Hotel');
const Tour = require('./models/Tour');

async function getWikiImage(title, fallback) {
    try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1000`);
        const data = await res.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId === "-1" || !pages[pageId].thumbnail) return fallback;
        return pages[pageId].thumbnail.source;
    } catch (e) {
        return fallback;
    }
}

// Manually curated highly-realistic tour data
const hyperRealisticTours = [
    // HUNZA VALLEY
    {
        title: 'Hunza Heritage & Lakes',
        location: 'Hunza Valley',
        duration: '5 Days',
        price: 400,
        category: 'Heritage',
        description: 'Immerse yourself in the rich history of the Hunza kingdom. Visit the 800-year-old Baltit Fort, walk through the ancient cobblestone streets of Altit, and gaze upon the majestic Ladyfinger Peak.',
        wikiTitle: 'Baltit_Fort',
        fallbackImage: 'https://images.unsplash.com/photo-1596423735880-5f2a689b903e'
    },
    {
        title: 'Attabad Lake Boat Tour',
        location: 'Hunza Valley',
        duration: '1 Day',
        price: 50,
        category: 'Adventure',
        description: 'Experience the striking turquoise waters of Attabad Lake. This day trip includes a thrilling jet-boat ride, traditional local cuisine by the water, and stunning views of the Karakoram highway.',
        wikiTitle: 'Attabad_Lake',
        fallbackImage: 'https://images.unsplash.com/photo-1596423735880-5f2a689b903e'
    },
    // SKARDU VALLEY
    {
        title: 'K2 Base Camp Trek',
        location: 'Skardu Valley',
        duration: '14 Days',
        price: 1500,
        category: 'Trekking',
        description: 'The ultimate mountaineering adventure. Follow the footsteps of legends up the Baltoro Glacier. Witness the sheer vertical granite faces of Trango Towers and camp directly beneath the savage mountain, K2.',
        wikiTitle: 'K2',
        fallbackImage: 'https://images.unsplash.com/photo-1627894483216-2138af692e32'
    },
    {
        title: 'Deosai Plains Safari',
        location: 'Skardu Valley',
        duration: '2 Days',
        price: 200,
        category: 'Adventure',
        description: 'A rugged 4x4 jeep safari across the second-highest alpine plateau in the world. Camp under a sky bursting with stars, visit Sheosar Lake, and if you are lucky, spot the rare Himalayan Brown Bear.',
        wikiTitle: 'Deosai_National_Park',
        fallbackImage: 'https://images.unsplash.com/photo-1627894483216-2138af692e32'
    },
    // NARAN KAGHAN
    {
        title: 'Saiful Malook Expedition',
        location: 'Naran Kaghan',
        duration: '3 Days',
        price: 150,
        category: 'Nature',
        description: 'A mesmerizing journey to the lake of fairies. Enjoy horseback riding along the valley streams, trout fishing in the Kunhar River, and a hike up to the mystical Lake Saiful Muluk shrouded in local folklore.',
        wikiTitle: 'Lake_Saiful_Muluk',
        fallbackImage: 'https://images.unsplash.com/photo-1627895457810-7e448b47a13c'
    },
    {
        title: 'Babusar Top Adventure',
        location: 'Naran Kaghan',
        duration: '2 Days',
        price: 120,
        category: 'Adventure',
        description: 'Drive along one of the highest mountain passes in the country connecting Khyber Pakhtunkhwa to Gilgit-Baltistan. Experience high-altitude winds and panoramic views of snow-capped peaks.',
        wikiTitle: 'Babusar_Pass',
        fallbackImage: 'https://images.unsplash.com/photo-1627895457810-7e448b47a13c'
    },
    // SWAT VALLEY
    {
        title: 'Kalam Forest Retreat',
        location: 'Swat Valley',
        duration: '4 Days',
        price: 250,
        category: 'Nature',
        description: 'Escape into the dense, tranquil pine forests of Kalam. Sit by the Ushu River, explore glaciers, and enjoy traditional Pashtun hospitality in wooden mountain chalets.',
        wikiTitle: 'Kalam_Valley',
        fallbackImage: 'https://images.unsplash.com/photo-1587825027984-c4242afb4836'
    },
    {
        title: 'Malam Jabba Ski Trip',
        location: 'Swat Valley',
        duration: '3 Days',
        price: 300,
        category: 'Adventure',
        description: 'Hit the slopes at Pakistans premier ski resort! Whether you are a beginner or a pro, enjoy chairlifts, zip-lining, and pristine winter sports high up in the Hindu Kush mountains.',
        wikiTitle: 'Malam_Jabba',
        fallbackImage: 'https://images.unsplash.com/photo-1587825027984-c4242afb4836'
    },
    // LAHORE
    {
        title: 'Lahore Fort & Badshahi',
        location: 'Lahore',
        duration: '1 Day',
        price: 60,
        category: 'Heritage',
        description: 'Walk through centuries of Mughal history. Marvel at the intricate frescoes of the Sheesh Mahal (Palace of Mirrors) and stand in the colossal courtyard of the iconic Badshahi Mosque.',
        wikiTitle: 'Badshahi_Mosque',
        fallbackImage: 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884'
    },
    {
        title: 'Walled City Food Tour',
        location: 'Lahore',
        duration: '1 Day',
        price: 40,
        category: 'Food & Culture',
        description: 'A culinary adventure through the narrow, vibrant alleys of the Walled City. Taste legendary dishes like Siri Paye, Nihari, and freshly fried Jalebis while experiencing authentic Lahori street culture.',
        wikiTitle: 'Lahore_Fort',
        fallbackImage: 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884'
    }
];

const hyperRealisticHotels = [
    { name: 'Luxus Hunza', location: 'Hunza Valley', wikiTitle: 'Attabad_Lake', priceInfo: '$150 / night', amenities: 'Lake View, Free Wi-Fi, Breakfast Included', description: 'Experience luxury on the cliffs overlooking the stunning turquoise waters of Attabad Lake.', bedrooms: 1, bathrooms: 1 },
    { name: 'Hunza Darbar Hotel', location: 'Hunza Valley', wikiTitle: 'Hunza_Valley', priceInfo: '$100 / night', amenities: 'Mountain View, Restaurant, Free Parking', description: 'A traditional yet comfortable stay with panoramic views of the Rakaposhi peak.', bedrooms: 2, bathrooms: 1 },
    { name: 'Shangrila Resort', location: 'Skardu Valley', wikiTitle: 'Shangrila_Resort', priceInfo: '$200 / night', amenities: 'Heart-shaped Lake, Boating, Helipad', description: 'Famous globally as heaven on earth, featuring unique airplane-shaped suites and lush gardens.', bedrooms: 1, bathrooms: 1 },
    { name: 'K2 Motel Skardu', location: 'Skardu Valley', wikiTitle: 'Skardu', priceInfo: '$80 / night', amenities: 'City Center, Breakfast, Wi-Fi', description: 'Conveniently located near the Skardu bazaar, perfect for trekkers preparing for the big mountains.', bedrooms: 1, bathrooms: 1 },
    { name: 'Pearl Continental Bhurban', location: 'Naran Kaghan', wikiTitle: 'Pearl-Continental_Hotels_&_Resorts', priceInfo: '$180 / night', amenities: 'Golf Course, Spa, Pool', description: 'A 5-star premium resort offering unmatched luxury amid the misty pine hills.', bedrooms: 2, bathrooms: 2 },
    { name: 'Swiss Woodhouse Naran', location: 'Naran Kaghan', wikiTitle: 'Kaghan_Valley', priceInfo: '$150 / night', amenities: 'River View, Bonfire, Heaters', description: 'Charming wooden cabins right beside the rushing Kunhar river, offering a purely alpine experience.', bedrooms: 3, bathrooms: 2 },
    { name: 'Walnut Heights Resort', location: 'Swat Valley', wikiTitle: 'Swat_District', priceInfo: '$120 / night', amenities: 'Garden, Hiking Trails, Free Wi-Fi', description: 'Nestled deep in Kalam, this serene resort is surrounded by giant walnut trees and snow peaks.', bedrooms: 2, bathrooms: 1 },
    { name: 'Swat Serena Hotel', location: 'Swat Valley', wikiTitle: 'Saidu_Sharif', priceInfo: '$180 / night', amenities: 'Pool, Heritage Architecture, Fine Dining', description: 'A royal stay in what was once the residence of the Wali (Ruler) of Swat, preserving colonial charm.', bedrooms: 2, bathrooms: 1 },
    { name: 'Serena Hotel Islamabad', location: 'Lahore', wikiTitle: 'Minar-e-Pakistan', priceInfo: '$250 / night', amenities: '5-Star, Spa, Multiple Restaurants', description: 'An oasis of luxury combining traditional Islamic architecture with modern 5-star amenities.', bedrooms: 1, bathrooms: 1 },
    { name: 'Avari Hotel Lahore', location: 'Lahore', wikiTitle: 'Lahore', priceInfo: '$200 / night', amenities: 'Pool, Tennis Court, Mall Access', description: 'Located on the historic Mall Road, Avari offers unparalleled luxury right in the cultural heart of the city.', bedrooms: 1, bathrooms: 1 }
];

async function generateRealisticData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB. Starting Hyper-Realistic Sync...');

        // Process Tours
        for (const t of hyperRealisticTours) {
            console.log(`Fetching real image for Tour: ${t.title}`);
            const imageUrl = await getWikiImage(t.wikiTitle, t.fallbackImage);
            
            const existing = await Tour.findOne({ title: t.title });
            if (existing) {
                existing.imageUrl = imageUrl;
                existing.description = t.description;
                existing.price = t.price;
                existing.duration = t.duration;
                await existing.save();
                console.log(`  -> Updated: ${t.title}`);
            } else {
                await Tour.create({ ...t, imageUrl });
                console.log(`  -> Created: ${t.title}`);
            }
        }

        // Process Hotels
        for (const h of hyperRealisticHotels) {
            console.log(`Fetching real image for Hotel: ${h.name}`);
            const image = await getWikiImage(h.wikiTitle, 'https://images.unsplash.com/photo-1566073771259-6a8506099945');
            
            const existing = await Hotel.findOne({ name: h.name });
            if (existing) {
                existing.image = image;
                existing.location = h.location;
                existing.description = h.description;
                existing.amenities = h.amenities;
                await existing.save();
                console.log(`  -> Updated: ${h.name}`);
            } else {
                await Hotel.create({ ...h, image });
                console.log(`  -> Created: ${h.name}`);
            }
        }

        // Update Destination Images just to be sure they match the new realism
        const destImages = {
            'Lahore': await getWikiImage('Lahore_Fort', ''),
            'Hunza Valley': await getWikiImage('Rakaposhi', ''),
            'Skardu Valley': await getWikiImage('K2', ''),
            'Swat Valley': await getWikiImage('Malam_Jabba', ''),
            'Naran Kaghan': await getWikiImage('Lake_Saiful_Muluk', '')
        };
        for (const [name, imgUrl] of Object.entries(destImages)) {
            if (!imgUrl) continue;
            const dest = await Destination.findOne({ name });
            if (dest) {
                dest.image = imgUrl;
                await dest.save();
                console.log(`Updated Destination Image: ${name}`);
            }
        }

        console.log('✅ Hyper-Realistic Data Sync Complete!');
        process.exit(0);
    } catch (err) {
        console.error('Data Sync Failed:', err);
        process.exit(1);
    }
}

generateRealisticData();
