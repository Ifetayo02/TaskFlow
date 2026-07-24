import React, { useState, useEffect } from 'react';
import logo from '../assets/Images/logo.png';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all"
      style={{
        background: scrolled
          ? 'rgba(15,23,42,0.95)'
          : 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid transparent',
      }}
    >
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 max-w-7xl mx-auto w-full">
        {}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <img src={logo} alt="TaskFlow Logo" width="36" height="36" />
          <span className="hidden sm:inline">TaskFlow</span>
        </div>

        {}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => navigate('/signin')}
            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
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

        {}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => navigate('/signin')}
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;