import React from 'react';
import { 
  LayoutGrid, 
  CheckSquare, 
  Users, 
  BarChart2, 
  Settings, 
  Bell, 
  HelpCircle,
  ChevronDown,
  User,
  X
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-6 py-4 cursor-pointer transition-colors ${
    active ? 'text-white bg-indigo-600 rounded-lg mx-2' : 'text-slate-400 hover:text-white'
  }`}>
    <Icon size={20} />
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

const MemberRow = ({ name, email, role, avatar, isPending = false, isUser = false }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
    <div className="flex items-center gap-4">
      {avatar ? (
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <User size={20} />
        </div>
      )}
      <div>
        <p className="text-sm font-bold text-slate-900">{name || email}</p>
        {name && <p className="text-xs text-slate-400 font-medium">{email}</p>}
      </div>
    </div>
    <div className="flex items-center gap-6">
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        role === 'Admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'
      }`}>
        {role}
      </span>
      {!isUser && (
        <button className="text-xs font-bold text-slate-300 hover:text-red-500 transition-colors">
          {isPending ? 'Revoke' : 'Remove'}
        </button>
      )}
    </div>
  </div>
);

const InviteMembers = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0F172A] text-white flex flex-col py-8">
          <div className="px-8 mb-12 flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </div>

          <nav className="flex-1 space-y-1">
            <SidebarItem icon={LayoutGrid} label="Dashboard" />
            <SidebarItem icon={CheckSquare} label="Tasks" />
            <SidebarItem icon={Users} label="Members" active />
            <SidebarItem icon={BarChart2} label="Analytics" />
            <SidebarItem icon={Settings} label="Settings" />
          </nav>

          <div className="px-6 mt-auto">
            <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
                className="w-10 h-10 rounded-lg object-cover" 
                alt="Alex Chen" 
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">Alex Chen</p>
                <p className="text-[10px] text-slate-500 truncate">Workspace Owner</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200 px-10 flex items-center justify-between">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Invite Members</h1>
            <div className="flex items-center gap-5 text-slate-400">
              <Bell size={20} className="cursor-pointer hover:text-slate-600" />
              <HelpCircle size={20} className="cursor-pointer hover:text-slate-600" />
            </div>
          </header>

          {/* Card Container */}
          <div className="p-10 flex-1 overflow-y-auto">
            <div className="max-w-4xl bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.02)] p-12 border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-8">Invite people to TaskFlow</h2>
              
              {/* Invite Form */}
              <div className="flex flex-col md:flex-row gap-4 mb-16">
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  className="flex-1 px-5 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                />
                <div className="relative group min-w-[140px]">
                  <select className="w-full appearance-none px-5 py-3.5 bg-white border border-slate-200 rounded-xl outline-none text-sm font-semibold text-slate-700 cursor-pointer pr-10">
                    <option>Member</option>
                    <option>Viewer</option>
                    <option>Admin</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all">
                  Send Invite
                </button>
              </div>

              {/* Pending Invites */}
              <section className="mb-12">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Pending Invites</h3>
                <div className="space-y-1">
                  <MemberRow email="sarah.j@design.co" role="Member" isPending />
                  <MemberRow email="marcus.r@growth.io" role="Viewer" isPending />
                </div>
              </section>

              {/* Current Members */}
              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Current Members</h3>
                <div className="space-y-1">
                  <MemberRow 
                    name="Alex Chen (You)" 
                    email="alex@taskflow.io" 
                    role="Admin" 
                    avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
                    isUser 
                  />
                  <MemberRow 
                    name="Jordan Smith" 
                    email="j.smith@taskflow.io" 
                    role="Member" 
                    avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                  />
                  <MemberRow 
                    name="Elena Rodriguez" 
                    email="elena.r@taskflow.io" 
                    role="Admin" 
                    avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" 
                  />
                  <MemberRow 
                    name="Taylor Brooks" 
                    email="t.brooks@taskflow.io" 
                    role="Member" 
                    avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
                  />
                </div>
              </section>
            </div>
          </div>

          {/* Page Footer */}
          <footer className="bg-white border-t border-slate-100 p-12 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <h4 className="text-xl font-bold mb-4">TaskFlow</h4>
              <p className="text-sm text-slate-400 max-w-xs">
                © 2026 TaskFlow Inc. Precision engineering for high-velocity teams.
              </p>
            </div>
            <div>
              <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6">Product</h5>
              <ul className="space-y-4 text-sm text-slate-600 font-medium">
                <li className="hover:text-indigo-600 cursor-pointer">Features</li>
                <li className="hover:text-indigo-600 cursor-pointer">Security</li>
                <li className="hover:text-indigo-600 cursor-pointer">Status</li>
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6">Company</h5>
              <ul className="space-y-4 text-sm text-slate-600 font-medium">
                <li className="hover:text-indigo-600 cursor-pointer">About</li>
                <li className="hover:text-indigo-600 cursor-pointer">Careers</li>
                <li className="hover:text-indigo-600 cursor-pointer">Contact</li>
              </ul>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default InviteMembers;