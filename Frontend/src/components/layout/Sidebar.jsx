import { useNavigate } from 'react-router-dom';
import { LayoutGrid, ClipboardList, Users, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <aside className="w-14 bg-[#0F172A] border-r border-slate-800 flex flex-col items-center py-4 gap-2 min-h-screen">
      {/* Logo */}
      <button
        onClick={() => navigate('/dashboard')}
        className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center mb-4 hover:bg-indigo-700 transition-colors"
      >
        <LayoutGrid size={18} className="text-white" />
      </button>

      {/* Nav icons */}
      <NavIcon icon={ClipboardList} tooltip="My Tasks" onClick={() => navigate('/dashboard')} />
      <NavIcon icon={Users} tooltip="Members" />
      <NavIcon icon={BarChart2} tooltip="Analytics" />

      {/* Bottom */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <NavIcon icon={Settings} tooltip="Settings" />
        <NavIcon icon={LogOut} tooltip="Sign Out" onClick={handleLogout} />
      </div>
    </aside>
  );
};

const NavIcon = ({ icon: Icon, tooltip, onClick }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
  >
    <Icon size={18} />
  </button>
);

export default Sidebar;