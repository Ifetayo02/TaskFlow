import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getBoardMembers } from '../../api/boards';

const LABELS = ['DESIGN', 'FEATURE', 'HIGH PRIORITY', 'BUG', 'RESEARCH'];

const AddCardModal = ({ status, boardId, onClose, onCreate }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    label: '',
    dueDate: '',
    priority: 'medium',
  });
  const [assignedTo, setAssignedTo] = useState(user._id);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (boardId) {
      getBoardMembers(boardId)
        .then((res) => setMembers(res.data))
        .catch(() => setMembers([]));
    }
  }, [boardId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required.');
    try {
      setLoading(true);
      await onCreate({ ...form, status, assignedTo });
      onClose();
    } catch {
      setError('Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Add a card</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              autoFocus
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Label
              </label>
              <select
                name="label"
                value={form.label}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none bg-white"
              >
                <option value="">No label</option>
                {LABELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
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
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none transition-all"
            />
          </div>

          {}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Assign To
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none bg-white"
            >
              <option value="">Unassigned</option>
              <option value={user._id}>Me ({user.name})</option>
              {members
                .filter((m) => m._id !== user._id)
                .map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.email})
                  </option>
                ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Add card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;