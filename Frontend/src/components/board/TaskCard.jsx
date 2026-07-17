
import { Calendar, Clock } from 'lucide-react';

// add this below the due date section inside the card


const labelColors = {
  DESIGN: 'bg-blue-100 text-blue-700',
  FEATURE: 'bg-green-100 text-green-700',
  'HIGH PRIORITY': 'bg-red-100 text-red-600',
  BUG: 'bg-orange-100 text-orange-700',
  RESEARCH: 'bg-purple-100 text-purple-700',
};

const TaskCard = ({ task, onClick }) => {
  const labelStyle = labelColors[task.label?.toUpperCase()] || 'bg-slate-100 text-slate-600';

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isDone = task.status === 'done';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 hover:-translate-y-0.5 ${
        isDone ? 'opacity-60' : ''
      }`}
    >
      {/* Label */}
      {task.label && (
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${labelStyle}`}>
          {task.label}
        </span>
      )}

      {/* Title */}
      <p className={`mt-2 mb-3 text-sm font-semibold text-slate-800 leading-snug ${
        isDone ? 'line-through text-slate-400' : ''
      }`}>
        {task.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        {/* Assignee avatar */}
        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
          {task.assignedTo?.name?.charAt(0).toUpperCase() || '?'}
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div className={`flex items-center gap-1 text-[11px] font-medium ${
            isOverdue && !isDone ? 'text-red-500' : 'text-slate-400'
          }`}>
            <Calendar size={12} />
            {new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </div>
        )}
          {task.createdAt && (
  <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
    <Clock size={10} />
    Created {new Date(task.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}
  </div>
)}
      </div>
    </div>
  );
};

export default TaskCard;