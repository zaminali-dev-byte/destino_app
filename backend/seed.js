const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Destination = require('./models/Destination');
const Tour = require('./models/Tour');
const Package = require('./models/Package');
const Itinerary = require('./models/Itinerary');
const Hotel = require('./models/Hotel');
const Ride = require('./models/Ride');
const CompanyPolicy = require('./models/CompanyPolicy');
const Coupon = require('./models/Coupon');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');
const AddOn = require('./models/AddOn');
const Complaint = require('./models/Complaint');
const Contact = require('./models/Contact');
const JobApplication = require('./models/JobApplication');
const Expense = require('./models/Expense');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/destino');
        console.log('Connected to MongoDB');

        const collections = [
            'users', 'user', 'destinations', 'destination', 'tours', 'tour', 
            'packages', 'package', 'itineraries', 'itinerary', 'hotels', 'hotel',
            'rides', 'ride', 'staffs', 'staff', 'companypolicies', 'company policy', 
            'coupons', 'coupon', 'bookings', 'booking', 'payments', 'payment',
            'add_ons', 'add_on', 'complaints', 'contacts', 'jobapplications', 'expenses', 'expense'
        ];

        for (const coll of collections) {
            try {
                await mongoose.connection.db.dropCollection(coll);
                console.log(`Dropped collection: ${coll}`);
            } catch (e) {
                // Ignore error if collection doesn't exist
            }
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);
        
        // ── Seed Users ────────────────────────────────────────────────────────
        const users = await User.insertMany([
            { name: 'Admin User', email: 'admin@destino.com', passwordHash, role: 'admin' },
            { name: 'Admin Test', email: 'admin@test.com', passwordHash, role: 'admin' },
            { 
                name: 'Tariq Guide', 
                email: 'guide@destino.com', 
                passwordHash, 
                role: 'staff',
                phone: '0300-1122334',
                cnic: '35201-1234567-1',
                license: 'HTV-LR-2024-88',
                vehicleNumber: 'LED-9900',
                vehicleModel: 'Toyota Hiace High Roof',
                experience: '12 Years Mountain Guide',
                emergencyContact: '+92-300-9988776',
                bankName: 'Destino Trust Bank',
                bankAccountNumber: 'PK36 DEST 0987 6543 2109'
            },
            { name: 'Ali IT', email: 'ali.it@destino.com', passwordHash, role: 'staff', department: 'IT' },
            { name: 'John Traveler', email: 'user@destino.com', passwordHash, role: 'customer', phone: '0321-5556677' },
            { name: 'Ali Destion', email: 'ali@destion.com', passwordHash, role: 'customer' },
            { name: 'Jaudat Ali', email: 'jaudatali459@gmail.com', passwordHash, role: 'customer' },
            { name: 'User Test', email: 'user@test.com', passwordHash, role: 'customer' }
        ]);

        const admin = users[0];
        const staff = users[1];
        const customer = users[2];

        // ── Seed Destinations ──────────────────────────────────────────────────
        const dests = await Destination.insertMany([
            { name: 'Hunza Valley', image: 'assets/images/destinations/hunza.png', link: '/search?q=Hunza', toursCount: 45, activityCount: 120 },
            { name: 'Skardu', image: 'assets/images/destinations/skardu.png', link: '/search?q=Skardu', toursCount: 32, activityCount: 85 },
            { name: 'Fairy Meadows', image: 'assets/images/destinations/fairy_meadows.png', link: '/search?q=Fairy Meadows', toursCount: 18, activityCount: 40 },
            { name: 'Swat Valley', image: 'assets/images/destinations/swat.png', link: '/search?q=Swat', toursCount: 50, activityCount: 110 },
            { name: 'Naran Kaghan', image: 'assets/images/destinations/naran.png', link: '/search?q=Naran', toursCount: 65, activityCount: 150 },
            { name: 'Neelum Valley', image: 'assets/images/destinations/neelum.png', link: '/search?q=Neelum', toursCount: 22, activityCount: 55 }
        ]);

        // ── Seed Tours ────────────────────────────────────────────────────────
        const tours = await Tour.insertMany([
            { title: '7 Days Majestic Hunza Tour', category: 'Family', price: 500, duration: '7 Days', description: 'Experience the breathtaking beauty of Hunza valley with your family.', imageUrl: 'assets/images/destinations/hunza.png', featured: true },
            { title: 'K2 Base Camp Expedition', category: 'Hiking & Camping', price: 1200, duration: '14 Days', description: 'A rigorous and rewarding trek.', imageUrl: 'assets/images/destinations/skardu.png' },
            { title: 'Fairy Meadows Adventure', category: 'Hiking & Camping', price: 400, duration: '5 Days', description: 'Walk through the lush green Fairy Meadows.', imageUrl: 'assets/images/destinations/fairy_meadows.png' }
        ]);

        // ── Seed Hotels ───────────────────────────────────────────────────────
        const hotels = await Hotel.insertMany([
            { name: 'Serena Hotel Gilgit', image: 'assets/images/destinations/serena_gilgit.png', location: 'Gilgit', bedrooms: 50, bathrooms: 50, kitchens: 2, amenities: 'WiFi, Breakfast Included, Heating, pool', priceInfo: '$150/night', rating: 5 },
            { name: 'Shangrila Resort', image: 'assets/images/destinations/shangrila_resort.png', location: 'Skardu', bedrooms: 40, bathrooms: 40, kitchens: 0, amenities: 'Lake View, Boating, Spa, Breakfast, pool', priceInfo: '$250/night', rating: 5 }
        ]);

        // ── Seed Packages & Itineraries ────────────────────────────────────────
        const packages = await Package.insertMany([
            { 
                title: 'Grand Northern Pakistan Adventure', 
                category: 'Adventure', 
                price: 1500, 
                durationDays: 10, 
                description: 'The ultimate 10-day tour covering Islamabad, Hunza, and Skardu.', 
                imageUrl: 'assets/images/destinations/hunza.png', 
                featured: true 
            },
            { 
                title: 'Romantic Swat Gateway', 
                category: 'Luxury', 
                price: 800, 
                durationDays: 5, 
                description: 'A perfect 5-day escape for couples in the Switzerland of the East.', 
                imageUrl: 'assets/images/destinations/swat.png' 
            }
        ]);

        await Itinerary.insertMany([
            {
                packageId: packages[0]._id,
                dayNumber: 1,
                title: 'Arrival in Islamabad',
                description: 'Meet and greet at the airport, then transfer to the hotel.',
                activities: ['Airport Pickup', 'Dinner at Monal']
            },
            {
                packageId: packages[0]._id,
                dayNumber: 2,
                title: 'Fly to Gilgit',
                description: 'A scenic flight over the Himalayas and Karakoram.',
                activities: ['Flight to Gilgit', 'Drive to Hunza', 'Attabad Lake visit']
            },
            {
                packageId: packages[1]._id,
                dayNumber: 1,
                title: 'Welcome to Swat',
                description: 'Drive from Islamabad to Mingora, Swat.',
                activities: ['Road Trip', 'Check-in at River Resort']
            }
        ]);

        // ── Seed Staff HR Records ──────────────────────────────────────────────
        const extraStaff = await User.insertMany([
            { name: 'Ali Ahmed', email: 'ali@destino.com', passwordHash, role: 'staff', position: 'Tour Manager', department: 'Operations', salary: 85000, phone: '0300-9988112', departmentBudget: 500000 },
            { name: 'Sarah Khan', email: 'sarah@destino.com', passwordHash, role: 'staff', position: 'Sales Executive', department: 'Sales', salary: 65000, phone: '0321-4455667', commissionRate: 5 },
            { name: 'Umer Farooq', email: 'umer@destino.com', passwordHash, role: 'staff', position: 'Mountain Guide', department: 'Field Operations', salary: 75000, phone: '0311-2233445', tourAllowance: 3000 },
            { name: 'Ahmed Driver', email: 'ahmed.driver@destino.com', passwordHash, role: 'staff', position: 'Driver', department: 'Transport', fuelAllowance: 15000, vehicleNumber: 'LED-9911', vehicleModel: 'Toyota Hiace' },
            { name: 'Bilal Driver', email: 'bilal.driver@destino.com', passwordHash, role: 'staff', position: 'Driver', department: 'Transport', fuelAllowance: 12000, vehicleNumber: 'LXM-4422', vehicleModel: 'Honda BRV' },
            { name: 'Hassan Driver', email: 'hassan.driver@destino.com', passwordHash, role: 'staff', position: 'Driver', department: 'Transport', fuelAllowance: 18000, vehicleNumber: 'RIB-3311', vehicleModel: 'Toyota Coaster' },
            { name: 'Kamran Guide', email: 'kamran.guide@destino.com', passwordHash, role: 'staff', position: 'Guide', department: 'Field Operations', tourAllowance: 2500 },
            { name: 'Salman Guide', email: 'salman.guide@destino.com', passwordHash, role: 'staff', position: 'Guide', department: 'Field Operations', tourAllowance: 2500 },
            { name: 'Aisha Marketing', email: 'aisha.marketing@destino.com', passwordHash, role: 'staff', position: 'Marketing Exec', department: 'Marketing', departmentBudget: 250000 },
            { name: 'Faizan Support', email: 'faizan.support@destino.com', passwordHash, role: 'staff', position: 'Support Agent', department: 'Customer Support', commissionRate: 0 },
            { name: 'Fatima HR', email: 'fatima.hr@destino.com', passwordHash, role: 'staff', position: 'HR Manager', department: 'Human Resources', departmentBudget: 100000 },
            { name: 'Nadia Social', email: 'nadia.social@destino.com', passwordHash, role: 'staff', position: 'Social Media Mgr', department: 'Marketing', departmentBudget: 50000 },
            { name: 'Sana Booking', email: 'sana.booking@destino.com', passwordHash, role: 'staff', position: 'Booking Agent', department: 'Sales', commissionRate: 3 },
            { name: 'Usman Finance', email: 'usman.finance@destino.com', passwordHash, role: 'staff', position: 'Finance Officer', department: 'Finance', departmentBudget: 1000000 },
            { name: 'Zainab Manager', email: 'zainab.manager@destino.com', passwordHash, role: 'staff', position: 'General Manager', department: 'Management', departmentBudget: 5000000 }
        ]);

        // ── Seed Rides ────────────────────────────────────────────────────────
        await Ride.insertMany([
            { driverName: 'Ishaq Khan', vehicleType: 'Toyota Hiace', licensePlate: 'IDL-4455', capacity: 12, pricePerDay: 150, status: 'Available' },
            { driverName: 'Zubair Shah', vehicleType: 'Prado 4x4', licensePlate: 'LED-9000', capacity: 4, pricePerDay: 200, status: 'Available' },
            { driverName: 'Mavia Jutt', vehicleType: 'Coaster', licensePlate: 'ICT-1122', capacity: 25, pricePerDay: 400, status: 'Maintenance' }
        ]);

        // ── Seed Add-ons ──────────────────────────────────────────────────────
        await AddOn.insertMany([
            { name: 'Professional Photographer', description: 'Capture your memories with a pro.', price: 50, category: 'Other' },
            { name: 'Mountain Bike Rental', description: 'Explore the trails on two wheels.', price: 20, category: 'Equipment' },
            { name: 'Bonfire Night', description: 'Evening gathering with music and snacks.', price: 30, category: 'Meal' }
        ]);

        // ── Seed Company Policies ─────────────────────────────────────────────
        await CompanyPolicy.insertMany([
            { title: 'Refund Policy', content: 'Full refund if cancelled 15 days before departure.', category: 'Legal' },
            { title: 'Safety Protocol', content: 'Safety is our top priority. All guides are certified.', category: 'Customer Service' }
        ]);

        // ── Seed Support (Complaints & Contact) ───────────────────────────────
        await Complaint.insertMany([
            { customerName: 'Asad Ali', email: 'asad@test.com', subject: 'Late Pickup', message: 'The driver was 30 minutes late.', status: 'Open' }
        ]);

        await Contact.insertMany([
            { name: 'Marina J', email: 'marina@test.com', message: 'I want to book a custom tour for 20 people.', status: 'Unread' }
        ]);

        // ── Seed Job Applications ─────────────────────────────────────────────
        await JobApplication.insertMany([
            { name: 'Hamza Malik', email: 'hamza@careers.com', phone: '0333-5551122', cnic: '35202-9988771-1', education: 'BS Tourism', status: 'Pending' }
        ]);

        // ── Seed Coupons ──────────────────────────────────────────────────────
        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);

        const coupons = await Coupon.insertMany([
            { code: 'WELCOME10', discountType: 'Percentage', discountValue: 10, validFrom: today, validTo: nextMonth, minOrderAmount: 100 },
            { code: 'DESTINO50', discountType: 'Fixed', discountValue: 50, validFrom: today, validTo: nextMonth, minOrderAmount: 300 }
        ]);

        // ── Seed Sample Bookings & Payments ───────────────────────────────────
        const sampleBookings = await Booking.insertMany([
            {
                customerName:   customer.name,
                email:          customer.email,
                phone:          customer.phone,
                userId:         customer._id,
                tourId:         tours[0]._id,
                date:           new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)),
                guests:         2,
                baseAmount:     1000,
                discountAmount: 100,
                totalAmount:    900,
                couponCode:     'WELCOME10',
                status:         'Confirmed',
                paymentStatus:  'Paid',
                paymentMethod:  'Online Banking',
                assignedStaff:  staff._id,
                assignmentStatus: 'Accepted'
            }
        ]);

        await Payment.insertMany([
            {
                bookingId:     sampleBookings[0]._id,
                userId:        customer._id,
                transactionId: 'TXN-CLOUD-9988',
                amount:        900,
                paymentMethod: 'Credit Card',
                status:        'Completed'
            }
        ]);

        // ── Seed Expenses ─────────────────────────────────────────────────────
        await Expense.insertMany([
            { category: 'Fuel', amount: 5000, description: 'Fuel for trip to Hunza', date: new Date(), staffId: staff._id, vehiclePlate: staff.vehicleNumber, tourId: tours[0]._id },
            { category: 'Maintenance', amount: 15000, description: 'Oil change and filters', date: new Date(), staffId: staff._id, vehiclePlate: staff.vehicleNumber },
            { category: 'Fines & Penalties', amount: 1000, description: 'Speeding ticket near Naran', date: new Date(), staffId: staff._id, vehiclePlate: staff.vehicleNumber }
        ]);

        console.log('✅ DATABASE COMPREHENSIVELY SEEDED WITH ALL COLLECTIONS!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
