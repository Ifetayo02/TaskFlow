import React from 'react';
import { Move, Users, Clock } from 'lucide-react';

const cardStyle = {
  background: 'rgba(30,41,59,0.6)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(12px)',
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div
    className="p-10 rounded-[2rem] hover:-translate-y-1 transition-all duration-300 cursor-default"
    style={cardStyle}
  >
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center mb-8"
      style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}
    >
      <Icon className="text-indigo-400" size={24} />
    </div>
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
  </div>
);

const Feature = () => {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 relative">
      {}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/05 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-20 relative z-10">
        <h2 className="text-4xl font-extrabold text-white mb-4">Engineered for Velocity</h2>
        <p className="text-slate-400 font-medium">Tools designed to remove friction from your workflow.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12 relative z-10">
        <FeatureCard
          icon={Move}
          title="Drag & Drop Boards"
          description="Intuitive task management that works the way you do. Move tickets seamlessly between columns."
        />
        <FeatureCard
          icon={Users}
          title="Real-Time Collaboration"
          description="Keep your team aligned with live updates and instant notifications. See who is working on what."
        />
        <FeatureCard
          icon={Clock}
          title="Deadline Reminders"
          description="Never miss a milestone with automated alerts and calendar sync. Get notified before things turn red."
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 relative z-10">
        {}
        <div className="p-10 rounded-[2rem] flex flex-col justify-between min-h-[300px]" style={cardStyle}>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h3>
            <p className="text-slate-400 max-w-sm mb-8">
              Gain actionable insights into your team's velocity. Track bottlenecks and optimize your sprint capacity with real-time reporting.
            </p>
          </div>
          
          {/* Mini Bar Chart Graphic */}
          <div className="flex items-end gap-3 h-24 mt-4">
            <div className="flex-1 max-w-[3rem] bg-indigo-500/20 rounded-t-lg h-[40%] transition-all hover:bg-indigo-500/40 cursor-pointer"></div>
            <div className="flex-1 max-w-[3rem] bg-indigo-500/40 rounded-t-lg h-[60%] transition-all hover:bg-indigo-500/60 cursor-pointer"></div>
            <div className="flex-1 max-w-[3rem] bg-indigo-500/60 rounded-t-lg h-[45%] transition-all hover:bg-indigo-500/80 cursor-pointer"></div>
            <div className="flex-1 max-w-[3rem] bg-indigo-500/80 rounded-t-lg h-[85%] transition-all hover:bg-indigo-400 cursor-pointer"></div>
            <div className="flex-1 max-w-[3rem] bg-indigo-500 rounded-t-lg h-[100%] transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] cursor-pointer"></div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-8 text-white">
          <div
            className="rounded-[2rem] p-8 flex flex-col justify-center items-center"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
              boxShadow: '0 20px 40px rgba(79,70,229,0.3)',
            }}
          >
            <span className="text-5xl font-black mb-3 tracking-tighter">25%</span>
            <span className="text-indigo-200 text-[10px] font-black tracking-widest uppercase">Faster Delivery</span>
          </div>
          <div
            className="rounded-[2rem] p-8 flex flex-col justify-center items-center"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              boxShadow: '0 20px 40px rgba(99,102,241,0.3)',
            }}
          >
            <span className="text-5xl font-black mb-3 tracking-tighter">10k+</span>
            <span className="text-indigo-200 text-[10px] font-black tracking-widest uppercase">Active Teams</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;