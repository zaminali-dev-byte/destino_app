const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/destino').then(async () => {
    const user = await User.findOne({ email: 'ahmed.driver@destino.com' });
    console.log("User:", user);
    process.exit(0);
});
