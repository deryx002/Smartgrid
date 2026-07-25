const mongoose = require('mongoose');

const previousProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Software', 'IoT', 'Designing']
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    technologies: {
        type: [String],
        required: true,
        default: []
    },
    live_url: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Update updated_at automatically before saving
previousProjectSchema.pre('save', function () {
    this.updated_at = Date.now();
});

module.exports = mongoose.model('PreviousProject', previousProjectSchema);
