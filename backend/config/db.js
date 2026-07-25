const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');

const connectDB = async () => {
    const mongodbUri = process.env.MONGODB_URI;

    if (!mongodbUri) {
        console.error('❌ MONGODB_URI environment variable is not defined in .env');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(mongodbUri);
        console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
        
        // Auto-seed admin user on startup
        await seedAdminUser();
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

const seedAdminUser = async () => {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
        console.warn('⚠️  WARNING: ADMIN_PASSWORD environment variable is not set. Admin seeding skipped.');
        return;
    }

    if (password.length < 8) {
        console.warn('⚠️  WARNING: ADMIN_PASSWORD is too short (min 8 chars). Admin seeding skipped.');
        return;
    }

    try {
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const existing = await AdminUser.findOne({ username });

        if (existing) {
            existing.password_hash = passwordHash;
            await existing.save();
            console.log('✅ Auto-seed: Admin user credentials verified and updated.');
        } else {
            await AdminUser.create({
                username,
                password_hash: passwordHash
            });
            console.log('✅ Auto-seed: Admin user created successfully.');
        }
    } catch (err) {
        console.error('❌ Auto-seed failed:', err.message);
    }
};

module.exports = connectDB;
