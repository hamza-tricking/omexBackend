const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nodejs-backend');
        console.log('Connected to MongoDB');

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: 'gomeriismail@gmail.com' });
        if (existingAdmin) {
            console.log('Admin user already exists:', existingAdmin);
            return;
        }

        // Create admin user
        const adminUser = new User({
            name: 'gomeri',
            email: 'gomeriismail@gmail.com',
            role: 'admin'
        });

        const savedAdmin = await adminUser.save();
        console.log('Admin user created successfully:', savedAdmin);

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createAdminUser();
