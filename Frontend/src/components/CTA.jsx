import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-20 max-w-7xl mx-auto">
      <motion.div
        whileInView={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden bg-slate-900 border border-slate-800 backdrop-blur-xl"
      >
        {}
        <div className="absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/15 blur-[120px] rounded-full -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10">
          <div
            className="inline-flex items-center px-4 py-1.5 mb-6 text-xs font-bold tracking-wider text-indigo-300 uppercase rounded-full bg-indigo-500/10 border border-indigo-500/20"
          >
            Free to get started
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to hit{' '}
            <span className="text-indigo-400">
              flow state?
            </span>
          </h2>

          <p className="text-slate-400 mb-10 max-w-md mx-auto">
            Join thousands of high-performance teams using TaskFlow to ship more, faster.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-900/50"
            >
              Start Free Trial
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {}
            <button
              onClick={() => navigate('/signin')}
              className="px-8 py-4 rounded-xl font-bold transition-all text-gray-900 hover:bg-gray-100 bg-gray-200"
            >
              Log In
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CTA;