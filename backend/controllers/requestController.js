const { validationResult } = require('express-validator');
const ClientRequest = require('../models/ClientRequest');

// Create a new client request
exports.createRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        full_name,
        email,
        contact_number,
        service_category,
        project_type,
        project_title,
        project_description
    } = req.body;

    try {
        const newRequest = await ClientRequest.create({
            full_name,
            email,
            contact_number,
            service_category,
            project_type,
            project_title,
            project_description
        });

        res.status(201).json({
            message: 'Request submitted successfully',
            id: newRequest._id
        });
    } catch (error) {
        console.error('Error saving request:', error);
        res.status(500).json({ message: 'Server error while submitting request' });
    }
};

// Get all client requests
exports.getRequests = async (req, res) => {
    try {
        const requests = await ClientRequest.find().sort({ submitted_at: -1 });
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Server error while fetching requests' });
    }
};

// Delete a client request
exports.deleteRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRequest = await ClientRequest.findByIdAndDelete(id);

        if (!deletedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ message: 'Server error while deleting request' });
    }
};
