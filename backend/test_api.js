const http = require('http');

const endpoints = ['staff', 'bookings', 'users', 'packages', 'destinations', 'hotels', 'complaints', 'expenses', 'payroll'];

endpoints.forEach(ep => {
    http.get(`http://localhost:4000/api/${ep}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`GET /api/${ep} - Status: ${res.statusCode} - Body: ${data.substring(0, 100)}`);
        });
    }).on('error', err => {
        console.error(`Error on /api/${ep}:`, err.message);
    });
});
