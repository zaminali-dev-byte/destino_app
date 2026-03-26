const mongoose = require('mongoose');
require('dotenv').config();

const Destination = require('./models/Destination');
const Hotel = require('./models/Hotel');
const Tour = require('./models/Tour');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/destino';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connection established for Seeder'))
  .catch(err => console.error('MongoDB connection error:', err));

const importData = async () => {
  try {
    await Destination.deleteMany();
    await Hotel.deleteMany();
    await Tour.deleteMany();

    const destinations = [
      {
        name: "Hunza Valley",
        image: "assets/images/destinations/destination1.jpg",
        link: "destination1.html",
        toursCount: 15,
        activityCount: 20
      },
      {
        name: "Skardu",
        image: "assets/images/destinations/destination2.jpg",
        link: "destination2.html",
        toursCount: 12,
        activityCount: 18
      },
      {
        name: "Swat Valley",
        image: "assets/images/destinations/destination3.jpg",
        link: "destination-details.html",
        toursCount: 10,
        activityCount: 15
      },
      {
        name: "Fairy Meadows",
        image: "assets/images/destinations/destination4.jpg",
        link: "destination-details.html",
        toursCount: 8,
        activityCount: 12
      }
    ];

    const hotels = [
      {
        name: "Northern Lights Resort",
        image: "assets/images/destinations/hotel1.jpg",
        location: "Hunza Valley",
        bedrooms: 2,
        kitchens: 1,
        bathrooms: 2,
        amenities: "Free Wifi, Breakfast",
        priceInfo: "$120",
        rating: 5,
        imageRight: false,
        delay: "0"
      },
      {
        name: "Skardu View Hotel",
        image: "assets/images/destinations/hotel2.jpg",
        location: "Skardu",
        bedrooms: 1,
        kitchens: 0,
        bathrooms: 1,
        amenities: "Mountain View, Room Service",
        priceInfo: "$90",
        rating: 4,
        imageRight: true,
        delay: "100"
      },
      {
        name: "Swat River Resort",
        image: "assets/images/destinations/hotel3.jpg",
        location: "Swat Valley",
        bedrooms: 3,
        kitchens: 1,
        bathrooms: 3,
        amenities: "River View, Riverside Dining",
        priceInfo: "$150",
        rating: 5,
        imageRight: false,
        delay: "200"
      }
    ];

    const tours = [
      {
        title: "Hunza Explorer",
        category: "Adventure",
        price: 500,
        duration: "7 Days",
        description: "Explore the beautiful Hunza Valley.",
        imageUrl: "assets/images/destinations/tour1.jpg",
        featured: true
      }
    ];

    await Destination.insertMany(destinations);
    await Hotel.insertMany(hotels);
    await Tour.insertMany(tours);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
