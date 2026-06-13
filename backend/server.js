const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/tours', require('./routes/tourRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// New Phase 1 Routes
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/itineraries', require('./routes/itineraryRoutes'));
app.use('/api/rides', require('./routes/rideRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/company-policies', require('./routes/companypolicyRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/addons', require('./routes/addonRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/subscribers', require('./routes/subscriberRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/payroll', require('./routes/payrollRoutes'));
app.use('/api/memos', require('./routes/memoRoutes'));
// API Root JSON
app.get('/api', (req, res) => {
    res.json({
        message: '🌍 Destino API is running',
        version: '1.0.0',
        status: 'online',
        endpoints: {
            destinations:    '/api/destinations',
            tours:           '/api/tours',
            hotels:          '/api/hotels',
            packages:        '/api/packages',
            bookings:        '/api/bookings',
            itineraries:     '/api/itineraries',
            rides:           '/api/rides',
            users:           '/api/users',
            auth:            '/api/auth',
            staff:           '/api/staff',
            payments:        '/api/payments',
            coupons:         '/api/coupons',
            addons:          '/api/addons',
            complaints:      '/api/complaints',
            applications:    '/api/applications',
            companyPolicies: '/api/company-policies',
            contact:         '/api/contact',
            admin:           '/api/admin',
        }
    });
});

// Backend Dashboard — beautiful HTML page at http://localhost:4000
const endpoints = [
    ['Destinations',     '/api/destinations'],
    ['Tours',            '/api/tours'],
    ['Hotels',           '/api/hotels'],
    ['Packages',         '/api/packages'],
    ['Bookings',         '/api/bookings'],
    ['Itineraries',      '/api/itineraries'],
    ['Rides',            '/api/rides'],
    ['Users',            '/api/users'],
    ['Auth',             '/api/auth'],
    ['Staff',            '/api/staff'],
    ['Payments',         '/api/payments'],
    ['Coupons',          '/api/coupons'],
    ['Add-ons',          '/api/addons'],
    ['Complaints',       '/api/complaints'],
    ['Applications',     '/api/applications'],
    ['Company Policies', '/api/company-policies'],
    ['Contact',          '/api/contact'],
    ['Admin',            '/api/admin'],
    ['Reviews',          '/api/reviews'],
    ['Subscribers',      '/api/subscribers'],
    ['Expenses',         '/api/expenses'],
    ['Payroll',          '/api/payroll'],
];

app.get('/', (req, res) => {
    const cards = endpoints.map(([name, url]) => `
        <a class="card" href="${url}" target="_blank">
          <div class="card-top"><span class="card-method">GET</span></div>
          <div class="card-name">${name}</div>
          <div class="card-url">localhost:${PORT}${url}</div>
        </a>`).join('');

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Destino Backend — API Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0f0f1a; color: #e2e8f0; min-height: 100vh; }
    .hero { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 60px 40px 40px; border-bottom: 1px solid rgba(255,255,255,0.07); }
    .inner { max-width: 1100px; margin: 0 auto; }
    .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
    .dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
    h1 { font-size: 2.8rem; font-weight: 700; background: linear-gradient(135deg, #fff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px; }
    .hero p { color: #94a3b8; font-size: 1rem; max-width: 520px; line-height: 1.6; }
    .stats { display: flex; gap: 20px; margin-top: 32px; flex-wrap: wrap; }
    .stat { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px 24px; }
    .stat .num { font-size: 1.9rem; font-weight: 700; color: #60a5fa; }
    .stat .lbl { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; }
    .frontend-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #f97316, #fb923c); color: white; text-decoration: none; padding: 13px 26px; border-radius: 10px; font-weight: 600; font-size: 14px; margin-top: 32px; transition: opacity 0.2s; }
    .frontend-btn:hover { opacity: 0.85; }
    .container { max-width: 1100px; margin: 0 auto; padding: 48px 40px; }
    .section-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 14px; margin-bottom: 50px; }
    .card { background: #1e1e30; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px 22px; transition: all 0.2s; text-decoration: none; color: inherit; display: block; }
    .card:hover { background: #25253d; border-color: rgba(96,165,250,0.4); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .card-method { font-size: 11px; font-weight: 700; background: rgba(96,165,250,0.15); color: #60a5fa; border: 1px solid rgba(96,165,250,0.25); padding: 3px 10px; border-radius: 6px; }
    .card-name { font-size: 1rem; font-weight: 600; color: #f1f5f9; margin-bottom: 5px; }
    .card-url { font-size: 12px; color: #60a5fa; font-family: monospace; }
    .info-bar { background: #1e1e30; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 24px 28px; display: flex; gap: 40px; flex-wrap: wrap; }
    .info-item .lbl { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
    .info-item .val { font-size: 13px; font-weight: 600; color: #e2e8f0; font-family: monospace; }
  </style>
</head>
<body>
  <div class="hero">
    <div class="inner">
      <div class="badge"><span class="dot"></span> Server Online &mdash; Port ${PORT}</div>
      <h1>&#127757; Destino Backend</h1>
      <p>Node.js &bull; Express &bull; MongoDB &mdash; All routes are live and connected to the database.</p>
      <div class="stats">
        <div class="stat"><div class="num">18</div><div class="lbl">API Routes</div></div>
        <div class="stat"><div class="num">${PORT}</div><div class="lbl">Port</div></div>
        <div class="stat"><div class="num">${process.version}</div><div class="lbl">Node.js</div></div>
      </div>
      <a href="http://localhost:5174" class="frontend-btn">&#128250; Open Frontend App &rarr;</a>
    </div>
  </div>
  <div class="container">
    <div class="section-title">&#128279; All API Endpoints</div>
    <div class="grid">${cards}</div>
    <div class="info-bar">
      <div class="info-item"><div class="lbl">Database</div><div class="val">mongodb://127.0.0.1:27017/destino</div></div>
      <div class="info-item"><div class="lbl">Environment</div><div class="val">development</div></div>
      <div class="info-item"><div class="lbl">Frontend Dev Server</div><div class="val">http://localhost:5174</div></div>
      <div class="info-item"><div class="lbl">API Root</div><div class="val">http://localhost:${PORT}/api</div></div>
    </div>
  </div>
</body>
</html>`);
});

console.log('Connecting to MongoDB Atlas...');
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of hanging
})
.then(() => {
    console.log('MongoDB connection established');
    app.listen(PORT, () => {
        console.log('');
        console.log('  BACKEND  ready');
        console.log('');
        console.log(`  \u279C  Local:    http://localhost:${PORT}/`);
        console.log(`  \u279C  API Root: http://localhost:${PORT}/api`);
        console.log('');
    });
})
.catch(err => {
    console.error('\n' + ' '.repeat(2) + '\u274C MongoDB connection error:');
    console.error(' '.repeat(4) + err.message);
    if (err.message.includes('IP not whitelisted') || err.name === 'MongooseServerSelectionError') {
        console.error('\n' + ' '.repeat(4) + 'TIP: Check your MongoDB Atlas "Network Access" settings.');
        console.error(' '.repeat(4) + 'Ensure your current IP address is whitelisted.');
    }
    process.exit(1);
});
