const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Destination = require('./models/Destination');
const Hotel = require('./models/Hotel');
const Ride = require('./models/Ride');

const newDestinations = [
    {
        name: 'Hunza Valley',
        image: '/images/destinations/hunza.jpg',
        description: 'Majestic mountains, Attabad Lake, and rich cultural heritage.',
        toursCount: 15,
        activityCount: 8,
        lat: 36.3167,
        lng: 74.6500
    },
    {
        name: 'Skardu Valley',
        image: '/images/destinations/skardu.jpg',
        description: 'Gateway to K2, featuring Shangrila Lake and cold deserts.',
        toursCount: 12,
        activityCount: 5,
        lat: 35.2971,
        lng: 75.6333
    },
    {
        name: 'Naran Kaghan',
        image: '/images/destinations/naran.jpg',
        description: 'Lush green valleys, Saif-ul-Malook lake, and scenic views.',
        toursCount: 20,
        activityCount: 10,
        lat: 34.9080,
        lng: 73.6506
    },
    {
        name: 'Swat Valley',
        image: '/images/destinations/swat.jpg',
        description: 'Known as the Switzerland of the East, featuring Kalam and Malam Jabba.',
        toursCount: 18,
        activityCount: 7,
        lat: 35.2227,
        lng: 72.4258
    },
    {
        name: 'Lahore',
        image: '/images/destinations/lahore.jpg',
        description: 'Explore the Badshahi Mosque, Lahore Fort, and vibrant culture.',
        toursCount: 25,
        activityCount: 15,
        lat: 31.5204,
        lng: 74.3587
    }
];

const newHotels = [
    {
        name: 'Luxus Hunza',
        image: '/images/hotels/luxus.jpg',
        location: 'Attabad Lake, Hunza',
        priceInfo: '$150 / night',
        bedrooms: 2,
        kitchens: 1,
        bathrooms: 2,
        amenities: 'Lake View, Free WiFi, Breakfast Included',
        rating: 5
    },
    {
        name: 'Shangrila Resort',
        image: '/images/hotels/shangrila.jpg',
        location: 'Lower Kachura Lake, Skardu',
        priceInfo: '$180 / night',
        bedrooms: 1,
        kitchens: 0,
        bathrooms: 1,
        amenities: 'Resort, Boating, Fine Dining',
        rating: 5
    },
    {
        name: 'Pearl Continental Bhurban',
        image: '/images/hotels/pc.jpg',
        location: 'Bhurban, Murree',
        priceInfo: '$200 / night',
        bedrooms: 3,
        kitchens: 1,
        bathrooms: 3,
        amenities: 'Mountain View, Spa, Gym',
        rating: 5
    },
    {
        name: 'Walnut Heights Resort',
        image: '/images/hotels/walnut.jpg',
        location: 'Kalam, Swat',
        priceInfo: '$120 / night',
        bedrooms: 2,
        kitchens: 1,
        bathrooms: 1,
        amenities: 'Wooden Cabins, Scenic Views, Heater',
        rating: 4.5
    },
    {
        name: 'Serena Hotel Islamabad',
        image: '/images/hotels/serena.jpg',
        location: 'Islamabad',
        priceInfo: '$250 / night',
        bedrooms: 1,
        kitchens: 0,
        bathrooms: 1,
        amenities: 'Luxury, Central, Pool, Multiple Restaurants',
        rating: 5
    }
];

const newRides = [
    {
        driverName: 'Ali Khan',
        vehicleType: 'Toyota Prado',
        licensePlate: 'ISB-123',
        capacity: 4,
        pricePerDay: 150,
        status: 'Available'
    },
    {
        driverName: 'Zubair Ahmed',
        vehicleType: 'Toyota Hiace Grand Cabin',
        licensePlate: 'LHR-456',
        capacity: 13,
        pricePerDay: 100,
        status: 'Available'
    },
    {
        driverName: 'Usman Ali',
        vehicleType: 'Honda Civic',
        licensePlate: 'KHI-789',
        capacity: 3,
        pricePerDay: 50,
        status: 'Available'
    },
    {
        driverName: 'Faizan Raza',
        vehicleType: 'Toyota Hilux Revo',
        licensePlate: 'GB-001',
        capacity: 4,
        pricePerDay: 120,
        status: 'Available'
    },
    {
        driverName: 'Asad Iqbal',
        vehicleType: 'Coaster Saloon',
        licensePlate: 'RWP-999',
        capacity: 22,
        pricePerDay: 200,
        status: 'Available'
    }
];

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        // Seed Destinations
        for (const dest of newDestinations) {
            const exists = await Destination.findOne({ name: dest.name });
            if (!exists) {
                await Destination.create(dest);
                console.log(`Inserted Destination: ${dest.name}`);
            } else {
                console.log(`Destination already exists: ${dest.name}`);
            }
        }

        // Seed Hotels
        for (const hotel of newHotels) {
            const exists = await Hotel.findOne({ name: hotel.name });
            if (!exists) {
                await Hotel.create(hotel);
                console.log(`Inserted Hotel: ${hotel.name}`);
            } else {
                console.log(`Hotel already exists: ${hotel.name}`);
            }
        }

        // Seed Rides
        for (const ride of newRides) {
            const exists = await Ride.findOne({ licensePlate: ride.licensePlate });
            if (!exists) {
                await Ride.create(ride);
                console.log(`Inserted Ride: ${ride.vehicleType} (${ride.licensePlate})`);
            } else {
                console.log(`Ride already exists: ${ride.licensePlate}`);
            }
        }

        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seedData();
