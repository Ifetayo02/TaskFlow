import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  ClipboardList,
  Users,
  BarChart2,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { boardId: urlBoardId } = useParams();
  const { logout } = useAuth();

  const [workspaceId, setWorkspaceId] = useState(null);

  // persist boardId across pages using localStorage
  const [boardId, setBoardId] = useState(() => {
    return urlBoardId || localStorage.getItem('lastBoardId') || null;
  });

  // when urlBoardId changes (user navigates to a board) save it
  useEffect(() => {
    if (urlBoardId) {
      setBoardId(urlBoardId);
      localStorage.setItem('lastBoardId', urlBoardId);
    }
  }, [urlBoardId]);

  // fetch workspace from board
  useEffect(() => {
    if (boardId) {
      axiosInstance
        .get(`/boards/${boardId}`)
        .then((res) => {
          setWorkspaceId(res.data.workspace);
          // also persist workspaceId
          localStorage.setItem('lastWorkspaceId', res.data.workspace);
        })
        .catch(() => {
          // board fetch failed — try getting workspaceId from localStorage
          const saved = localStorage.getItem('lastWorkspaceId');
          if (saved) setWorkspaceId(saved);
        });
    } else {
      // no boardId at all — try localStorage for workspaceId
      const saved = localStorage.getItem('lastWorkspaceId');
      if (saved) setWorkspaceId(saved);
    }
  }, [boardId]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('lastBoardId');
    localStorage.removeItem('lastWorkspaceId');
    navigate('/signin');
  };

  const handleMembersClick = () => {
    if (workspaceId) {
      navigate(`/workspace/${workspaceId}/invite`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleAnalyticsClick = () => {
    if (boardId) {
      navigate(`/board/${boardId}/analytics`);
    } else {
      navigate('/dashboard');
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="w-12 md:w-14 bg-[#0F172A] border-r border-slate-800 flex flex-col items-center py-3 md:py-4 gap-1 min-h-screen flex-shrink-0">
      {/* Logo */}
      <button
        onClick={() => navigate('/dashboard')}
        className="w-8 h-8 md:w-9 md:h-9 bg-indigo-600 rounded-lg flex items-center justify-center mb-3 md:mb-4 hover:bg-indigo-700 transition-colors flex-shrink-0"
      >
        <LayoutGrid size={15} className="text-white" />
      </button>

      {/* My Tasks */}
      <NavIcon
        icon={ClipboardList}
        tooltip="My Tasks"
        active={isActive('/my-tasks')}
        onClick={() => navigate('/my-tasks')}
      />

      {/* Members */}
      <NavIcon
        icon={Users}
        tooltip="Members"
        active={location.pathname.includes('/invite')}
        onClick={handleMembersClick}
      />

      {/* Analytics */}
      <NavIcon
        icon={BarChart2}
        tooltip="Analytics"
        active={location.pathname.includes('/analytics')}
        onClick={handleAnalyticsClick}
      />

      {/* Bottom */}
      <div className="mt-auto flex flex-col items-center gap-1 w-full px-1.5">
        <NavIcon
          icon={Settings}
          tooltip="Profile & Settings"
          active={isActive('/profile')}
          onClick={() => navigate('/profile')}
        />
        <NavIcon
          icon={LogOut}
          tooltip="Sign Out"
          onClick={handleLogout}
        />
      </div>
    </aside>
  );
};

const NavIcon = ({ icon: Icon, tooltip, onClick, active = false }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg transition-all flex-shrink-0 ${
      active
        ? 'bg-indigo-600/20 text-indigo-400'
        : 'text-slate-500 hover:text-white hover:bg-white/10'
    }`}
  >
    <Icon size={17} />
  </button>
);

export default Sidebar;