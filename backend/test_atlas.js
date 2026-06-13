require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const user = await User.findOne({ email: 'ahmed.driver@destino.com' });
    console.log("Atlas User:", user);
    process.exit(0);
});
