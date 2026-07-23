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

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { boardId: urlBoardId } = useParams();
  const { logout, currentBoard } = useAuth();

  const activeBoardId = urlBoardId || currentBoard?.boardId;
  const activeWorkspaceId = currentBoard?.workspaceId;

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside
      className="bg-[#0F172A] border-r border-slate-800 flex flex-col items-center min-h-screen flex-shrink-0"
      style={{ width: '56px' }}
    >
      <div className="flex flex-col items-center w-full py-4 gap-1 flex-1">

        {/* Logo — always goes to dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{ width: '40px', height: '40px', marginBottom: '12px' }}
          className="bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-700 active:bg-indigo-800 transition-colors flex-shrink-0"
        >
          <LayoutGrid size={18} className="text-white" />
        </button>

        {/* My Tasks — always works */}
        <NavIcon
          icon={ClipboardList}
          tooltip="My Tasks"
          active={isActive('/my-tasks')}
          onClick={() => navigate('/my-tasks')}
        />

        {/* Members — goes to invite if workspace known, else dashboard */}
        <NavIcon
          icon={Users}
          tooltip="Members"
          active={location.pathname.includes('/invite')}
          onClick={() =>
            activeWorkspaceId
              ? navigate(`/workspace/${activeWorkspaceId}/invite`)
              : navigate('/dashboard')
          }
        />

        {/* Analytics — goes to analytics if board known, else dashboard */}
        <NavIcon
          icon={BarChart2}
          tooltip="Analytics"
          active={location.pathname.includes('/analytics')}
          onClick={() =>
            activeBoardId
              ? navigate(`/board/${activeBoardId}/analytics`)
              : navigate('/dashboard')
          }
        />

        {/* Bottom */}
        <div className="mt-auto flex flex-col items-center gap-1 w-full">
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
      </div>
    </aside>
  );
};

const NavIcon = ({ icon: Icon, tooltip, onClick, active = false }) => (
  <button
    onClick={onClick}
    title={tooltip}
    style={{ width: '44px', height: '44px' }}
    className={`flex items-center justify-center rounded-xl transition-all flex-shrink-0 ${
      active
        ? 'bg-indigo-600/20 text-indigo-400'
        : 'text-slate-500 hover:text-white hover:bg-white/10 active:bg-white/20'
    }`}
  >
    <Icon size={20} />
  </button>
);

export default Sidebar;