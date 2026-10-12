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
  Menu,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { toggleStarBoard } from '../api/boards';






import GlobalSearch from '../components/layout/GlobalSearch';




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


const colors = [
  'bg-indigo-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-blue-700',
  'bg-slate-800',
  'bg-teal-500',
  'bg-rose-500',
];

const BoardCard = ({ board, index, onClick, onToggleStar }) => {
  const color = colors[index % colors.length];

  const handleStarClick = (e) => {
    e.stopPropagation();
    onToggleStar(board._id);
  };

  return (
    <div
      onClick={onClick}
      className="bg-[#1e293b] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 transition-all group cursor-pointer border border-white/5 hover:border-white/10 hover:-translate-y-1 relative"
    >
      <div className={`h-24 w-full ${color}`} />

      <button
        onClick={handleStarClick}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/40 backdrop-blur-md flex items-center justify-center hover:bg-slate-900/60 transition-all shadow-sm border border-white/10"
        title={board.starred ? 'Unstar board' : 'Star board'}
      >
        <Star
          size={15}
          className={board.starred ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
        />
      </button>

      <div className="p-5">
        <h3 className="font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
          {board.title}
        </h3>
        <p className="text-xs text-slate-400 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full border border-slate-600 bg-slate-700"></span>
          {board.updatedAt
            ? `Last updated: ${new Date(board.updatedAt).toLocaleDateString()}`
            : 'Just created'}
        </p>
      </div>
    </div>
  );
};


const Modal = ({ title, onClose, onSubmit, loading, children }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-xl w-full max-w-md p-8 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
      >
        <X size={20} />
      </button>
      <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-4 text-slate-300">
        {children}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/50 mt-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  </div>
);


const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();


  const [workspaces, setWorkspaces] = useState([]);
  const [boards, setBoards] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [boardTitle, setBoardTitle] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

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
      if (res.data.length > 0) setActiveWorkspace(res.data[0]);
    } catch (err) {
      setError('Failed to load workspaces.');
    } finally {
      setPageLoading(false);
    }
  };

  const fetchBoards = async (workspaceId) => {
    try {
      const res = await axiosInstance.get('/workspaces');
      const ws = res.data.find((w) => w._id === workspaceId);
      setBoards(ws?.boards || []);
    } catch (err) {
      setError('Failed to load boards.');
    }
  };

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

  const handleToggleStar = async (boardId) => {
    try {
      const res = await toggleStarBoard(boardId);
      setBoards((prev) =>
        prev.map((b) => (b._id === boardId ? res.data : b))
      );
    } catch (err) {
      setError('Failed to update star.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const filteredBoards = boards
    .filter((b) => b.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((b) => !showStarredOnly || b.starred);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={24} />
          <span className="font-medium">Loading your workspaces...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-200">
      <div className="flex flex-1">
        {}
{sidebarOpen && (
  <div
    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
    onClick={() => setSidebarOpen(false)}
  />
)}
       <aside
  className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-white flex flex-col py-8 border-r border-slate-800 min-h-screen transition-transform duration-300 ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  }`}
>
  {}
  <button
    onClick={() => setSidebarOpen(false)}
    className="absolute top-4 right-4 text-slate-400 hover:text-white lg:hidden"
  >
    <X size={20} />
  </button>
          {}
          <div className="px-6 mb-8 flex items-center gap-2">
            <LayoutGrid className="text-indigo-500" />
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </div>

          {}
          <div
            onClick={() => navigate('/profile')}
            className="mx-4 mb-8 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-all"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-indigo-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          {}
          <p className="px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Workspaces
          </p>

          {}
          <div className="flex-1 overflow-y-auto space-y-1 mb-4">
            {workspaces.map((ws) => (
              <SidebarItem
                key={ws._id}
                icon={LayoutGrid}
                label={ws.name}
                active={!showStarredOnly && activeWorkspace?._id === ws._id}
                onClick={() => {
                  setShowStarredOnly(false);
                  setActiveWorkspace(ws);
                }}
              />
            ))}
            {workspaces.length === 0 && (
              <p className="px-6 text-xs text-slate-500 italic">
                No workspaces yet
              </p>
            )}
          </div>

          {}
          <div className="border-t border-white/10 pt-4 space-y-1">
            <SidebarItem
              icon={ClipboardList}
              label="My Tasks"
              onClick={() => navigate('/my-tasks')}
            />
            <SidebarItem
              icon={Star}
              label="Starred Boards"
              active={showStarredOnly}
              onClick={() => setShowStarredOnly((prev) => !prev)}
            />
            <SidebarItem
              icon={Users}
              label="Members"
              onClick={() => {
                if (activeWorkspace) {
                  navigate(`/workspace/${activeWorkspace._id}/invite`);
                }
              }}
            />
          </div>

          {}
          <div className="px-4 mt-6 space-y-3">
            <button
              onClick={() => setShowWorkspaceModal(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg shadow-indigo-900/20"
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

        {}
        <main className="flex-1 flex flex-col">
          {}
          <header className="h-20 bg-transparent backdrop-blur-md border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-10">
  <div className="flex items-center gap-4">
    {}
    <button
      onClick={() => setSidebarOpen(true)}
      className="lg:hidden text-slate-400 hover:text-white transition-colors"
    >
      <Menu size={22} />
    </button>

    <div>
      <h1 className="text-xl lg:text-2xl font-bold text-white">
        {showStarredOnly ? 'Starred Boards' : activeWorkspace ? activeWorkspace.name : 'My Workspaces'}
      </h1>
      {activeWorkspace && (
        <p className="text-xs text-slate-500 mt-0.5">
          {filteredBoards.length} board{filteredBoards.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  </div>

  <div className="flex items-center gap-3">
    {}
    <div className="hidden md:block">
      <GlobalSearch />
    </div>
    {activeWorkspace && (
      <button
        onClick={() => navigate(`/workspace/${activeWorkspace._id}/invite`)}
        className="hidden sm:flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Users size={15} />
        <span>Members</span>
      </button>
    )}
  </div>
          </header>

          {}
          {error && (
            <div className="mx-8 mt-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 font-medium flex justify-between">
              {error}
              <button onClick={() => setError('')} className="hover:text-red-300">
                <X size={16} />
              </button>
            </div>
          )}

          {}
          {workspaces.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
                <LayoutGrid className="text-indigo-400" size={32} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                No workspaces yet
              </h2>
              <p className="text-slate-400 text-sm mb-6 max-w-xs">
                Create your first workspace to start organizing your boards and tasks.
              </p>
              <button
                onClick={() => setShowWorkspaceModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/50"
              >
                <Plus size={18} /> Create Workspace
              </button>
            </div>
          ) : (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBoards.map((board, index) => (
                  <BoardCard
                    key={board._id}
                    board={board}
                    index={index}
                    onClick={() => navigate(`/board/${board._id}`)}
                    onToggleStar={handleToggleStar}
                  />
                ))}

                {}
                {!showStarredOnly && (
                  <div
                    onClick={() => setShowBoardModal(true)}
                    className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-indigo-400 hover:bg-indigo-500/5 transition-all cursor-pointer group h-[190px]"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="text-indigo-400 group-hover:text-indigo-300" size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-400 group-hover:text-indigo-400">
                      Create new board
                    </span>
                  </div>
                )}
              </div>

              {filteredBoards.length === 0 && boards.length > 0 && (
                <p className="text-center text-slate-400 text-sm mt-12">
                  {showStarredOnly
                    ? 'No starred boards yet. Click the star icon on a board to add it here.'
                    : `No boards match "${searchQuery}"`}
                </p>
              )}
            </div>
          )}
        </main>
      </div>

      {}
      <footer className="bg-transparent border-t border-white/10 p-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <h4 className="text-xl font-bold text-white mb-4">TaskFlow</h4>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            © 2026 TaskFlow Inc. Precision engineering for high-velocity teams.
          </p>
        </div>
        <div>
          <h5 className="text-sm font-bold text-indigo-400 mb-4 uppercase tracking-widest">
            Product
          </h5>
          <ul className="text-sm text-slate-400 space-y-3 font-medium">
            <li className="hover:text-indigo-300 cursor-pointer transition-colors">Features</li>
            <li className="hover:text-indigo-300 cursor-pointer transition-colors">Security</li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-bold text-indigo-400 mb-4 uppercase tracking-widest">
            Company
          </h5>
          <ul className="text-sm text-slate-400 space-y-3 font-medium">
            <li className="hover:text-indigo-300 cursor-pointer transition-colors">About</li>
            <li className="hover:text-indigo-300 cursor-pointer transition-colors">Careers</li>
          </ul>
        </div>
      </footer>

      {}
      {showWorkspaceModal && (
        <Modal
          title="Create a new workspace"
          onClose={() => setShowWorkspaceModal(false)}
          onSubmit={handleCreateWorkspace}
          loading={modalLoading}
        >
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Workspace name
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="e.g. Marketing Team"
              autoFocus
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-white transition-all placeholder-slate-600"
            />
          </div>
        </Modal>
      )}

      {}
      {showBoardModal && (
        <Modal
          title={`New board in "${activeWorkspace?.name}"`}
          onClose={() => setShowBoardModal(false)}
          onSubmit={handleCreateBoard}
          loading={modalLoading}
        >
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Board title
            </label>
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              placeholder="e.g. Marketing Launch"
              autoFocus
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-white transition-all placeholder-slate-600"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;