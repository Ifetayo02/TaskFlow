import React from 'react';
import { ArrowRight, LogIn } from 'lucide-react';
import heroImage from '../assets/Images/hero-image.png';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-8 md:pt-12 pb-16 md:pb-24 px-4 text-center relative overflow-hidden">
      {}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[400px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-48 md:w-72 h-48 md:h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-48 md:w-72 h-48 md:h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {}
          <div className="inline-flex items-center px-3 md:px-4 py-1.5 mb-6 md:mb-8 text-[10px] md:text-xs font-bold tracking-wider text-indigo-300 uppercase rounded-full bg-indigo-500/10 border border-indigo-500/20">
            ● Now: Live Kanban Automations
          </div>

          {}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 md:mb-8 leading-[1.1] px-2">
            Organize work.{' '}
            <span className="text-indigo-400">
              Ship faster.
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-base md:text-xl text-slate-400 mb-8 md:mb-12 leading-relaxed px-4">
            The project management platform that keeps high-velocity teams in sync
            without the chaos.
          </p>

          {}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 md:mb-20 px-4">
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl text-base md:text-lg font-bold transition-all flex items-center justify-center gap-2 group shadow-xl shadow-indigo-900/50"
            >
              Get Started Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {}
            <button
              onClick={() => navigate('/signin')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 font-bold transition-all px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
            >
              <LogIn size={18} />
              Log In
            </button>
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-5xl mx-auto overflow-hidden rounded-3xl border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
        >
          {}
          <div
            className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3"
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(15,23,42,0.8)',
            }}
          >
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/60" />
            <div
              className="ml-2 md:ml-3 flex-1 max-w-[120px] md:max-w-xs h-4 md:h-5 rounded-md flex items-center px-2 md:px-3"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span className="text-[8px] md:text-[10px] text-slate-500 truncate">
                taskflow.app/dashboard
              </span>
            </div>
          </div>
          <img
            src={heroImage}
            alt="Dashboard Preview"
            className="w-full h-auto block"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;