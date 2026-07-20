import { useNavigate, useParams } from 'react-router-dom';
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

  return (
    <aside className="w-12 md:w-14 bg-[#0F172A] border-r border-slate-800 flex flex-col items-center py-3 md:py-4 gap-1 md:gap-2 min-h-screen flex-shrink-0">
      {/* Logo */}
      <button
        onClick={() => navigate('/dashboard')}
        className="w-8 h-8 md:w-9 md:h-9 bg-indigo-600 rounded-lg flex items-center justify-center mb-3 md:mb-4 hover:bg-indigo-700 transition-colors flex-shrink-0"
      >
        <LayoutGrid size={16} className="text-white" />
      </button>

      {/* Nav icons */}
      <NavIcon
        icon={ClipboardList}
        tooltip="My Tasks"
        onClick={() => navigate('/my-tasks')}
      />
      <NavIcon
        icon={Users}
        tooltip="Members"
        onClick={handleMembersClick}
      />
      <NavIcon
        icon={BarChart2}
        tooltip="Analytics"
        onClick={handleAnalyticsClick}
      />

      {/* Bottom */}
      <div className="mt-auto flex flex-col items-center gap-1 md:gap-2">
        <NavIcon
          icon={Settings}
          tooltip="Profile & Settings"
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

const NavIcon = ({ icon: Icon, tooltip, onClick }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
  >
    <Icon size={16} className="md:hidden" />
    <Icon size={18} className="hidden md:block" />
  </button>
);

export default Sidebar;