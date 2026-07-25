import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import logoImg from '../assets/logos/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Leadership', path: '/', isLeadership: true },
    { name: 'Services', path: '/services' },
    { name: 'Previous Projects', path: '/projects' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (link) => {
    if (link.isLeadership) {
      return location.pathname === '/' && location.hash === '#leadership';
    }
    return location.pathname === link.path && !location.hash;
  };

  const handleNavClick = (link, e) => {
    setIsOpen(false);
    if (link.isLeadership) {
      e.preventDefault();
      navigate({ pathname: '/', hash: '#leadership' });
      if (location.pathname === '/') {
        const element = document.getElementById('leadership');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash === '#leadership') {
      const element = document.getElementById('leadership');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 py-4 ${
        isScrolled
          ? 'bg-[#030712]/90 backdrop-blur-xl border-b border-cyan-500/10 shadow-lg shadow-cyan-500/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logoImg}
                alt="Sensor Grid Logo"
                className="w-10 h-10 object-contain transition-all duration-300 group-hover:scale-110"
              />
              <span className="font-bold text-2xl tracking-tight text-white">
                Sensor Grid
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.isLeadership ? { pathname: '/', hash: '#leadership' } : link.path}
                onClick={(e) => handleNavClick(link, e)}
                className={`text-sm font-medium transition-all duration-300 relative ${
                  isActive(link)
                    ? 'text-cyan-400'
                    : 'text-slate-300 hover:text-cyan-400'
                }`}
              >
                {link.name}
                {isActive(link) && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #00e5ff, #2563eb)' }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-cyan-400 focus:outline-none transition-colors"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#030712]/95 backdrop-blur-xl border-t border-cyan-500/10 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.isLeadership ? { pathname: '/', hash: '#leadership' } : link.path}
                onClick={(e) => handleNavClick(link, e)}
                className={`block px-3 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive(link)
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-slate-300 hover:bg-white/5 hover:text-cyan-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
