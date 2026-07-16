import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { getMyTasks } from '../api/tasks';

const labelColors = {
  DESIGN: 'bg-indigo-500/20 text-indigo-400',
  FEATURE: 'bg-green-500/20 text-green-400',
  'HIGH PRIORITY': 'bg-red-500/20 text-red-400',
  BUG: 'bg-orange-500/20 text-orange-400',
  RESEARCH: 'bg-purple-500/20 text-purple-400',
};

const statusLabel = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

const gridBg = {
  backgroundColor: '#0f172a',
  backgroundImage: `linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)`,
  backgroundSize: '32px 32px',
};

const MyTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getMyTasks();
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="min-h-screen flex font-sans" style={gridBg}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b flex items-center px-8 gap-4"
          style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">My Tasks</h1>
            <p className="text-xs text-slate-500">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned to you
            </p>
          </div>
        </header>

        <div className="flex-1 p-8 max-w-3xl w-full mx-auto">
          {/* Filter tabs */}
          <div className="flex gap-2 mb-6">
            {['all', 'todo', 'inprogress', 'done'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                style={filter !== f ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
              >
                {f === 'all' ? 'All' : statusLabel[f]}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-slate-500" size={28} />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(99,102,241,0.15)' }}>
                <CheckCircle2 size={24} className="text-indigo-400" />
              </div>
              <p className="text-slate-500 text-sm font-medium">No tasks here. You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
                return (
                  <div
                    key={task._id}
                    onClick={() => navigate(`/board/${task.board?._id}`)}
                    className="rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-0.5"
                    style={{
                      background: 'rgba(30,41,59,0.8)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {task.label && (
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${labelColors[task.label] || 'bg-slate-700 text-slate-400'}`}>
                            {task.label}
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-slate-700/60 text-slate-400">
                          {statusLabel[task.status]}
                        </span>
                      </div>
                      {task.board?.title && (
                        <span className="text-xs text-slate-500 font-medium">{task.board.title}</span>
                      )}
                    </div>
                    <h3 className={`font-bold mb-2 ${task.status === 'done' ? 'line-through text-slate-500' : 'text-white'}`}>
                      {task.title}
                    </h3>
                    {task.dueDate && (
                      <div className={`flex items-center gap-1 text-xs font-medium ${isOverdue ? 'text-red-400' : 'text-slate-500'}`}>
                        <Calendar size={12} />
                        Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {isOverdue && ' — overdue'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;