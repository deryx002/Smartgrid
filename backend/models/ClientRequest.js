const mongoose = require('mongoose');

const clientRequestSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    contact_number: {
        type: String,
        required: true,
        trim: true
    },
    service_category: {
        type: String,
        required: true,
        enum: ['Software', 'IoT', 'Designing']
    },
    project_type: {
        type: String,
        required: true,
        trim: true
    },
    project_title: {
        type: String,
        required: true,
        trim: true
    },
    project_description: {
        type: String,
        required: true,
        trim: true
    },
    submitted_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ClientRequest', clientRequestSchema);
