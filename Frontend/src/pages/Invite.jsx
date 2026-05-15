import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Trash2, Loader2, Mail } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import Sidebar from '../components/layout/Sidebar';

const ROLES = ['admin', 'member', 'viewer'];

const roleBadge = (role) => {
  const styles = {
    admin: 'bg-indigo-100 text-indigo-700',
    member: 'bg-slate-100 text-slate-600',
    viewer: 'bg-slate-100 text-slate-400',
  };
  return styles[role] || styles.member;
};

const InviteMembers = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembers();
    fetchWorkspace();
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
      const res = await axiosInstance.get(
        `/workspaces/${workspaceId}/members`
      );
      setMembers(res.data);
    } catch (err) {
      setError('Failed to load members.');
    } finally {
      setPageLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email.trim()) return setError('Email is required.');

    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `/workspaces/${workspaceId}/invite`,
        { email, role }
      );
      setMessage(res.data.message);
      setEmail('');
      // refresh members list
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invite.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await axiosInstance.delete(
        `/workspaces/${workspaceId}/members/${userId}`
      );
      setMembers((prev) => prev.filter((m) => m.user._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Invite Members
            </h1>
            {workspaceName && (
              <p className="text-xs text-slate-400">{workspaceName}</p>
            )}
          </div>
        </header>

        <div className="flex-1 p-8 max-w-2xl w-full mx-auto">

          {/* Invite Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-6">
            <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
              <UserPlus size={18} className="text-indigo-600" />
              Invite people to {workspaceName || 'this workspace'}
            </h2>

            {/* Success message */}
            {message && (
              <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
                {message}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleInvite} className="flex gap-3">
              {/* Email input */}
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                />
              </div>

              {/* Role dropdown */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none bg-white focus:border-indigo-500 transition-all"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>

              {/* Send button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 text-sm transition-all"
              >
                {loading
                  ? <Loader2 size={16} className="animate-spin" />
                  : <UserPlus size={16} />
                }
                {loading ? 'Sending...' : 'Invite'}
              </button>
            </form>
          </div>

          {/* Members List Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-base font-bold text-slate-900 mb-6">
              Current Members
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({members.length})
              </span>
            </h2>

            {pageLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-slate-400" size={24} />
              </div>
            ) : members.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">
                No members yet. Invite someone above.
              </p>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.user._id}
                    className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {member.user.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {member.user.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {member.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Role badge */}
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${roleBadge(member.role)}`}>
                        {member.role}
                      </span>
                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(member.user._id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMembers;