const http = require('http');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://127.0.0.1:27017/destino').then(async () => {
    const admin = await User.findOne({ role: 'admin' });
    const token = jwt.sign({ id: admin._id }, 'secret123', { expiresIn: '30d' });
    
    http.get(`http://localhost:4000/api/payments`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`GET /api/payments - Status: ${res.statusCode} - Body: ${data.substring(0, 100)}`);
            process.exit(0);
        });
    });
});
