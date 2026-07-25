import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FiSend, FiCheckCircle, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Contact = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    contact_number: '',
    service_category: '',
    project_type: '',
    project_title: '',
    project_description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-fill data if navigated from service detail page
  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        service_category: location.state.serviceCategory === 'software' ? 'Software' 
                        : location.state.serviceCategory === 'iot' ? 'IoT' 
                        : location.state.serviceCategory === 'designing' ? 'Designing' 
                        : '',
        project_type: location.state.projectType || '',
        project_title: location.state.projectTitle || ''
      }));
    }
  }, [location.state]);

  const validate = () => {
    let tempErrors = {};
    if (!formData.full_name.trim()) tempErrors.full_name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Valid email is required";
    if (!/^\d+$/.test(formData.contact_number)) tempErrors.contact_number = "Valid contact number is required (digits only)";
    if (!formData.service_category) tempErrors.service_category = "Category is required";
    if (!formData.project_type.trim()) tempErrors.project_type = "Project type is required";
    if (!formData.project_title.trim()) tempErrors.project_title = "Project title is required";
    if (!formData.project_description.trim()) tempErrors.project_description = "Description is required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        await api.post('/requests', formData);
        setIsSuccess(true);
        setIsSubmitting(false);
      } catch (err) {
        console.error("Error submitting form", err);
        alert("Failed to submit request. Please ensure backend is running.");
        setIsSubmitting(false);
      }
    }
  };

  // Input style helper
  const inputClass = (fieldName) =>
    `w-full px-4 py-3.5 rounded-xl transition-all duration-300 text-white placeholder-slate-500 focus:outline-none ${
      errors[fieldName]
        ? 'border border-red-500/50 bg-red-500/10 focus:ring-2 focus:ring-red-500/30'
        : 'border border-cyan-500/15 bg-slate-900/50 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30'
    }`;

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-[#030712]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 rounded-3xl text-center max-w-lg mx-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.7) 100%)',
            border: '1px solid rgba(6,182,212,0.18)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 80px rgba(6,182,212,0.15)',
          }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.3)',
              color: '#34d399',
            }}
          >
            <FiCheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Request Submitted!</h2>
          <p className="text-slate-400 mb-8">
            Thank you for reaching out to Sensor Grid. Our team will review your project details and get back to you shortly.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #6366f1 100%)',
              boxShadow: '0 0 20px rgba(37,99,235,0.3)',
            }}
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#030712] text-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-10 pt-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-cyan-500/20 text-cyan-300 bg-cyan-500/10"
            >
              Get Started
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Client Enquiry Form
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400"
          >
            Provide details about your project to get started.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 lg:col-span-1"
          >
            {[
              { icon: <FiMail size={22} />, label: 'Email', value: 'sensorgrid123@gmail.com' },
              { icon: <FiPhone size={22} />, label: 'Phone', value: '+91 - 8668079413' },
              { icon: <FiMapPin size={22} />, label: 'Address', value: 'Gobi , TamilNadu , India' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl flex items-start gap-4"
                style={{
                  background: 'rgba(15,23,42,0.85)',
                  border: '1px solid rgba(56,189,248,0.18)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(0,229,255,0.1)',
                    color: '#00e5ff',
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-white text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-8 md:p-10 lg:col-span-2"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.4) 100%)',
              border: '1px solid rgba(0,229,255,0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={inputClass('full_name')}
                    placeholder="John Doe"
                  />
                  {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass('email')}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Contact Number <span className="text-red-400">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className={inputClass('contact_number')}
                    placeholder="1234567890"
                  />
                  {errors.contact_number && <p className="text-red-400 text-xs mt-1">{errors.contact_number}</p>}
                </div>

                {/* Service Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Service Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="service_category"
                    value={formData.service_category}
                    onChange={handleChange}
                    className={inputClass('service_category')}
                    style={{ appearance: 'none' }}
                  >
                    <option value="" className="bg-[#0f172a]">Select a Category</option>
                    <option value="Software" className="bg-[#0f172a]">Software</option>
                    <option value="IoT" className="bg-[#0f172a]">IoT</option>
                    <option value="Designing" className="bg-[#0f172a]">Designing</option>
                  </select>
                  {errors.service_category && <p className="text-red-400 text-xs mt-1">{errors.service_category}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project Type <span className="text-red-400">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleChange}
                    className={inputClass('project_type')}
                    placeholder="e.g. Web Development"
                  />
                  {errors.project_type && <p className="text-red-400 text-xs mt-1">{errors.project_type}</p>}
                </div>

                {/* Project Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project Title <span className="text-red-400">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="project_title"
                    value={formData.project_title}
                    onChange={handleChange}
                    className={inputClass('project_title')}
                    placeholder="e.g. Hospital Management System"
                  />
                  {errors.project_title && <p className="text-red-400 text-xs mt-1">{errors.project_title}</p>}
                </div>
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Description <span className="text-red-400">*</span>
                </label>
                <textarea 
                  name="project_description"
                  value={formData.project_description}
                  onChange={handleChange}
                  rows="5"
                  className={`${inputClass('project_description')} resize-none`}
                  placeholder="Please describe your project goals, features, and any specific requirements..."
                ></textarea>
                {errors.project_description && <p className="text-red-400 text-xs mt-1">{errors.project_description}</p>}
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-slate-700 cursor-not-allowed'
                      : ''
                  }`}
                  style={isSubmitting ? {} : {
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #6366f1 100%)',
                    boxShadow: '0 0 30px rgba(37,99,235,0.3)',
                  }}
                >
                  {isSubmitting ? 'Submitting...' : (
                    <>Submit Enquiry <FiSend /></>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
