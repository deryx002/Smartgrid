const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ─── Security Headers ───
app.use(helmet({
    contentSecurityPolicy: false, // Let Nginx/CDN handle CSP in production
    crossOriginEmbedderPolicy: false
}));

// ─── CORS Configuration ───
const allowedOrigins = [
    process.env.CORS_ORIGIN_PUBLIC,
    process.env.CORS_ORIGIN_ADMIN
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (server-to-server, curl, mobile apps)
        if (!origin) return callback(null, true);

        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Request Logging ───
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ─── Body Parsing ───
app.use(express.json());

// ─── API Routes ───
const requestRoutes = require('./routes/requestRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

app.use('/api/requests', requestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// ─── Health Check ───
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// ─── Serve Frontend for SPA Routes ───
// This keeps direct URLs like /services or /admin/dashboard from returning 404s.
const publicIndexPath = path.join(__dirname, '..', 'frontend', 'index-public.html');
const adminIndexPath = path.join(__dirname, '..', 'frontend', 'index-admin.html');
const publicDistPath = path.join(__dirname, '..', 'frontend', 'dist-public');
const adminDistPath = path.join(__dirname, '..', 'frontend', 'dist-admin');

app.use((req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: 'API route not found' });
    }

    if (req.path.startsWith('/admin')) {
        const adminEntry = path.join(adminDistPath, 'index-admin.html');
        if (fs.existsSync(adminEntry)) {
            return res.sendFile(adminEntry);
        }
        return res.sendFile(adminIndexPath);
    }

    const publicEntry = path.join(publicDistPath, 'index-public.html');
    if (fs.existsSync(publicEntry)) {
        return res.sendFile(publicEntry);
    }

    return res.sendFile(publicIndexPath);
});

// Base route (development only)
if (process.env.NODE_ENV !== 'production') {
    app.get('/', (req, res) => {
        res.send('Senson Grid API is running');
    });
}

// ─── Start Server ───
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`   CORS origins: ${allowedOrigins.join(', ') || 'NONE (all blocked)'}`);
});
