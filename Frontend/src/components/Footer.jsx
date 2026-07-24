import React from 'react';
import logo from '../assets/Images/logo.png';

const Footer = () => {
  const handleDemoLink = (e) => {
    e.preventDefault();
  };

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-12">
        {}
        <div className="col-span-2">
          <div className="flex items-center gap-2 font-bold text-xl mb-6 text-white">
            <img src={logo} alt="TaskFlow Logo" width="36" height="36" />
            TaskFlow
          </div>
          <div className="text-slate-500 text-sm max-w-sm leading-relaxed space-y-2">
            <p>
              TaskFlow is the modern platform designed to keep your product engine humming without the usual chaos.       We eliminate the friction between daily task management and complex version 
              control workflows, giving your squad a focused, premium environment to ship 
              better code, faster.
            </p>
          </div>
        </div>

        {}
        {[
          { title: 'Product', links: ['Features', 'Security', 'Status'] },
          { title: 'Company', links: ['About', 'Careers', 'Contact'] },
          { title: 'Support', links: ['Help Center', 'Guides', 'API'] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-bold text-sm mb-6 text-white">{col.title}</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    onClick={handleDemoLink}
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {}
      <div
        className="max-w-7xl mx-auto px-6 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}
      >
        <p className="text-xs text-slate-600">
          © 2026 TaskFlow Inc. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-slate-600">
          <a href="#" onClick={handleDemoLink} className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="#" onClick={handleDemoLink} className="hover:text-slate-400 transition-colors">Terms of Service</a>
          <a href="#" onClick={handleDemoLink} className="hover:text-slate-400 transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;