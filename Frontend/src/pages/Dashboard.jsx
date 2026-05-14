import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Star,
  Users,
  Plus,
  Search,
  Bell,
  LayoutGrid,
  LogOut,
  X,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

// ─── Sidebar Item ─────────────────────────────────────────────
const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${
      active
        ? 'text-white border-r-4 border-indigo-500 bg-white/5'
        : 'text-slate-400 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

// ─── Board Card ───────────────────────────────────────────────
const BoardCard = ({ title, updatedAt, bgColor, onClick }) => {
  // pick a gradient based on bgColor or cycle through defaults
  const gradients = [
    'from-indigo-500 to-indigo-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-blue-700 to-blue-800',
    'from-slate-800 to-indigo-900',
    'from-teal-500 to-teal-600',
    'from-rose-500 to-rose-600',
  ];
  const gradient = gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer border border-slate-100 hover:-translate-y-1"
    >
      <div className={`h-24 w-full bg-gradient-to-br ${gradient}`} />
      <div className="p-5">
        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full border border-slate-200"></span>
          {updatedAt
            ? `Last updated: ${new Date(updatedAt).toLocaleDateString()}`
            : 'Just created'}
        </p>
      </div>
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────
const Modal = ({ title, onClose, onSubmit, loading, children }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
      >
        <X size={20} />
      </button>
      <h2 className="text-xl font-bold text-slate-900 mb-6">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [workspaces, setWorkspaces] = useState([]);
  const [boards, setBoards] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // active workspace in sidebar
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  // modals
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [boardTitle, setBoardTitle] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  // ── fetch workspaces on mount
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // ── fetch boards when active workspace changes
  useEffect(() => {
    if (activeWorkspace) {
      fetchBoards(activeWorkspace._id);
    }
  }, [activeWorkspace]);

  const fetchWorkspaces = async () => {
    try {
      setPageLoading(true);
      const res = await axiosInstance.get('/workspaces');
      setWorkspaces(res.data);
      // auto-select the first workspace
      if (res.data.length > 0) {
        setActiveWorkspace(res.data[0]);
      }
    } catch (err) {
      setError('Failed to load workspaces.');
    } finally {
      setPageLoading(false);
    }
  };

  const fetchBoards = async (workspaceId) => {
    try {
      // boards are embedded in the workspace — filter by active workspace
      const res = await axiosInstance.get('/workspaces');
      const ws = res.data.find((w) => w._id === workspaceId);
      setBoards(ws?.boards || []);
    } catch (err) {
      setError('Failed to load boards.');
    }
  };

  // ── create workspace
  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;
    try {
      setModalLoading(true);
      const res = await axiosInstance.post('/workspaces', { name: workspaceName });
      setWorkspaces((prev) => [...prev, res.data]);
      setActiveWorkspace(res.data);
      setWorkspaceName('');
      setShowWorkspaceModal(false);
    } catch (err) {
      setError('Failed to create workspace.');
    } finally {
      setModalLoading(false);
    }
  };

  // ── create board
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!boardTitle.trim() || !activeWorkspace) return;
    try {
      setModalLoading(true);
      const res = await axiosInstance.post('/boards', {
        title: boardTitle,
        workspaceId: activeWorkspace._id,
      });
      setBoards((prev) => [...prev, res.data]);
      setBoardTitle('');
      setShowBoardModal(false);
    } catch (err) {
      setError('Failed to create board.');
    } finally {
      setModalLoading(false);
    }
  };

  // ── logout
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // ── filter boards by search
  const filteredBoards = boards.filter((b) =>
    b.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── loading screen
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={24} />
          <span className="font-medium">Loading your workspaces...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="flex flex-1">

        {/* ── Sidebar ── */}
        <aside className="w-64 bg-[#0F172A] text-white flex flex-col py-8 border-r border-slate-800 min-h-screen">
          {/* Logo */}
          <div className="px-6 mb-8 flex items-center gap-2">
            <LayoutGrid className="text-indigo-500" />
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </div>

          {/* User Profile */}
          <div className="mx-4 mb-8 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Workspaces label */}
          <p className="px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Workspaces
          </p>

          {/* Workspace list */}
          <div className="flex-1 overflow-y-auto space-y-1 mb-4">
            {workspaces.map((ws) => (
              <SidebarItem
                key={ws._id}
                icon={LayoutGrid}
                label={ws.name}
                active={activeWorkspace?._id === ws._id}
                onClick={() => setActiveWorkspace(ws)}
              />
            ))}

            {workspaces.length === 0 && (
              <p className="px-6 text-xs text-slate-500 italic">No workspaces yet</p>
            )}
          </div>

          {/* Nav items */}
          <div className="border-t border-slate-800 pt-4 space-y-1">
            <SidebarItem icon={ClipboardList} label="My Tasks" />
            <SidebarItem icon={Star} label="Starred Boards" />
            <SidebarItem icon={Users} label="Members" />
          </div>

          {/* Bottom buttons */}
          <div className="px-4 mt-6 space-y-3">
            <button
              onClick={() => setShowWorkspaceModal(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg shadow-indigo-900/20"
            >
              <Plus size={18} /> New Workspace
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm text-slate-400 hover:text-white transition-all"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 flex flex-col">

          {/* Header */}
          <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {activeWorkspace ? activeWorkspace.name : 'My Workspaces'}
              </h1>
              {activeWorkspace && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {boards.length} board{boards.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search boards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-sm w-56 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </header>

          {/* Error banner */}
          {error && (
            <div className="mx-8 mt-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex justify-between">
              {error}
              <button onClick={() => setError('')}><X size={16} /></button>
            </div>
          )}

          {/* Empty state — no workspaces */}
          {workspaces.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                <LayoutGrid className="text-indigo-500" size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">No workspaces yet</h2>
              <p className="text-slate-500 text-sm mb-6 max-w-xs">
                Create your first workspace to start organizing your boards and tasks.
              </p>
              <button
                onClick={() => setShowWorkspaceModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
              >
                <Plus size={18} /> Create Workspace
              </button>
            </div>
          ) : (
            /* Board Grid */
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBoards.map((board) => (
                  <BoardCard
                    key={board._id}
                    title={board.title}
                    updatedAt={board.updatedAt}
                    bgColor={board.bgColor}
                    onClick={() => navigate(`/board/${board._id}`)}
                  />
                ))}

                {/* Create board card */}
                <div
                  onClick={() => setShowBoardModal(true)}
                  className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group h-[190px]"
                >
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="text-indigo-600" size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-indigo-600">
                    Create new board
                  </span>
                </div>
              </div>

              {/* No results from search */}
              {filteredBoards.length === 0 && boards.length > 0 && (
                <p className="text-center text-slate-400 text-sm mt-12">
                  No boards match "{searchQuery}"
                </p>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 p-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <h4 className="text-xl font-bold mb-4">TaskFlow</h4>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            © 2026 TaskFlow Inc. Precision engineering for high-velocity teams.
          </p>
        </div>
        <div>
          <h5 className="text-sm font-bold text-indigo-600 mb-4 uppercase tracking-widest">Product</h5>
          <ul className="text-sm text-slate-600 space-y-3 font-medium">
            <li className="hover:text-indigo-600 cursor-pointer">Features</li>
            <li className="hover:text-indigo-600 cursor-pointer">Security</li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-bold text-indigo-600 mb-4 uppercase tracking-widest">Company</h5>
          <ul className="text-sm text-slate-600 space-y-3 font-medium">
            <li className="hover:text-indigo-600 cursor-pointer">About</li>
            <li className="hover:text-indigo-600 cursor-pointer">Careers</li>
          </ul>
        </div>
      </footer>

      {/* ── Create Workspace Modal ── */}
      {showWorkspaceModal && (
        <Modal
          title="Create a new workspace"
          onClose={() => setShowWorkspaceModal(false)}
          onSubmit={handleCreateWorkspace}
          loading={modalLoading}
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Workspace name
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="e.g. Marketing Team"
              autoFocus
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-slate-900 transition-all"
            />
          </div>
        </Modal>
      )}

      {/* ── Create Board Modal ── */}
      {showBoardModal && (
        <Modal
          title={`New board in "${activeWorkspace?.name}"`}
          onClose={() => setShowBoardModal(false)}
          onSubmit={handleCreateBoard}
          loading={modalLoading}
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Board title
            </label>
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              placeholder="e.g. Marketing Launch"
              autoFocus
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-slate-900 transition-all"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;