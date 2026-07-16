import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Feature from '../components/Feature';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div
      className="min-h-screen font-sans overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)',
      }}
    >
      <Navbar />
      <Hero />
      <Feature />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;