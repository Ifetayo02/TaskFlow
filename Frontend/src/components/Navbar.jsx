import React, { useState, useEffect } from 'react';
import logo from '../assets/Images/logo.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 px-6 pt-4 pb-2">
      <nav
        className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full rounded-2xl transition-all"
        style={{
          background: scrolled
            ? 'rgba(15,23,42,0.85)'
            : 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <img src={logo} alt="TaskFlow Logo" width="36" height="36" />
          TaskFlow
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">Integrations</a>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/signin')}
            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900/50"
          >
            Get Started
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;