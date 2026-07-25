import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiLinkedin, FiGithub, FiMail, FiLock } from 'react-icons/fi';
import logoImg from '../assets/logos/logo.png';

const Footer = () => {
  return (
    <footer
      className="text-slate-300 py-12 mt-0"
      style={{ background: '#030712', borderTop: '1px solid rgba(0,229,255,0.1)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={logoImg}
                alt="Sensor Grid Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-xl text-white">Sensor Grid</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-md">
              Delivering innovative Software, IoT, and Design solutions. 
              We transform ideas into digital reality with modern technologies and premium aesthetics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 transition-colors hover:text-cyan-400"><FiTwitter size={20} /></a>
              <a href="#" className="text-slate-400 transition-colors hover:text-cyan-400"><FiLinkedin size={20} /></a>
              <a href="#" className="text-slate-400 transition-colors hover:text-cyan-400"><FiGithub size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="transition-colors hover:text-cyan-400">Home</Link></li>
              <li><Link to={{ pathname: '/', hash: '#leadership' }} className="transition-colors hover:text-cyan-400">Leadership</Link></li>
              <li><Link to="/services" className="transition-colors hover:text-cyan-400">Services</Link></li>
              <li><Link to="/projects" className="transition-colors hover:text-cyan-400">Projects</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-cyan-400">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><FiMail /> sensorgrid123@gmail.com</li>
              <li>Gobi , TamilNadu , India</li>
              <li>+91 - 8668079413</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-cyan-500/10 mt-12 pt-8 text-sm flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Sensor Grid. All rights reserved.
          </div>
          <div>
            <Link
              to="/admin/login"
              className="transition-colors hover:text-cyan-400 text-slate-600 text-xs flex items-center gap-1.5"
            >
              <FiLock size={12} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
