import React from 'react';
import logo from '../assets/Images/logo.png';

const Footer = () => (
  <footer className="bg-white">
    {/* Dark CTA Box */}


    {/* Sitemap */}
    <div className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-100 grid grid-cols-2 md:grid-cols-5 gap-12">
      <div className="col-span-2">
        <div className="flex items-center gap-2 font-bold text-xl mb-6">
          <img src={logo} alt="TaskFlow Logo"  width="40" height="40"/>
          TaskFlow
        </div>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">Precision engineering for high-velocity teams. The platform that keeps your product engine humming.</p>
      </div>
      {[ 
        { title: 'Product', links: ['Features', 'Security', 'Status'] },
        { title: 'Company', links: ['About', 'Careers', 'Contact'] },
        { title: 'Support', links: ['Help Center', 'Guides', 'API'] }
      ].map((col) => (
        <div key={col.title}>
          <h4 className="font-bold text-sm mb-6">{col.title}</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            {col.links.map(link => <li key={link} className="hover:text-indigo-600 cursor-pointer">{link}</li>)}
          </ul>
        </div>
      ))}
    </div>
  </footer>
);

export default Footer;