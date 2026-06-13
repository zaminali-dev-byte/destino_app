const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Payroll = require('../models/Payroll');
const Booking = require('../models/Booking');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

// We define a temporary schema to read from the old staff collection
const oldStaffSchema = new mongoose.Schema({}, { strict: false });
const OldStaff = mongoose.model('OldStaff', oldStaffSchema, 'staff');

async function migrate() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/destino');
        console.log('Connected to DB');

        const allStaff = await OldStaff.find();
        console.log(`Found ${allStaff.length} staff records to migrate.`);

        const oldToNewMap = {};

        for (const staff of allStaff) {
            let user = await User.findOne({ email: staff.email });
            
            if (!user) {
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash('Staff@123!', salt);
                
                user = new User({
                    name: staff.name,
                    email: staff.email,
                    passwordHash,
                    role: 'staff',
                    phone: staff.phone,
                    position: staff.position,
                    department: staff.department,
                    salary: staff.salary,
                    cnic: staff.cnic,
                    address: staff.address,
                    license: staff.licenseNumber,
                    vehicleNumber: staff.vehiclePlate,
                    hireDate: staff.hireDate || new Date()
                });
                await user.save();
                console.log(`Created new User for staff: ${staff.name}`);
            } else {
                console.log(`User already exists for staff: ${staff.name}, updating role to staff`);
                user.role = 'staff';
                user.position = staff.position || user.position;
                user.department = staff.department || user.department;
                user.salary = staff.salary || user.salary;
                user.license = staff.licenseNumber || user.license;
                user.vehicleNumber = staff.vehiclePlate || user.vehicleNumber;
                await user.save();
            }

            oldToNewMap[staff._id.toString()] = user._id;
        }

        console.log('Updating Expenses...');
        const expenses = await Expense.find();
        for (const exp of expenses) {
            if (exp.staffId && oldToNewMap[exp.staffId.toString()]) {
                exp.staffId = oldToNewMap[exp.staffId.toString()];
                await exp.save();
            }
        }

        console.log('Updating Payrolls...');
        const payrolls = await Payroll.find();
        for (const pay of payrolls) {
            if (pay.staffId && oldToNewMap[pay.staffId.toString()]) {
                pay.staffId = oldToNewMap[pay.staffId.toString()];
                await pay.save();
            }
        }
        
        console.log('Updating Bookings...');
        const bookings = await Booking.find();
        for (const book of bookings) {
            if (book.assignedStaff && oldToNewMap[book.assignedStaff.toString()]) {
                book.assignedStaff = oldToNewMap[book.assignedStaff.toString()];
                await book.save();
            }
        }

        console.log('Migration complete. You can now drop the old staff collection if desired.');
        console.log('Command: mongoose.connection.db.dropCollection("staff")');
        
        // Actually drop it
        try {
            await mongoose.connection.db.dropCollection('staff');
            console.log('Old staff collection dropped successfully.');
        } catch(e) {
            console.log('Staff collection drop skipped (might not exist).');
        }

        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
