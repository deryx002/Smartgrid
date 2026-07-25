import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiImage, FiExternalLink } from 'react-icons/fi';
import api from '../utils/api';

const PreviousProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleViewDetails = (e, liveUrl) => {
    if (!liveUrl || liveUrl.includes('example.com') || liveUrl === '#') {
      e.preventDefault();
      alert('Project details posting soon!');
    }
  };

  const categoryColors = {
    Software: { accent: '#3b82f6', glow: 'rgba(59,130,246,0.3)' },
    IoT: { accent: '#34d399', glow: 'rgba(52,211,153,0.3)' },
    Designing: { accent: '#fb7185', glow: 'rgba(251,113,133,0.3)' },
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16 pt-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{
                background: 'rgba(0,229,255,0.1)',
                border: '1px solid rgba(0,229,255,0.2)',
                color: '#00e5ff',
              }}
            >
              Our Portfolio
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Previous Projects
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            A showcase of our successfully completed digital solutions.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div
              className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'rgba(0,229,255,0.3)', borderTopColor: 'transparent' }}
            />
          </div>
        ) : projects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl p-16 text-center max-w-3xl mx-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.4) 100%)',
              border: '1px solid rgba(0,229,255,0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'rgba(0,229,255,0.08)',
                border: '1px solid rgba(0,229,255,0.15)',
                color: 'rgba(0,229,255,0.5)',
              }}
            >
              <FiImage size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Portfolio Coming Soon</h3>
            <p className="text-slate-400">
              We are currently working to display our best work we have done so far on categories like Software, IoT, and Design.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => {
              const colors = categoryColors[project.category] || categoryColors.Software;
              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group rounded-2xl overflow-hidden transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.4) 100%)',
                    border: '1px solid rgba(0,229,255,0.1)',
                  }}
                >
                  <div className="p-6">
                    <span
                      className="text-xs font-bold uppercase tracking-wider mb-2 block"
                      style={{ color: colors.accent }}
                    >
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(Array.isArray(project.technologies) ? project.technologies : []).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-md"
                          style={{
                            background: 'rgba(0,229,255,0.08)',
                            border: '1px solid rgba(0,229,255,0.15)',
                            color: '#94a3b8',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        onClick={(e) => handleViewDetails(e, project.live_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-semibold text-sm transition-colors"
                        style={{ color: '#00e5ff' }}
                      >
                        View Details <FiExternalLink />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousProjects;
