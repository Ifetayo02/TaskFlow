import { useState, useEffect } from 'react';
import { X, Calendar, Tag, Trash2, Loader2, UserCheck, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getBoardMembers } from '../../api/boards';

const LABELS = ['DESIGN', 'FEATURE', 'HIGH PRIORITY', 'BUG', 'RESEARCH'];
const STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const TaskModal = ({ task, onClose, onUpdate, onDelete }) => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: task.title || '',
    description: task.description || '',
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    label: task.label || '',
    status: task.status || 'todo',
    priority: task.priority || 'medium',
  });
  const [assignedTo, setAssignedTo] = useState(
    task.assignedTo?._id || task.assignedTo || null
  );
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (task.board) {
      getBoardMembers(task.board)
        .then((res) => setMembers(res.data))
        .catch(() => setMembers([]));
    }
  }, [task.board]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdate(task._id, { ...form, assignedTo });
      onClose();
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this task permanently?')) {
      try {
        setDeleting(true);
        await onDelete(task._id);
        onClose();
      } catch (err) {
        console.error('Failed to delete:', err);
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        {/* ── Fixed Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Task Details</h2>
            {task.createdAt && (
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock size={11} />
                Created {new Date(task.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
          {/* Close button — always visible */}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Add a description..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-indigo-500 outline-none transition-all bg-white"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-indigo-500 outline-none transition-all bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Label + Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Tag size={11} className="inline mr-1" />Label
              </label>
              <select
                name="label"
                value={form.label}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-indigo-500 outline-none transition-all bg-white"
              >
                <option value="">No label</option>
                {LABELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Calendar size={11} className="inline mr-1" />Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <UserCheck size={11} className="inline mr-1" />Assign To
            </label>
            <select
              value={assignedTo || ''}
              onChange={(e) => setAssignedTo(e.target.value || null)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-indigo-500 outline-none transition-all bg-white"
            >
              <option value="">Unassigned</option>
              <option value={user?._id}>Me ({user?.name})</option>
              {members
                .filter((m) => m._id !== user?._id)
                .map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.email})
                  </option>
                ))}
            </select>
          </div>

          {/* Activity log */}
          {task.activity && task.activity.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Activity
              </label>
              <div className="space-y-2">
                {task.activity.slice().reverse().map((entry, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 flex-shrink-0 text-[10px]">
                      {entry.user?.charAt(0).toUpperCase()}
                    </div>
                    <p>
                      <span className="font-semibold text-slate-700">{entry.user}</span>
                      {' '}{entry.action}
                      <span className="ml-1 text-slate-400">
                        · {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Fixed Footer ── */}
        <div className="px-6 pb-5 pt-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {deleting
              ? <Loader2 size={15} className="animate-spin" />
              : <Trash2 size={15} />
            }
            {deleting ? 'Deleting...' : 'Delete'}
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold flex items-center gap-2 transition-all"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;