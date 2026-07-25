import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiUser, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ADMIN_ROUTES from '../utils/routes';
import logoImg from '../assets/logos/logo.png';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated, loading } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate(ADMIN_ROUTES.dashboard, { replace: true });
        }
    }, [isAuthenticated, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password.');
            return;
        }

        setIsSubmitting(true);

        try {
            await login(username, password);
            navigate(ADMIN_ROUTES.dashboard, { replace: true });
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please try again.';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#030712]">
                <div
                    className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: 'rgba(0,229,255,0.3)', borderTopColor: 'transparent' }}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#030712]">
            {/* Background effects */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)' }}
            />
            <div
                className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                {/* Login Card */}
                <div
                    className="rounded-3xl p-8 md:p-10"
                    style={{
                        background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.4) 100%)',
                        border: '1px solid rgba(0,229,255,0.15)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 0 60px rgba(0,229,255,0.05)',
                    }}
                >
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <img
                            src={logoImg}
                            alt="Sensor Grid Logo"
                            className="w-16 h-16 object-contain mx-auto mb-4"
                        />
                        <h1 className="text-2xl font-bold text-white mb-1">Admin Access</h1>
                        <p className="text-slate-400 text-sm">Sign in to manage Sensor Grid</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 rounded-xl p-4 mb-6"
                            style={{
                                background: 'rgba(239,68,68,0.08)',
                                border: '1px solid rgba(239,68,68,0.2)',
                            }}
                        >
                            <FiAlertCircle className="text-red-400 shrink-0" size={20} />
                            <p className="text-red-300 text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-cyan-500/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 transition-all"
                                    placeholder="Enter username"
                                    autoComplete="username"
                                    id="admin-username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-cyan-500/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 transition-all"
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                    id="admin-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            id="admin-login-btn"
                            className={`w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                                isSubmitting
                                    ? 'bg-slate-600 cursor-not-allowed'
                                    : ''
                            }`}
                            style={isSubmitting ? {} : {
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #6366f1 100%)',
                                boxShadow: '0 0 25px rgba(37,99,235,0.3)',
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <div
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                    />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <FiLock size={16} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-600 text-xs mt-6">
                    © {new Date().getFullYear()} Sensor Grid. Authorized access only.
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
