import { useState } from 'react';
import { X, Calendar, Tag, Trash2, Loader2, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
  const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdate(task._id, { ...form, assignedTo });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this task?')) {
      await onDelete(task._id);
      onClose();
    }
  };

  const isAssignedToMe = assignedTo === user?._id;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
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

          {/* Row: Status + Priority */}
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

          {/* Row: Label + Due Date */}
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
              <UserCheck size={11} className="inline mr-1" />Assignee
            </label>
            <label className="flex items-center gap-3 cursor-pointer px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
              <input
                type="checkbox"
                checked={isAssignedToMe}
                onChange={(e) => setAssignedTo(e.target.checked ? user._id : null)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-700">
                {isAssignedToMe ? `Assigned to you` : 'Unassigned — check to assign to yourself'}
              </span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-semibold transition-colors"
          >
            <Trash2 size={16} /> Delete task
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold flex items-center gap-2 transition-all"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;