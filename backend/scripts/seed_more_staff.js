const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config({ path: '.env' });

async function seedStaff() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/destino');
        
        const salt = await bcrypt.genSalt(10);
        const driverPass = await bcrypt.hash('Driver@123', salt);
        const managerPass = await bcrypt.hash('Manager@123', salt);
        const guidePass = await bcrypt.hash('Guide@123', salt);
        
        const newStaff = [
            {
                name: 'Fatima Zahra',
                email: 'fatima.hr@destino.com',
                passwordHash: managerPass,
                role: 'staff',
                position: 'HR Manager',
                department: 'Human Resources',
                salary: 95000,
                phone: '0300-1234567',
                cnic: '35201-1122334-5',
                address: 'Lahore, Pakistan',
                experience: '7 Years',
                emergencyContact: '0321-1234567'
            },
            {
                name: 'Usman Ghani',
                email: 'usman.finance@destino.com',
                passwordHash: managerPass,
                role: 'staff',
                position: 'Senior Accountant',
                department: 'Finance',
                salary: 80000,
                phone: '0333-7654321',
                cnic: '35202-9988776-3',
                address: 'Islamabad, Pakistan',
                experience: '5 Years',
                emergencyContact: '0300-7654321'
            },
            {
                name: 'Sana Javed',
                email: 'sana.booking@destino.com',
                passwordHash: managerPass,
                role: 'staff',
                position: 'Booking Agent',
                department: 'Sales',
                salary: 50000,
                phone: '0345-1122112',
                cnic: '35201-4455667-2',
                address: 'Karachi, Pakistan',
                experience: '3 Years',
                emergencyContact: '0311-1122112'
            },
            {
                name: 'Ali Imran',
                email: 'ali.it@destino.com',
                passwordHash: managerPass,
                role: 'staff',
                position: 'IT Administrator',
                department: 'Information Technology',
                salary: 85000,
                phone: '0312-3344556',
                cnic: '35201-5544332-1',
                address: 'Lahore, Pakistan',
                experience: '6 Years',
                emergencyContact: '0333-3344556'
            },
            {
                name: 'Nadia Khan',
                email: 'nadia.social@destino.com',
                passwordHash: managerPass,
                role: 'staff',
                position: 'Social Media Manager',
                department: 'Marketing',
                salary: 60000,
                phone: '0321-9988001',
                cnic: '35202-1122998-4',
                address: 'Islamabad, Pakistan',
                experience: '4 Years',
                emergencyContact: '0300-9988001'
            }
        ];

        for (const staff of newStaff) {
            const exists = await User.findOne({ email: staff.email });
            if (!exists) {
                await User.create(staff);
                console.log(`Created staff: ${staff.email}`);
            } else {
                console.log(`Staff already exists: ${staff.email}`);
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
seedStaff();
