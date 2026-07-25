const mongoose = require('mongoose');

const connectDB = async () => {
    const mongodbUri = process.env.MONGODB_URI;

    if (!mongodbUri) {
        console.error('❌ MONGODB_URI environment variable is not defined in .env');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(mongodbUri);
        console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
