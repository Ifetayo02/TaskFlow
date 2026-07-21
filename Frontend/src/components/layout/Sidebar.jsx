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
  const { boardId } = useParams();
  const { logout } = useAuth();
  const [workspaceId, setWorkspaceId] = useState(null);

  useEffect(() => {
    if (boardId) {
      axiosInstance
        .get(`/boards/${boardId}`)
        .then((res) => setWorkspaceId(res.data.workspace))
        .catch(() => setWorkspaceId(null));
    }
  }, [boardId]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleMembersClick = () => {
    if (workspaceId) {
      navigate(`/workspace/${workspaceId}/invite`);
    } else {
      // not on a board — go to dashboard
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

  // check which page is active for highlight
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="w-12 md:w-14 bg-[#0F172A] border-r border-slate-800 flex flex-col items-center py-3 md:py-4 gap-1 min-h-screen flex-shrink-0">
      {/* Logo — go to dashboard */}
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

      {/* Bottom section */}
      <div className="mt-auto flex flex-col items-center gap-1 w-full px-1.5">
        {/* Settings */}
        <NavIcon
          icon={Settings}
          tooltip="Profile & Settings"
          active={isActive('/profile')}
          onClick={() => navigate('/profile')}
        />
        {/* Sign out */}
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