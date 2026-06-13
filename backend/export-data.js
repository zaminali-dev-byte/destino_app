const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const models = {
    Destination: require('./models/Destination'),
    Hotel: require('./models/Hotel'),
    Tour: require('./models/Tour'),
    User: require('./models/User'),
    Booking: require('./models/Booking'),
    Package: require('./models/Package'),
    Itinerary: require('./models/Itinerary'),
    Ride: require('./models/Ride'),
    Staff: require('./models/Staff'),
    CompanyPolicy: require('./models/CompanyPolicy'),
    Coupon: require('./models/Coupon'),
    Payment: require('./models/Payment')
};

const exportData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/destino');
        console.log('Connected to local MongoDB for export...');

        const backupDir = path.join(__dirname, 'backup');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        for (const [name, model] of Object.entries(models)) {
            const data = await model.find({});
            const filePath = path.join(backupDir, `${name.toLowerCase()}s.json`);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`Exported ${data.length} records to ${filePath}`);
        }

        console.log('\n✅ All data exported to the "backend/backup" folder.');
        console.log('You can now open MongoDB Compass, connect to Atlas, and use the "Import Data" button for these files.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

exportData();
