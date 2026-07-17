import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { getBoardAnalytics } from '../api/tasks';
import axiosInstance from '../api/axiosInstance';

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

const StatCard = ({ label, value, color = 'text-white' }) => (
  <div className="rounded-2xl p-6" style={cardStyle}>
    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
    <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
  </div>
);

const BarRow = ({ label, value, total, color }) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-semibold text-slate-300">{label}</span>
        <span className="text-slate-500 font-medium">{value}</span>
      </div>
      <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

const BoardAnalytics = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [boardId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [boardRes, statsRes] = await Promise.all([
        axiosInstance.get(`/boards/${boardId}`),
        getBoardAnalytics(boardId),
      ]);
      setBoard(boardRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={gridBg}>
        <Loader2 className="animate-spin text-slate-500" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans" style={gridBg}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-8 gap-4"
          style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <button onClick={() => navigate(`/board/${boardId}`)} className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Analytics</h1>
            {board && <p className="text-xs text-slate-500">{board.title}</p>}
          </div>
        </header>

        {/* was: p-8 */}
        <div className="flex-1 p-4 md:p-8 max-w-3xl w-full mx-auto">
          {/* Top stats */}
          {/* was: grid grid-cols-3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Tasks" value={stats.total} />
            <StatCard
              label="Completion Rate"
              value={`${stats.completionRate}%`}
              color="text-indigo-400"
            />
            <StatCard
              label="Overdue"
              value={stats.overdue}
              color={stats.overdue > 0 ? 'text-red-400' : 'text-white'}
            />
          </div>

          {/* Overdue warning */}
          {stats.overdue > 0 && (
            <div className="mb-8 flex items-center gap-3 rounded-xl px-5 py-4"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
              <p className="text-sm text-red-300 font-medium">
                {stats.overdue} task{stats.overdue !== 1 ? 's' : ''} {stats.overdue !== 1 ? 'are' : 'is'} overdue.
              </p>
            </div>
          )}

          {/* By Status */}
          <div className="rounded-2xl p-6 mb-6" style={cardStyle}>
            <h2 className="text-sm font-bold text-white mb-5">Tasks by Status</h2>
            <BarRow label="To Do" value={stats.byStatus.todo} total={stats.total} color="bg-slate-500" />
            <BarRow label="In Progress" value={stats.byStatus.inprogress} total={stats.total} color="bg-indigo-500" />
            <BarRow label="Done" value={stats.byStatus.done} total={stats.total} color="bg-emerald-500" />
          </div>

          {/* By Priority */}
          <div className="rounded-2xl p-6" style={cardStyle}>
            <h2 className="text-sm font-bold text-white mb-5">Tasks by Priority</h2>
            <BarRow label="High" value={stats.byPriority.high} total={stats.total} color="bg-red-500" />
            <BarRow label="Medium" value={stats.byPriority.medium} total={stats.total} color="bg-amber-500" />
            <BarRow label="Low" value={stats.byPriority.low} total={stats.total} color="bg-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardAnalytics;