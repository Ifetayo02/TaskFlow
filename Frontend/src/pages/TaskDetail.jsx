import { useState } from 'react';
import {
  X,
  AlignLeft,
  MessageSquare,
  Calendar,
  Plus,
  CheckCircle2,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LABELS = ['DESIGN', 'FEATURE', 'HIGH PRIORITY', 'BUG', 'RESEARCH'];
const STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];
const PRIORITIES = ['low', 'medium', 'high'];

const labelColors = {
  DESIGN: 'bg-indigo-100 text-indigo-600',
  FEATURE: 'bg-green-100 text-green-600',
  'HIGH PRIORITY': 'bg-red-100 text-red-600',
  BUG: 'bg-orange-100 text-orange-600',
  RESEARCH: 'bg-purple-100 text-purple-600',
};

const TaskModal = ({ task, onClose, onUpdate, onDelete }) => {
  const { user } = useAuth();

  // ── form state
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || 'todo');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [label, setLabel] = useState(task.label || '');
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.split('T')[0] : ''
  );

  // ── checklist state
  const [checklist, setChecklist] = useState(
    task.checklist || []
  );
  const [newCheckItem, setNewCheckItem] = useState('');

  // ── comments state
  const [comments, setComments] = useState(task.comments || []);
  const [commentInput, setCommentInput] = useState('');

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── checklist progress
  const checkedCount = checklist.filter((i) => i.checked).length;
  const checklistPercent =
    checklist.length > 0
      ? Math.round((checkedCount / checklist.length) * 100)
      : 0;

  // ── toggle checklist item
  const toggleCheckItem = (index) => {
    const updated = checklist.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
  };

  // ── add checklist item
  const handleAddCheckItem = (e) => {
    e.preventDefault();
    if (!newCheckItem.trim()) return;
    setChecklist((prev) => [
      ...prev,
      { label: newCheckItem.trim(), checked: false },
    ]);
    setNewCheckItem('');
  };

  // ── remove checklist item
  const removeCheckItem = (index) => {
    setChecklist((prev) => prev.filter((_, i) => i !== index));
  };

  // ── add comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        author: user?.name || 'You',
        text: commentInput.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setCommentInput('');
  };

  // ── save task
  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate(task._id, {
        title,
        description,
        status,
        priority,
        label,
        dueDate: dueDate || null,
        checklist,
        comments,
      });
      onClose();
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setSaving(false);
    }
  };

  // ── delete task
  const handleDelete = async () => {
    if (!window.confirm('Delete this task permanently?')) return;
    try {
      setDeleting(true);
      await onDelete(task._id);
      onClose();
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white w-full max-w-5xl rounded-[1.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative max-h-[92vh]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* ── Left Column ── */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
            <AlignLeft size={14} />
            Board / {status === 'todo' ? 'To Do' : status === 'inprogress' ? 'In Progress' : 'Done'}
          </div>

          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-extrabold text-slate-900 mb-10 outline-none border-b-2 border-transparent focus:border-indigo-300 transition-all bg-transparent pb-2"
          />

          {/* Status + Priority row */}
          <div className="flex gap-4 mb-10">
            <div className="flex-1">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none bg-white focus:border-indigo-400 transition-all"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none bg-white focus:border-indigo-400 transition-all capitalize"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p} className="capitalize">
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-12">
            <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-4">
              <AlignLeft size={18} /> Description
            </h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={5}
              className="w-full bg-indigo-50/30 border border-indigo-100/50 rounded-2xl p-6 text-slate-600 leading-relaxed text-sm outline-none focus:bg-white focus:border-indigo-300 transition-all resize-none"
            />
          </div>

          {/* Comments */}
          <div>
            <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-6">
              <MessageSquare size={18} /> Activity & Comments
            </h3>

            {/* Comment input */}
            <form onSubmit={handleAddComment} className="flex gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-indigo-50/30 border border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-200 outline-none transition-all"
              />
            </form>

            {/* Comment thread */}
            <div className="space-y-6">
              {comments.length === 0 && (
                <p className="text-slate-400 text-sm italic">
                  No comments yet. Be the first!
                </p>
              )}
              {comments.map((comment, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs flex-shrink-0">
                    {comment.author?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900">
                        {comment.author}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(comment.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </span>
                    </div>
                    <div className="bg-indigo-50/50 rounded-2xl p-4 text-sm text-slate-600 border border-indigo-100/30">
                      {comment.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="w-full md:w-[340px] bg-indigo-50/20 border-l border-slate-100 p-8 md:p-10 flex flex-col gap-10 overflow-y-auto">

          {/* Label */}
          <section>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Labels
            </h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {label && (
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${labelColors[label] || 'bg-slate-100 text-slate-600'}`}>
                  {label}
                </span>
              )}
            </div>
            <select
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-xs outline-none bg-white focus:border-indigo-400 transition-all"
            >
              <option value="">No label</option>
              {LABELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </section>

          {/* Due Date */}
          <section>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Due Date
            </h4>
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
              <Calendar className="text-slate-400 flex-shrink-0" size={18} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-sm font-semibold text-slate-700 outline-none bg-transparent w-full"
              />
            </div>
          </section>

          {/* Checklist */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Checklist
              </h4>
              {checklist.length > 0 && (
                <span className="text-[11px] font-black text-indigo-600">
                  {checklistPercent}%
                </span>
              )}
            </div>

            {/* Progress bar */}
            {checklist.length > 0 && (
              <div className="w-full bg-indigo-100 h-2 rounded-full mb-6 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${checklistPercent}%` }}
                />
              </div>
            )}

            {/* Checklist items */}
            <div className="space-y-3 mb-4">
              {checklist.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div
                    onClick={() => toggleCheckItem(i)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                      item.checked
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-slate-300 group-hover:border-indigo-400'
                    }`}
                  >
                    {item.checked && (
                      <CheckCircle2 size={14} className="text-white" />
                    )}
                  </div>
                  <span
                    onClick={() => toggleCheckItem(i)}
                    className={`text-sm font-medium flex-1 ${
                      item.checked
                        ? 'text-slate-400 line-through'
                        : 'text-slate-700'
                    }`}
                  >
                    {item.label}
                  </span>
                  <button
                    onClick={() => removeCheckItem(i)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add checklist item */}
            <form onSubmit={handleAddCheckItem} className="flex gap-2">
              <input
                type="text"
                value={newCheckItem}
                onChange={(e) => setNewCheckItem(e.target.value)}
                placeholder="Add an item..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-400 transition-all"
              />
              <button
                type="submit"
                className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
              >
                <Plus size={14} />
              </button>
            </form>
          </section>

          {/* Attachments — UI only, no upload backend */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Attachments
              </h4>
              <button className="text-[11px] font-black text-indigo-400 cursor-not-allowed">
                Coming soon
              </button>
            </div>
            <p className="text-xs text-slate-400 italic">
              File uploads will be available in a future update.
            </p>
          </section>

          {/* Action buttons */}
          <div className="mt-auto pt-6 border-t border-slate-100 space-y-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 text-sm font-semibold py-2 transition-colors disabled:opacity-60"
            >
              {deleting
                ? <Loader2 size={15} className="animate-spin" />
                : <Trash2 size={15} />
              }
              {deleting ? 'Deleting...' : 'Delete task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;