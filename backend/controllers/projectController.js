const PreviousProject = require('../models/PreviousProject');

// Get all projects (public)
exports.getProjects = async (req, res) => {
    try {
        const projects = await PreviousProject.find().sort({ created_at: -1 });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error while fetching projects.' });
    }
};

// Get single project (public)
exports.getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await PreviousProject.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Server error while fetching project.' });
    }
};

// Create project (admin only)
exports.createProject = async (req, res) => {
    const { name, category, description, technologies, image_url, live_url } = req.body;

    if (!name || !category || !description || !technologies) {
        return res.status(400).json({ message: 'Name, category, description, and technologies are required.' });
    }

    try {
        const newProject = await PreviousProject.create({
            name,
            category,
            description,
            technologies: Array.isArray(technologies) ? technologies : [technologies],
            image_url: image_url || null,
            live_url: live_url || null
        });

        res.status(201).json({
            message: 'Project created successfully',
            id: newProject._id
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error while creating project.' });
    }
};

// Update project (admin only)
exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, category, description, technologies, image_url, live_url } = req.body;

    if (!name || !category || !description || !technologies) {
        return res.status(400).json({ message: 'Name, category, description, and technologies are required.' });
    }

    try {
        const updatedProject = await PreviousProject.findByIdAndUpdate(
            id,
            {
                name,
                category,
                description,
                technologies: Array.isArray(technologies) ? technologies : [technologies],
                image_url: image_url || null,
                live_url: live_url || null
            },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Server error while updating project.' });
    }
};

// Delete project (admin only)
exports.deleteProject = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProject = await PreviousProject.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Server error while deleting project.' });
    }
};
