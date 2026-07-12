import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { getBoardAnalytics } from '../api/tasks';
import axiosInstance from '../api/axiosInstance';

const StatCard = ({ label, value, color = 'text-slate-900' }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
      {label}
    </p>
    <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
  </div>
);

const BarRow = ({ label, value, total, color }) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="text-slate-400 font-medium">{value}</span>
      </div>
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        />
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

  useEffect(() => {
    fetchData();
  }, [boardId]);

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 gap-4">
          <button
            onClick={() => navigate(`/board/${boardId}`)}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Analytics</h1>
            {board && <p className="text-xs text-slate-400">{board.title}</p>}
          </div>
        </header>

        <div className="flex-1 p-8 max-w-3xl w-full mx-auto">

          {/* Top stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Tasks" value={stats.total} />
            <StatCard
              label="Completion Rate"
              value={`${stats.completionRate}%`}
              color="text-indigo-600"
            />
            <StatCard
              label="Overdue"
              value={stats.overdue}
              color={stats.overdue > 0 ? 'text-red-500' : 'text-slate-900'}
            />
          </div>

          {/* Overdue warning */}
          {stats.overdue > 0 && (
            <div className="mb-8 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-sm text-red-700 font-medium">
                {stats.overdue} task{stats.overdue !== 1 ? 's' : ''} {stats.overdue !== 1 ? 'are' : 'is'} overdue and not yet done.
              </p>
            </div>
          )}

          {/* By Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h2 className="text-sm font-bold text-slate-900 mb-5">Tasks by Status</h2>
            <BarRow label="To Do" value={stats.byStatus.todo} total={stats.total} color="bg-slate-400" />
            <BarRow label="In Progress" value={stats.byStatus.inprogress} total={stats.total} color="bg-indigo-500" />
            <BarRow label="Done" value={stats.byStatus.done} total={stats.total} color="bg-emerald-500" />
          </div>

          {/* By Priority */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 mb-5">Tasks by Priority</h2>
            <BarRow label="High" value={stats.byPriority.high} total={stats.total} color="bg-red-500" />
            <BarRow label="Medium" value={stats.byPriority.medium} total={stats.total} color="bg-amber-500" />
            <BarRow label="Low" value={stats.byPriority.low} total={stats.total} color="bg-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardAnalytics;