import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiFilter, FiTrash2, FiDownload, FiLogOut,
    FiPlus, FiEdit2, FiX, FiEye, FiInbox, FiFolder,
    FiExternalLink
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ADMIN_ROUTES from '../utils/routes';
import logoImg from '../assets/logos/logo.png';

const AdminDashboard = () => {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();

    // Tab state
    const [activeTab, setActiveTab] = useState('requests');

    // ─── Request State ───
    const [requests, setRequests] = useState([]);
    const [requestsLoading, setRequestsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [selectedRequest, setSelectedRequest] = useState(null);

    // ─── Project State ───
    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectForm, setProjectForm] = useState({
        name: '',
        category: 'Software',
        description: '',
        technologies: '',
        image_url: '',
        live_url: ''
    });

    // ─── Fetch Data ───
    useEffect(() => {
        fetchRequests();
        fetchProjects();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/requests');
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setRequestsLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setProjectsLoading(false);
        }
    };

    // ─── Request Actions ───
    const handleDeleteRequest = async (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await api.delete(`/requests/${id}`);
                setRequests(requests.filter(req => req._id !== id));
                if (selectedRequest?._id === id) setSelectedRequest(null);
            } catch (error) {
                console.error('Error deleting request:', error);
                alert('Failed to delete request.');
            }
        }
    };

    const handleExport = () => {
        const headers = ['Name', 'Email', 'Contact Number', 'Service Category', 'Project Type', 'Project Title', 'Project Description', 'Submission Date'];

        const csvContent = [
            headers.join(','),
            ...filteredRequests.map(req => [
                `"${req.full_name}"`,
                `"${req.email}"`,
                `"${req.contact_number}"`,
                `"${req.service_category}"`,
                `"${req.project_type}"`,
                `"${req.project_title}"`,
                `"${(req.project_description || '').replace(/"/g, '""')}"`,
                `"${new Date(req.submitted_at).toLocaleDateString()}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'senson_grid_requests.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ─── Project Actions ───
    const openProjectModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setProjectForm({
                name: project.name,
                category: project.category,
                description: project.description,
                technologies: Array.isArray(project.technologies)
                    ? project.technologies.join(', ')
                    : project.technologies,
                image_url: project.image_url || '',
                live_url: project.live_url || ''
            });
        } else {
            setEditingProject(null);
            setProjectForm({
                name: '',
                category: 'Software',
                description: '',
                technologies: '',
                image_url: '',
                live_url: ''
            });
        }
        setShowProjectModal(true);
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...projectForm,
            technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
        };

        try {
            if (editingProject) {
                await api.put(`/projects/${editingProject._id}`, payload);
            } else {
                await api.post('/projects', payload);
            }
            setShowProjectModal(false);
            fetchProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project.');
        }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/projects/${id}`);
                setProjects(projects.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project.');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate(ADMIN_ROUTES.login, { replace: true });
    };

    // ─── Filters ───
    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            req.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.contact_number.includes(searchTerm) ||
            req.project_title.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterCategory === 'All' || req.service_category === filterCategory;

        return matchesSearch && matchesFilter;
    });

    // ─── Category Badge Colors ───
    const categoryColors = {
        Software: 'bg-blue-500/15 text-blue-400',
        IoT: 'bg-emerald-500/15 text-emerald-400',
        Designing: 'bg-orange-500/15 text-orange-400'
    };

    return (
        <div className="min-h-screen bg-[#030712]">
            {/* ═══ Header ═══ */}
            <header className="bg-[#030712]/90 backdrop-blur-xl border-b border-cyan-500/10 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={logoImg}
                                alt="Sensor Grid Logo"
                                className="w-10 h-10 object-contain"
                            />
                            <div>
                                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                                <p className="text-xs text-slate-400">Welcome, {admin?.username || 'Admin'}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            id="admin-logout-btn"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium"
                        >
                            <FiLogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* ═══ Tab Navigation ═══ */}
            <div className="border-b border-cyan-500/10" style={{ background: 'rgba(0,229,255,0.02)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'requests'
                                    ? 'border-cyan-400 text-cyan-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
                            }`}
                        >
                            <FiInbox size={16} />
                            Project Requests
                            {requests.length > 0 && (
                                <span className="ml-1 px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-semibold">
                                    {requests.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'projects'
                                    ? 'border-cyan-400 text-cyan-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
                            }`}
                        >
                            <FiFolder size={16} />
                            Previous Projects
                            {projects.length > 0 && (
                                <span className="ml-1 px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-semibold">
                                    {projects.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══ Content ═══ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ───────── PROJECT REQUESTS TAB ───────── */}
                {activeTab === 'requests' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Controls */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                            <div className="flex flex-col md:flex-row gap-3 flex-grow">
                                <div className="flex-grow relative">
                                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, contact, or title..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        id="search-requests"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-cyan-500/15 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 transition-all"
                                    />
                                </div>
                                <div className="md:w-52 relative">
                                    <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        id="filter-category"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-cyan-500/15 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 appearance-none transition-all"
                                    >
                                        <option value="All" className="bg-[#0f172a]">All Categories</option>
                                        <option value="Software" className="bg-[#0f172a]">Software</option>
                                        <option value="IoT" className="bg-[#0f172a]">IoT</option>
                                        <option value="Designing" className="bg-[#0f172a]">Designing</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleExport}
                                id="export-csv-btn"
                                className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all shrink-0 text-white"
                                style={{ background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', boxShadow: '0 0 15px rgba(14,165,233,0.3)' }}
                            >
                                <FiDownload size={16} /> Export CSV
                            </button>
                        </div>

                        {/* Requests Table */}
                        <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(15,23,42,0.4))', border: '1px solid rgba(0,229,255,0.1)' }}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-cyan-500/10 text-slate-400 text-xs uppercase tracking-wider" style={{ background: 'rgba(0,229,255,0.03)' }}>
                                            <th className="p-4 font-semibold">Name</th>
                                            <th className="p-4 font-semibold">Contact Details</th>
                                            <th className="p-4 font-semibold">Project Info</th>
                                            <th className="p-4 font-semibold text-center">Date</th>
                                            <th className="p-4 font-semibold text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-cyan-500/5">
                                        {requestsLoading ? (
                                            <tr>
                                                <td colSpan="5" className="p-12 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="text-slate-500 text-sm">Loading requests...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredRequests.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-12 text-center">
                                                    <FiInbox className="mx-auto mb-3 text-slate-300" size={40} />
                                                    <p className="text-slate-500">No requests found.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredRequests.map((req) => (
                                                <motion.tr
                                                    key={req._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="hover:bg-white/5 transition-colors"
                                                >
                                                    <td className="p-4 align-top">
                                                        <div className="font-semibold text-white">{req.full_name}</div>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <div className="text-sm text-slate-300">{req.email}</div>
                                                        <div className="text-xs text-slate-500 mt-1">{req.contact_number}</div>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold mb-2 ${categoryColors[req.service_category] || 'bg-slate-700 text-slate-300'}`}>
                                                            {req.service_category} — {req.project_type}
                                                        </span>
                                                        <div className="font-semibold text-white text-sm mb-1">{req.project_title}</div>
                                                        <div className="text-xs text-slate-500 line-clamp-2 max-w-xs" title={req.project_description}>
                                                            {req.project_description}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-top text-center">
                                                        <div className="text-sm text-slate-400">
                                                            {new Date(req.submitted_at).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-top text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={() => setSelectedRequest(req)}
                                                                className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                                                title="View Details"
                                                            >
                                                                <FiEye size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteRequest(req._id)}
                                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                                title="Delete Request"
                                                            >
                                                                <FiTrash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ───────── PREVIOUS PROJECTS TAB ───────── */}
                {activeTab === 'projects' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-white">Portfolio Projects</h2>
                                <p className="text-sm text-slate-400">Manage projects displayed on the public website</p>
                            </div>
                            <button
                                onClick={() => openProjectModal()}
                                id="add-project-btn"
                                className="flex items-center gap-2 px-5 py-3 text-white rounded-xl font-medium transition-all"
                                style={{ background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', boxShadow: '0 0 15px rgba(14,165,233,0.3)' }}
                            >
                                <FiPlus size={16} /> Add Project
                            </button>
                        </div>

                        {/* Projects Grid */}
                        {projectsLoading ? (
                            <div className="flex justify-center py-16">
                                <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(0,229,255,0.3)', borderTopColor: 'transparent' }}></div>
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="rounded-2xl p-16 text-center" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(15,23,42,0.4))', border: '1px solid rgba(0,229,255,0.1)' }}>
                                <FiFolder className="mx-auto mb-4" size={48} style={{ color: 'rgba(0,229,255,0.3)' }} />
                                <h3 className="text-lg font-bold text-white mb-2">No projects yet</h3>
                                <p className="text-slate-400 text-sm mb-6">Add your first project to showcase on the public website.</p>
                                <button
                                    onClick={() => openProjectModal()}
                                    className="px-6 py-3 text-white rounded-xl font-medium transition-all"
                                    style={{ background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', boxShadow: '0 0 15px rgba(14,165,233,0.3)' }}
                                >
                                    <FiPlus className="inline mr-2" size={16} /> Add Project
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <motion.div
                                        key={project._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
                                        style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(15,23,42,0.4))', border: '1px solid rgba(0,229,255,0.1)' }}
                                    >
                                        {/* Content */}
                                        <div className="p-5">
                                            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold mb-3 ${categoryColors[project.category] || 'bg-slate-700 text-slate-300'}`}>
                                                {project.category}
                                            </span>
                                            <h3 className="text-lg font-bold text-white mb-2">{project.name}</h3>
                                            <p className="text-slate-400 text-sm mb-3 line-clamp-2">{project.description}</p>

                                            {/* Technologies */}
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {(Array.isArray(project.technologies)
                                                    ? project.technologies
                                                    : []
                                                ).slice(0, 4).map((tech, i) => (
                                                    <span key={i} className="px-2 py-0.5 text-xs rounded-md" style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)', color: '#94a3b8' }}>
                                                        {tech}
                                                    </span>
                                                ))}
                                                {Array.isArray(project.technologies) && project.technologies.length > 4 && (
                                                    <span className="px-2 py-0.5 text-xs rounded-md" style={{ background: 'rgba(0,229,255,0.08)', color: '#64748b' }}>
                                                        +{project.technologies.length - 4}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid rgba(0,229,255,0.08)' }}>
                                                <button
                                                    onClick={() => openProjectModal(project)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-cyan-400 hover:bg-cyan-500/10 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    <FiEdit2 size={14} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProject(project._id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    <FiTrash2 size={14} /> Delete
                                                </button>
                                                {project.live_url && (
                                                    <a
                                                        href={project.live_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:bg-white/5 rounded-lg text-sm font-medium transition-colors ml-auto"
                                                    >
                                                        <FiExternalLink size={14} /> View
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* ═══ Request Detail Modal ═══ */}
            <AnimatePresence>
                {selectedRequest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedRequest(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.85))', border: '1px solid rgba(0,229,255,0.15)', boxShadow: '0 0 60px rgba(0,229,255,0.1)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 flex items-center justify-between sticky top-0 rounded-t-2xl" style={{ borderBottom: '1px solid rgba(0,229,255,0.1)', background: 'rgba(15,23,42,0.95)' }}>
                                <h3 className="text-lg font-bold text-white">Request Details</h3>
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</p>
                                        <p className="text-white font-medium">{selectedRequest.full_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                                        <p className="text-slate-300">{selectedRequest.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Contact Number</p>
                                        <p className="text-slate-300">{selectedRequest.contact_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Service Category</p>
                                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${categoryColors[selectedRequest.service_category] || 'bg-slate-700 text-slate-300'}`}>
                                            {selectedRequest.service_category}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Project Type</p>
                                        <p className="text-slate-300">{selectedRequest.project_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Submitted On</p>
                                        <p className="text-slate-300">
                                            {new Date(selectedRequest.submitted_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Project Title</p>
                                    <p className="text-white font-semibold text-lg">{selectedRequest.project_title}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Project Description</p>
                                    <p className="text-slate-300 text-sm leading-relaxed p-4 rounded-xl" style={{ background: 'rgba(0,229,255,0.03)', border: '1px solid rgba(0,229,255,0.08)' }}>
                                        {selectedRequest.project_description}
                                    </p>
                                </div>
                            </div>
                            <div className="p-6 flex justify-end gap-3" style={{ borderTop: '1px solid rgba(0,229,255,0.1)' }}>
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="px-5 py-2.5 rounded-xl text-slate-400 font-medium hover:bg-white/5 transition-colors" style={{ border: '1px solid rgba(0,229,255,0.15)' }}
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        handleDeleteRequest(selectedRequest._id);
                                    }}
                                    className="px-5 py-2.5 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2" style={{ border: '1px solid rgba(239,68,68,0.3)' }}
                                >
                                    <FiTrash2 size={14} /> Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══ Project Add/Edit Modal ═══ */}
            <AnimatePresence>
                {showProjectModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowProjectModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
                            style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.85))', border: '1px solid rgba(0,229,255,0.15)', boxShadow: '0 0 60px rgba(0,229,255,0.1)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 flex items-center justify-between sticky top-0 rounded-t-2xl" style={{ borderBottom: '1px solid rgba(0,229,255,0.1)', background: 'rgba(15,23,42,0.95)' }}>
                                <h3 className="text-lg font-bold text-white">
                                    {editingProject ? 'Edit Project' : 'Add New Project'}
                                </h3>
                                <button
                                    onClick={() => setShowProjectModal(false)}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                            <form onSubmit={handleProjectSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Project Name *</label>
                                    <input
                                        type="text"
                                        value={projectForm.name}
                                        onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-cyan-500/15 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 transition-all"
                                        placeholder="e.g. Hospital Management System"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Category *</label>
                                        <select
                                            value={projectForm.category}
                                            onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-cyan-500/15 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 appearance-none transition-all"
                                            required
                                        >
                                            <option value="Software" className="bg-[#0f172a]">Software</option>
                                            <option value="IoT" className="bg-[#0f172a]">IoT</option>
                                            <option value="Designing" className="bg-[#0f172a]">Designing</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Live URL</label>
                                        <input
                                            type="url"
                                            value={projectForm.live_url}
                                            onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-cyan-500/15 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Description *</label>
                                    <textarea
                                        value={projectForm.description}
                                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-xl border border-cyan-500/15 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 resize-none transition-all"
                                        placeholder="Brief description of the project..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Technologies * <span className="text-slate-500 font-normal">(comma-separated)</span></label>
                                    <input
                                        type="text"
                                        value={projectForm.technologies}
                                        onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-cyan-500/15 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 transition-all"
                                        placeholder="React, Node.js, MySQL, etc."
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowProjectModal(false)}
                                        className="flex-1 px-5 py-3 rounded-xl text-slate-400 font-medium hover:bg-white/5 transition-colors" style={{ border: '1px solid rgba(0,229,255,0.15)' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-5 py-3 rounded-xl text-white font-medium transition-all"
                                        style={{ background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', boxShadow: '0 0 15px rgba(14,165,233,0.3)' }}
                                    >
                                        {editingProject ? 'Save Changes' : 'Add Project'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
