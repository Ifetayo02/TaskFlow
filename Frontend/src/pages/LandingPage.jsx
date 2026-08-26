import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Feature from '../components/Feature';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen font-sans overflow-x-hidden bg-slate-950 text-slate-50">
      <Navbar />
      <Hero />
      <Feature />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;