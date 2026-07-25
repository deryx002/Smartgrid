const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');
const dotenv = require('dotenv');

dotenv.config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MONGODB_URI = process.env.MONGODB_URI;

async function seedAdmin() {
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI environment variable is required.');
        process.exit(1);
    }

    if (!ADMIN_PASSWORD) {
        console.error('❌ ADMIN_PASSWORD environment variable is required.');
        console.error('   Set it in your .env file before running this script.');
        process.exit(1);
    }

    if (ADMIN_PASSWORD.length < 8) {
        console.error('❌ ADMIN_PASSWORD must be at least 8 characters long.');
        process.exit(1);
    }

    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('📡 Connected to MongoDB for seeding...');

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

        // Check if admin already exists
        const existing = await AdminUser.findOne({ username: ADMIN_USERNAME });

        if (existing) {
            existing.password_hash = passwordHash;
            await existing.save();
            console.log('✅ Admin user updated successfully!');
        } else {
            await AdminUser.create({
                username: ADMIN_USERNAME,
                password_hash: passwordHash
            });
            console.log('✅ Admin user created successfully!');
        }

        console.log(`   Username: ${ADMIN_USERNAME}`);
        console.log(`   Password: ${'*'.repeat(ADMIN_PASSWORD.length)}`);
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to seed admin user:', error.message);
        process.exit(1);
    }
}

seedAdmin();
