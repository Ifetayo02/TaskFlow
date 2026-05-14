import React from 'react';
import { Play } from 'lucide-react';
import heroImage from '../assets/Images/hero-image.png'

const Hero = () => (
  <section className="pt-16 pb-24 px-4 text-center bg-gradient-to-b from-indigo-50/40 via-white to-white">
    <div className="inline-flex items-center px-4 py-1.5 mb-8 text-xs font-bold tracking-wider text-indigo-700 uppercase bg-indigo-100/80 rounded-full border border-indigo-200">
      ● Now: Live Kanban Automations
    </div>
    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1]">
      Organize work. <span className="text-indigo-600">Ship faster.</span>
    </h1>
    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 mb-12 leading-relaxed">
      The project management platform that keeps high-velocity teams in sync without the chaos. 
      Precision engineering for the modern squad.
    </p>
    <div className="flex flex-row sm:col items-center justify-center gap-5 mb-20">
      <button className="bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl shadow-indigo-200 hover:scale-105 transition-transform">
        Get Started Free
      </button>
      <button className="flex items-center gap-2 text-gray-700 font-bold hover:text-indigo-600 group">
        <div className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-indigo-600">
          <Play size={16} className="fill-current" />
        </div>
        Watch Demo
      </button>
    </div>
    
    {/* Kanban Preview */}
    <div className="max-w-5xl mx-auto rounded-[2rem] border-[12px] border-white shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
      <img src={heroImage} alt="Dashboard Preview" className="w-full h-auto" />
    </div>
  </section>
);

export default Hero;