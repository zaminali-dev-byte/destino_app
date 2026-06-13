const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const migrateStaff = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/destino');
        console.log('Connected to MongoDB for Migration');

        const staffUpdate = {
            cnic: '35201-1234567-1',
            license: 'HTV-LR-2024-88',
            vehicleNumber: 'LED-9900',
            vehicleModel: 'Toyota Hiace High Roof',
            experience: '12 Years Mountain Guide',
            emergencyContact: '+92-300-9988776'
        };

        const result = await User.updateMany(
            { role: 'staff' },
            { $set: staffUpdate }
        );

        console.log(`Successfully updated ${result.modifiedCount} staff members with security credentials.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrateStaff();
