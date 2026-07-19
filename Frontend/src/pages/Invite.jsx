import React, { useState, useEffect } from 'react';
import {
  LayoutGrid, CheckSquare, Users, BarChart2,
  Settings, Bell, HelpCircle, ChevronDown,
  User, Loader2, Mail, ArrowLeft,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const ROLES = ['admin', 'member', 'viewer'];

const roleBadge = (role) => {
  const styles = {
    admin: 'bg-indigo-500/20 text-indigo-400',
    member: 'bg-slate-700/60 text-slate-400',
    viewer: 'bg-slate-700/40 text-slate-500',
  };
  return styles[role] || styles.member;
};

const gridBg = {
  backgroundColor: '#0f172a',
  backgroundImage: `linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)`,
  backgroundSize: '32px 32px',
};

const cardStyle = {
  background: 'rgba(30,41,59,0.8)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(8px)',
};

const MemberRow = ({ member, isCurrentUser, onRemove }) => {
  const name = member.user?.name;
  const email = member.user?.email;
  const role = member.role;
  const initial = name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate">
            {name}
            {isCurrentUser && (
              <span className="ml-2 text-[10px] font-bold text-slate-500">(You)</span>
            )}
          </p>
          <p className="text-xs text-slate-500 truncate">{email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <span className={`text-[10px] font-bold px-2 md:px-3 py-1 rounded-full uppercase tracking-wider ${roleBadge(role)}`}>
          {role}
        </span>
        {!isCurrentUser && (
          <button
            onClick={() => onRemove(member.user._id)}
            className="text-xs font-bold text-slate-600 hover:text-red-400 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

const InviteMembers = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchWorkspace();
    fetchMembers();
  }, [workspaceId]);

  const fetchWorkspace = async () => {
    try {
      const res = await axiosInstance.get('/workspaces');
      const ws = res.data.find((w) => w._id === workspaceId);
      if (ws) setWorkspaceName(ws.name);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMembers = async () => {
    try {
      setPageLoading(true);
      const res = await axiosInstance.get(`/workspaces/${workspaceId}/members`);
      setMembers(res.data);
    } catch (err) {
      setErrorMsg('Failed to load members.');
    } finally {
      setPageLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (!email.trim()) return setErrorMsg('Please enter an email address.');
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `/workspaces/${workspaceId}/invite`,
        { email, role }
      );
      setSuccessMsg(res.data.message);
      setEmail('');
      fetchMembers();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send invite.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await axiosInstance.delete(`/workspaces/${workspaceId}/members/${userId}`);
      setMembers((prev) => prev.filter((m) => m.user._id !== userId));
      setSuccessMsg('Member removed.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to remove member.');
    }
  };

  return (
    <div className="min-h-screen flex font-sans" style={gridBg}>

      {/* Sidebar — icon only on mobile, full on desktop */}
      <div className="hidden md:block">
        {/* import and use your Sidebar component here */}
      </div>

      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header
          className="h-16 border-b flex items-center px-4 md:px-8 gap-4 flex-shrink-0"
          style={{
            background: 'rgba(15,23,42,0.9)',
            backdropFilter: 'blur(12px)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-base md:text-lg font-bold text-white">
              Invite Members
            </h1>
            {workspaceName && (
              <p className="text-xs text-slate-500 truncate">
                {workspaceName}
              </p>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-2xl w-full mx-auto">

            {/* Invite Form Card */}
            <div className="rounded-2xl p-5 md:p-8 mb-6" style={cardStyle}>
              <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                <Users size={18} className="text-indigo-400" />
                Invite people to {workspaceName || 'this workspace'}
              </h2>

              {successMsg && (
                <div
                  className="mb-4 px-4 py-3 rounded-xl text-sm text-emerald-300 font-medium"
                  style={{
                    background: 'rgba(16,185,129,0.15)',
                    border: '1px solid rgba(16,185,129,0.3)',
                  }}
                >
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div
                  className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300 font-medium"
                  style={{
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.3)',
                  }}
                >
                  {errorMsg}
                </div>
              )}

              {/* Form — stacks on mobile, row on desktop */}
              <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-3">
                {/* Email */}
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all placeholder:text-slate-600"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                </div>

                {/* Role */}
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full md:w-auto px-4 py-3 pr-8 rounded-xl text-slate-300 text-sm outline-none appearance-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r} className="bg-slate-900">
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>

                {/* Send button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all flex-shrink-0"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Users size={16} />
                  )}
                  {loading ? 'Sending...' : 'Invite'}
                </button>
              </form>
            </div>

            {/* Members List */}
            <div className="rounded-2xl p-5 md:p-8" style={cardStyle}>
              <h2 className="text-base font-bold text-white mb-5">
                Current Members
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({members.length})
                </span>
              </h2>

              {pageLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-slate-500" size={24} />
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-12">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(99,102,241,0.1)' }}
                  >
                    <Users size={20} className="text-indigo-400" />
                  </div>
                  <p className="text-slate-500 text-sm">
                    No members yet. Invite someone above.
                  </p>
                </div>
              ) : (
                <div>
                  {members.map((member) => (
                    <MemberRow
                      key={member.user._id}
                      member={member}
                      isCurrentUser={member.user._id === user?._id}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMembers;