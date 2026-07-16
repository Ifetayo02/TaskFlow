import React, { useRef } from 'react';
import { Play, ArrowRight, Compass } from 'lucide-react';
import heroImage from '../assets/Images/hero-image.png';
import Feature from '../components/Feature'; // Your imported component
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  
  // 1. Create a reference to target the feature section
  const featureSectionRef = useRef(null);

  // 2. Create a function to trigger the smooth scroll
  const scrollToFeatures = () => {
    featureSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="pt-12 pb-24 px-4 text-center relative">
        {/* Background glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center px-4 py-1.5 mb-8 text-xs font-bold tracking-wider text-indigo-300 uppercase rounded-full"
            style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
            }}
          >
            ● Now: Live Kanban Automations
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1]">
            Organize work.{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #818cf8, #6366f1, #a78bfa)',
              }}
            >
              Ship faster.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
            The project management platform that keeps high-velocity teams in sync
            without the chaos. Precision engineering for the modern squad.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-row items-center justify-center gap-5 mb-20">
            <button
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all flex items-center gap-2 group shadow-xl shadow-indigo-900/50"
              onClick={() => navigate('/signup')}
            >
              Get Started Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* 3. Attach the scroll function to the onClick */}
            <button 
              onClick={scrollToFeatures}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-slate-300 font-bold hover:text-white group transition-colors"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}
              >
                <Compass size={16} className="text-current" />
              </div>
              Explore Features
            </button>
          </div>

          {/* Hero image */}
          <div
            className="max-w-5xl mx-auto overflow-hidden"
            style={{
              borderRadius: '1.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
              background: 'rgba(30,41,59,0.5)',
            }}
          >
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(15,23,42,0.8)' }}
            >
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div
                className="ml-3 flex-1 max-w-xs h-5 rounded-md flex items-center px-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-[10px] text-slate-500">taskflow.app/dashboard</span>
              </div>
            </div>
            <img src={heroImage} alt="Dashboard Preview" className="w-full h-auto block" />
          </div>
        </div>
      </section>

      {/* 4. Wrap your Feature component in a div and attach the ref here */}
      <div ref={featureSectionRef}>
        <Feature />
      </div>
    </>
  );
};

export default Hero;