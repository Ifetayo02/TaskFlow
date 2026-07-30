import React, { useState, useEffect } from 'react';
import {
  Users, Loader2, Mail, ArrowLeft,
  ChevronDown, Edit2, Check, X, Shield,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';

const ROLES = ['admin', 'member', 'viewer'];

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

const roleBadgeStyle = (role) => {
  if (role === 'admin') return 'bg-indigo-500/20 text-indigo-400';
  if (role === 'viewer') return 'bg-slate-700/40 text-slate-500';
  return 'bg-slate-700/60 text-slate-400';
};

const InviteMembers = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [workspace, setWorkspace] = useState(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameLoading, setNameLoading] = useState(false);

  const isOwner = workspace?.owner === user?._id ||
    workspace?.owner?.toString() === user?._id?.toString();

  const currentUserMember = members.find(
    (m) => m.user._id === user?._id || m.user._id?.toString() === user?._id?.toString()
  );
  const isAdmin = isOwner || currentUserMember?.role === 'admin';

  useEffect(() => {
    fetchWorkspace();
    fetchMembers();
  }, [workspaceId]);

  const fetchWorkspace = async () => {
    try {
      const res = await axiosInstance.get('/workspaces');
      const ws = res.data.find((w) => w._id === workspaceId);
      if (ws) {
        setWorkspace(ws);
        setNewName(ws.name);
      }
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
    setSuccessMsg(''); setErrorMsg('');
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

  const handleRemove = async (userId, memberRole) => {
    if (memberRole === 'admin' && !isOwner) {
      return setErrorMsg('Only the workspace owner can remove an admin.');
    }
    if (!window.confirm('Remove this member from the workspace?')) return;
    try {
      await axiosInstance.delete(`/workspaces/${workspaceId}/members/${userId}`);
      setMembers((prev) => prev.filter((m) => m.user._id !== userId));
      setSuccessMsg('Member removed.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to remove member.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosInstance.patch(
        `/workspaces/${workspaceId}/members/${userId}/role`,
        { role: newRole }
      );
      setMembers((prev) =>
        prev.map((m) =>
          m.user._id === userId ? { ...m, role: newRole } : m
        )
      );
      setSuccessMsg('Role updated.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return setErrorMsg('Name cannot be empty.');
    try {
      setNameLoading(true);
      const res = await axiosInstance.patch(`/workspaces/${workspaceId}`, {
        name: newName.trim(),
      });
      setWorkspace(res.data);
      setEditingName(false);
      setSuccessMsg('Workspace name updated.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update name.');
    } finally {
      setNameLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans" style={gridBg}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
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
          <div className="min-w-0 flex-1 flex items-center gap-3">
            {editingName ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-white text-sm font-bold outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(99,102,241,0.5)',
                  }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') setEditingName(false);
                  }}
                />
                <button
                  onClick={handleSaveName}
                  disabled={nameLoading}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {nameLoading
                    ? <Loader2 size={16} className="animate-spin" />
                    : <Check size={16} />
                  }
                </button>
                <button
                  onClick={() => { setEditingName(false); setNewName(workspace?.name); }}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <div className="min-w-0">
                  <h1 className="text-base md:text-lg font-bold text-white truncate">
                    {workspace?.name || 'Members'}
                  </h1>
                  <p className="text-xs text-slate-500">Manage workspace members</p>
                </div>
                {isOwner && (
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-slate-500 hover:text-indigo-400 transition-colors flex-shrink-0"
                    title="Edit workspace name"
                  >
                    <Edit2 size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-2xl w-full mx-auto">
            {isOwner && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm"
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                <Shield size={16} className="text-indigo-400 flex-shrink-0" />
                <span className="text-indigo-300 font-medium">
                  You are the workspace owner — you have full control over members and settings.
                </span>
              </div>
            )}
            {isAdmin && (
              <div className="rounded-2xl p-5 md:p-8 mb-6" style={cardStyle}>
                <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                  <Users size={18} className="text-indigo-400" />
                  Invite people to {workspace?.name}
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

                <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-3">
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all flex-shrink-0"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Users size={16} />}
                    {loading ? 'Sending...' : 'Invite'}
                  </button>
                </form>
              </div>
            )}
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
                <p className="text-slate-500 text-sm text-center py-8">
                  No members yet.
                </p>
              ) : (
                <div className="space-y-1">
                  {members.map((member) => {
                    const isCurrentUser =
                      member.user._id === user?._id ||
                      member.user._id?.toString() === user?._id?.toString();
                    const isMemberOwner =
                      workspace?.owner === member.user._id ||
                      workspace?.owner?.toString() === member.user._id?.toString();
                    const canRemove =
                      isAdmin &&
                      !isCurrentUser &&
                      !isMemberOwner &&
                      !(member.role === 'admin' && !isOwner);

                    return (
                      <div
                        key={member.user._id}
                        className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                            {member.user.avatar ? (
                              <img
                                src={member.user.avatar}
                                alt={member.user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              member.user.name?.charAt(0).toUpperCase() || '?'
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">
                              {member.user.name}
                              {isCurrentUser && (
                                <span className="ml-2 text-[10px] text-slate-500 font-normal">
                                  (You)
                                </span>
                              )}
                              {isMemberOwner && (
                                <span className="ml-2 text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                                  Owner
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                          
                          {isOwner && !isMemberOwner && !isCurrentUser ? (
                            <div className="relative">
                              <select
                                value={member.role}
                                onChange={(e) =>
                                  handleRoleChange(member.user._id, e.target.value)
                                }
                                className="text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full outline-none appearance-none pr-5 cursor-pointer"
                                style={{
                                  background: 'rgba(99,102,241,0.15)',
                                  border: '1px solid rgba(99,102,241,0.2)',
                                  color: '#a5b4fc',
                                }}
                              >
                                {ROLES.map((r) => (
                                  <option key={r} value={r} className="bg-slate-900 text-white normal-case">
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown
                                size={10}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none"
                              />
                            </div>
                          ) : (
                            <span
                              className={`text-[10px] font-bold px-2 md:px-3 py-1 rounded-full uppercase tracking-wider ${roleBadgeStyle(member.role)}`}
                            >
                              {isMemberOwner ? 'Owner' : member.role}
                            </span>
                          )}

                        
                          {canRemove && (
                            <button
                              onClick={() => handleRemove(member.user._id, member.role)}
                              className="text-xs font-bold text-slate-600 hover:text-red-400 transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
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