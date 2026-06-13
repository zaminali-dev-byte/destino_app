const http = require('http');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://127.0.0.1:27017/destino').then(async () => {
    const admin = await User.findOne({ role: 'admin' });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'destino_secret_key', { expiresIn: '30d' });
    
    const endpoints = ['packages', 'destinations', 'hotels', 'tours', 'users', 'staff', 'payments', 'coupons', 'complaints', 'contact'];
    
    for (const ep of endpoints) {
        await new Promise(resolve => {
            http.get(`http://localhost:4000/api/${ep}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    console.log(`GET /api/${ep} - Status: ${res.statusCode} - Ok: ${res.statusCode >= 200 && res.statusCode < 300}`);
                    if (res.statusCode >= 400) console.log(`   Error: ${data}`);
                    resolve();
                });
            }).on('error', err => {
                console.error(`Error on /api/${ep}:`, err.message);
                resolve();
            });
        });
    }
    process.exit(0);
});
