import { Plus, MoreHorizontal } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTaskCard from './SortableTaskCard';

const statusStyles = {
  todo: 'bg-slate-500',
  inprogress: 'bg-indigo-500',
  done: 'bg-emerald-500',
};

const Column = ({ column, tasks, onAddCard, onCardClick }) => {
  const { setNodeRef } = useDroppable({ id: column.status });

  return (
    <div className="flex flex-col w-64 md:w-72 shrink-0">
      {}
      <div className="flex items-center justify-between px-3 py-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            {column.title}
          </span>
          <span className="text-[10px] font-bold bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button className="text-slate-500 hover:text-slate-300 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {}
      <div className={`h-0.5 w-full ${statusStyles[column.status]} rounded-full mb-3 opacity-60`} />

      {}
      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="flex flex-col gap-3 flex-1 min-h-[100px] rounded-xl transition-colors"
        >
          {tasks.map((task) => (
            <SortableTaskCard
              key={task._id}
              task={task}
              onClick={() => onCardClick(task)}
            />
          ))}
        </div>
      </SortableContext>

      {}
      <button
        onClick={() => onAddCard(column.status)}
        className="mt-4 flex items-center gap-2 text-slate-500 hover:text-slate-200 text-sm font-medium py-2 px-3 rounded-xl hover:bg-white/5 transition-all w-full"
      >
        <Plus size={16} />
        Add a card
      </button>
    </div>
  );
};

export default Column;