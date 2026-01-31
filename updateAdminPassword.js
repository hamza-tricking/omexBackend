const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function updateAdminPassword() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nodejs-backend');
        console.log('Connected to MongoDB');

        // Find admin user
        const adminUser = await User.findOne({ email: 'gomeriismail@gmail.com' });
        if (!adminUser) {
            console.log('Admin user not found');
            return;
        }

        // Hash password manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Update password directly in database
        await User.updateOne(
            { email: 'gomeriismail@gmail.com' },
            { password: hashedPassword }
        );

        console.log('Admin password updated successfully');
        console.log('Email: gomeriismail@gmail.com');
        console.log('Password: admin123');

    } catch (error) {
        console.error('Error updating admin password:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

updateAdminPassword();
