import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import {
  Settings, UserPlus, Star, ArrowLeft,
  Loader2, Palette,
} from 'lucide-react';

import Sidebar from '../components/layout/Sidebar';
import Column from '../components/board/Column';
import TaskCard from '../components/board/TaskCard';
import TaskModal from '../components/board/TaskModal';
import AddCardModal from '../components/board/AddCardModal';
import axiosInstance from '../api/axiosInstance';
import { updateBoardBackground, toggleStarBoard } from '../api/boards';

const COLUMNS = [
  { title: 'TO DO', status: 'todo' },
  { title: 'IN PROGRESS', status: 'inprogress' },
  { title: 'DONE', status: 'done' },
];

const BOARD_COLORS = [
  { label: 'Slate', value: '#1e293b' },
  { label: 'Indigo', value: '#312e81' },
  { label: 'Purple', value: '#4a1d96' },
  { label: 'Rose', value: '#881337' },
  { label: 'Emerald', value: '#064e3b' },
  { label: 'Sky', value: '#0c4a6e' },
  { label: 'Amber', value: '#78350f' },
  { label: 'Gray', value: '#111827' },
];

const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [addCardStatus, setAddCardStatus] = useState(null);

  // board background color
  const [bgColor, setBgColor] = useState('#1e293b');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  // board star state
  const [starred, setStarred] = useState(false);

  const { emit, on, off } = useSocket(boardId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // ── close color picker on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── fetch board and tasks on mount
  useEffect(() => {
    fetchBoard();
    fetchTasks();
  }, [boardId]);

  // ── socket listeners for real-time events
  useEffect(() => {
    on('task_moved', ({ taskId, status, position }) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status, position } : t))
      );
    });

    on('task_created', ({ task }) => {
      setTasks((prev) => {
        if (prev.find((t) => t._id === task._id)) return prev;
        return [...prev, task];
      });
    });

    on('task_updated', ({ task }) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? task : t))
      );
    });

    on('task_deleted', ({ taskId }) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    return () => {
      off('task_moved');
      off('task_created');
      off('task_updated');
      off('task_deleted');
    };
  }, [boardId]);

  // ── fetch board
  const fetchBoard = async () => {
    try {
      const res = await axiosInstance.get(`/boards/${boardId}`);
      setBoard(res.data);
      setBgColor(res.data.bgColor || '#1e293b');
      setStarred(res.data.starred || false);
    } catch {
      navigate('/dashboard');
    }
  };

  // ── fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/tasks?boardId=${boardId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── get tasks per column
  const getColumnTasks = (status) =>
    tasks.filter((t) => t.status === status);

  // ── create task
  const handleCreateTask = async (formData) => {
    try {
      const res = await axiosInstance.post('/tasks', {
        ...formData,
        boardId,
        workspaceId: board.workspace,
      });
      setTasks((prev) => [...prev, res.data]);
      emit('task_created', { boardId, task: res.data });
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  // ── update task
  const handleUpdateTask = async (taskId, formData) => {
    try {
      const res = await axiosInstance.patch(`/tasks/${taskId}`, formData);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data : t))
      );
      emit('task_updated', { boardId, task: res.data });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  // ── delete task
  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      emit('task_deleted', { boardId, taskId });
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // ── toggle board star
  const handleToggleStar = async () => {
    try {
      const res = await toggleStarBoard(boardId);
      setStarred(res.data.starred);
    } catch (err) {
      console.error('Failed to toggle star:', err);
    }
  };

  // ── change board background color
  const handleColorChange = async (color) => {
    setBgColor(color);
    setShowColorPicker(false);
    try {
      await updateBoardBackground(boardId, color);
    } catch (err) {
      console.error('Failed to update background:', err);
    }
  };

  // ── drag start
  const handleDragStart = (event) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task);
  };

  // ── drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTaskId = active.id;
    const overId = over.id;

    const draggedTask = tasks.find((t) => t._id === activeTaskId);
    if (!draggedTask) return;

    const isColumn = COLUMNS.some((c) => c.status === overId);

    // dropped on a different column
    if (isColumn && draggedTask.status !== overId) {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === activeTaskId ? { ...t, status: overId } : t
        )
      );
      await axiosInstance.patch(`/tasks/${activeTaskId}/move`, {
        status: overId,
        position: 0,
      });
      emit('task_moved', {
        boardId,
        taskId: activeTaskId,
        status: overId,
        position: 0,
      });
      return;
    }

    // dropped on another card in the same column — reorder
    const overTask = tasks.find((t) => t._id === overId);
    if (overTask && draggedTask.status === overTask.status) {
      const columnTasks = getColumnTasks(draggedTask.status);
      const oldIndex = columnTasks.findIndex((t) => t._id === activeTaskId);
      const newIndex = columnTasks.findIndex((t) => t._id === overId);
      const reordered = arrayMove(columnTasks, oldIndex, newIndex);
      setTasks((prev) => [
        ...prev.filter((t) => t.status !== draggedTask.status),
        ...reordered,
      ]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e293b] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading board...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: bgColor }}>
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Top Bar ── */}
        <header className="h-14 bg-black/30 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-white font-bold text-lg">
              {board?.title || 'Board'}
            </h1>
            {/* Star toggle */}
            <button
              onClick={handleToggleStar}
              className="transition-colors"
              title={starred ? 'Unstar board' : 'Star board'}
            >
              <Star
                size={16}
                className={starred
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-500 hover:text-amber-400'}
              />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Member avatars — real board members */}
            <div className="flex -space-x-2">
              {board?.members?.slice(0, 3).map((member, i) => (
                <div
                  key={member._id || i}
                  title={member.name}
                  className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-black/30 flex items-center justify-center text-white text-[10px] font-bold overflow-hidden"
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    member.name?.charAt(0).toUpperCase() || '?'
                  )}
                </div>
              ))}
              {board?.members?.length > 3 && (
                <div className="w-7 h-7 rounded-full bg-slate-700 border-2 border-black/30 flex items-center justify-center text-white text-[10px] font-bold">
                  +{board.members.length - 3}
                </div>
              )}
            </div>

            {/* Invite button */}
            <button
              onClick={() => navigate(`/workspace/${board?.workspace}/invite`)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
            >
              <UserPlus size={14} />
              Invite
            </button>

            {/* Color picker */}
            <div ref={colorPickerRef} className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="text-slate-400 hover:text-white transition-colors"
                title="Change board color"
              >
                <Palette size={18} />
              </button>

              {showColorPicker && (
                <div className="absolute right-0 top-9 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 w-52">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Board Color
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {BOARD_COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => handleColorChange(c.value)}
                        title={c.label}
                        className={`w-10 h-10 rounded-xl border-2 transition-all ${
                          bgColor === c.value
                            ? 'border-indigo-500 scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings → profile */}
            <button
              onClick={() => navigate('/profile')}
              className="text-slate-400 hover:text-white transition-colors"
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* ── Kanban Canvas ── */}
        <div className="flex-1 overflow-x-auto p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-5 h-full items-start">
              {COLUMNS.map((column) => (
                <Column
                  key={column.status}
                  column={column}
                  tasks={getColumnTasks(column.status)}
                  onAddCard={(status) => setAddCardStatus(status)}
                  onCardClick={(task) => setSelectedTask(task)}
                />
              ))}

              <div className="w-72 flex-shrink-0 border-2 border-dashed border-white/20 rounded-xl h-16 flex items-center justify-center text-white/40 hover:border-white/40 hover:text-white/60 transition-all cursor-pointer text-sm font-medium">
                + Add list
              </div>
            </div>

            <DragOverlay>
              {activeTask && (
                <div className="rotate-2 opacity-90">
                  <TaskCard task={activeTask} />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* ── Task Detail Modal ── */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}

      {/* ── Add Card Modal ── */}
      {addCardStatus && (
        <AddCardModal
          status={addCardStatus}
          boardId={boardId}
          onClose={() => setAddCardStatus(null)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
};

export default BoardPage;