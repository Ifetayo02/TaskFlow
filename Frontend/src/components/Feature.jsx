import React from 'react';
import { Move, Users, Clock } from 'lucide-react';

// Use simple SVG components for brands to avoid library export errors
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const SlackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="3" height="8" x="13" y="2" rx="1.5"/><path d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5"/><rect width="3" height="8" x="8" y="14" rx="1.5"/><path d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5"/><rect width="8" height="3" x="14" y="13" rx="1.5"/><path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5"/><rect width="8" height="3" x="2" y="8" rx="1.5"/><path d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5"/></svg>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-10 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300">
    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-8">
      <Icon className="text-indigo-600" size={24} />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
  </div>
);

const Feature = () => {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-extrabold mb-4">Engineered for Velocity</h2>
        <p className="text-gray-500 font-medium">Tools designed to remove friction from your workflow.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
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

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 border border-gray-100 rounded-[2rem] flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-2xl font-bold mb-4">Integrated Ecosystem</h3>
            <p className="text-gray-500 max-w-sm mb-8">Connect your favorite tools like Github and Slack in one click.</p>
          </div>
          <div className="flex gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl"><GithubIcon /></div>
            <div className="p-4 bg-slate-50 rounded-2xl"><SlackIcon /></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 text-white">
          <div className="bg-indigo-600 rounded-[2rem] p-8 flex flex-col justify-center items-center">
            <span className="text-5xl font-black mb-3 tracking-tighter">25%</span>
            <span className="text-indigo-100 text-[10px] font-black tracking-widest uppercase">Faster Delivery</span>
          </div>
          <div className="bg-indigo-500 rounded-[2rem] p-8 flex flex-col justify-center items-center">
            <span className="text-5xl font-black mb-3 tracking-tighter">10k+</span>
            <span className="text-indigo-100 text-[10px] font-black tracking-widest uppercase">Active Teams</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;