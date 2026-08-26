import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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

const statusColors = {
  todo: 'bg-slate-700/60 text-slate-400',
  inprogress: 'bg-indigo-500/20 text-indigo-400',
  done: 'bg-emerald-500/20 text-emerald-400',
};



const MyTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getMyTasks();
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filters = ['all', 'todo', 'inprogress', 'done'];

  const filteredTasks =
    filter === 'all'
      ? tasks
      : tasks.filter((t) => t.status === filter);

  const overdueCount = tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== 'done'
  ).length;

  return (
    <div className="h-screen flex text-slate-200 overflow-hidden font-sans bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {}
        <header
          className="h-16 border-b flex items-center px-4 md:px-8 gap-3 flex-shrink-0"
          style={{
            background: 'rgba(15,23,42,0.9)',
            backdropFilter: 'blur(12px)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-base md:text-lg font-bold text-white">
              My Tasks
            </h1>
            <p className="text-xs text-slate-500">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned to you
              {overdueCount > 0 && (
                <span className="ml-2 text-red-400 font-semibold">
                  · {overdueCount} overdue
                </span>
              )}
            </p>
          </div>
        </header>

        {}
        <div className="flex-1 overflow-y-auto p-3 md:p-8">
          <div className="max-w-3xl w-full mx-auto">

            {}
            <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-1 scrollbar-hide">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex-shrink-0 ${
                    filter === f
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  style={
                    filter !== f
                      ? {
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }
                      : {}
                  }
                >
                  {f === 'all' ? 'All' : statusLabel[f]}
                  {f !== 'all' && (
                    <span className="ml-1.5 opacity-60">
                      ({tasks.filter((t) => t.status === f).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {}
            {error && (
              <div
                className="mb-4 flex items-center gap-3 rounded-xl px-4 py-3"
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                }}
              >
                <AlertCircle className="text-red-400 flex-shrink-0" size={16} />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-3 text-slate-500">
                  <Loader2 className="animate-spin" size={24} />
                  <span className="text-sm">Loading tasks...</span>
                </div>
              </div>

            
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-16 md:py-20">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(99,102,241,0.1)' }}
                >
                  <CheckCircle2 size={24} className="text-indigo-400" />
                </div>
                <p className="text-white font-semibold mb-1">
                  {filter === 'all' ? 'No tasks assigned to you' : `No ${statusLabel[filter]} tasks`}
                </p>
                <p className="text-slate-500 text-sm">
                  {filter === 'all'
                    ? 'Tasks assigned to you will appear here.'
                    : 'Try a different filter above.'}
                </p>
              </div>

            
            ) : (
              <div className="space-y-2 md:space-y-3">
                {filteredTasks.map((task) => {
                  const isOverdue =
                    task.dueDate &&
                    new Date(task.dueDate) < new Date() &&
                    task.status !== 'done';

                  return (
                    <div
                      key={task._id}
                      onClick={() => navigate(`/board/${task.board?._id}`)}
                      className="rounded-xl md:rounded-2xl p-4 md:p-5 cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.99]"
                      style={{
                        background: 'rgba(30,41,59,0.8)',
                        border: isOverdue
                          ? '1px solid rgba(239,68,68,0.3)'
                          : '1px solid rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {task.label && (
                            <span
                              className={`text-[9px] md:text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                labelColors[task.label] ||
                                'bg-slate-700 text-slate-400'
                              }`}
                            >
                              {task.label}
                            </span>
                          )}
                          <span
                            className={`text-[9px] md:text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              statusColors[task.status]
                            }`}
                          >
                            {statusLabel[task.status]}
                          </span>
                          {isOverdue && (
                            <span className="text-[9px] md:text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-red-500/20 text-red-400">
                              Overdue
                            </span>
                          )}
                        </div>
                        {task.board?.title && (
                          <span className="text-[10px] text-slate-500 font-medium flex-shrink-0 truncate max-w-[80px] md:max-w-none">
                            {task.board.title}
                          </span>
                        )}
                      </div>

                      {}
                      <h3
                        className={`font-bold text-sm md:text-base mb-2 leading-snug ${
                          task.status === 'done'
                            ? 'line-through text-slate-500'
                            : 'text-white'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {}
                      <div className="flex items-center justify-between gap-2">
                        {task.dueDate ? (
                          <div
                            className={`flex items-center gap-1 text-xs font-medium ${
                              isOverdue ? 'text-red-400' : 'text-slate-500'
                            }`}
                          >
                            <Calendar size={11} />
                            Due{' '}
                            {new Date(task.dueDate).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric' }
                            )}
                          </div>
                        ) : (
                          <span />
                        )}

                        {task.priority && (
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider ${
                              task.priority === 'high'
                                ? 'text-red-400'
                                : task.priority === 'medium'
                                ? 'text-amber-400'
                                : 'text-slate-500'
                            }`}
                          >
                            {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTasks;