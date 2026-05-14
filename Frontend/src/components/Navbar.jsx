import React from 'react';
import logo from '../assets/Images/logo.png';
import { useNavigate } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
        <img src={logo} alt="TaskFlow Logo" width="40" height="40" />

      TaskFlow
    </div>
    <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-500">
      <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
      <a href="#" className="hover:text-indigo-600 transition-colors">Solutions</a>
      <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
      <a href="#" className="hover:text-indigo-600 transition-colors">Integrations</a>
    </div>
    <div className="flex items-center gap-5">
      <button className="text-sm font-semibold text-gray-700 hover:text-black" onClick={() => navigate('/signin')}>
        Log In
      </button>
      <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all" onClick={() => navigate('/signup')}  >
        Get Started
      </button>
    </div>
  </nav>
);
}
export default Navbar;