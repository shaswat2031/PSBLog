require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ps-blog';

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const email = 'prasadshaswat9765@gmail.com';
        let user = await User.findOne({ email });
        const hashedPassword = await bcrypt.hash('noonecanbeatme', 12);

        if (user) {
            user.password = hashedPassword;
            user.isActive = true;
            user.role = 'admin';
            await user.save();
            console.log('Updated existing admin user password.');
        } else {
            user = new User({
                name: 'Prasad Shaswat',
                email,
                password: hashedPassword,
                role: 'admin',
                isActive: true
            });
            await user.save();
            console.log('Created new admin user.');
        }
        console.log('Credentials:');
        console.log('Email:', email);
        console.log('Password: noonecanbeatme');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
run();
