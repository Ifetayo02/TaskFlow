import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { useAuth } from '../context/AuthContext';
import useSocket from '../hooks/useSocket';

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
  const { emit, on, off } = useSocket(boardId);
  const { setCurrentBoard } = useAuth();

  
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [addCardStatus, setAddCardStatus] = useState(null);
  const [bgColor, setBgColor] = useState('#1e293b');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [starred, setStarred] = useState(false);

  const colorPickerRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  
  const fetchBoard = async () => {
    try {
      const res = await axiosInstance.get(`/boards/${boardId}`);
      setBoard(res.data);
      setBgColor(res.data.bgColor || '#1e293b');
      setStarred(res.data.starred || false);

      
      setCurrentBoard({
        boardId: res.data._id,
        workspaceId: res.data.workspace,
      });
    } catch {
      navigate('/dashboard');
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/tasks?boardId=${boardId}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const getColumnTasks = (status) => tasks.filter((t) => t.status === status);

  
  useEffect(() => {
    fetchBoard();
    fetchTasks();
  }, [boardId]);

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
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
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

  const handleUpdateTask = async (taskId, formData) => {
    try {
      const res = await axiosInstance.patch(`/tasks/${taskId}`, formData);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
      emit('task_updated', { boardId, task: res.data });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      emit('task_deleted', { boardId, taskId });
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  
  const handleToggleStar = async () => {
    try {
      const res = await toggleStarBoard(boardId);
      setStarred(res.data.starred);
    } catch (err) {
      console.error('Failed to toggle star:', err);
    }
  };

  const handleColorChange = async (color) => {
    setBgColor(color);
    setShowColorPicker(false);
    try {
      await updateBoardBackground(boardId, color);
    } catch (err) {
      console.error('Failed to update background:', err);
    }
  };

  
  const handleDragStart = (event) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeTaskId = active.id;
    const overId = over.id;
    const draggedTask = tasks.find((t) => t._id === activeTaskId);
    if (!draggedTask) return;

    const isColumn = COLUMNS.some((c) => c.status === overId);

    
    if (isColumn && draggedTask.status !== overId) {
      setTasks((prev) =>
        prev.map((t) => (t._id === activeTaskId ? { ...t, status: overId } : t))
      );
      try {
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
      } catch (err) {
        console.error('Failed to persist task move:', err);
      }
      return;
    }

    
    const overTask = tasks.find((t) => t._id === overId);
    if (overTask && draggedTask.status === overTask.status) {
      const columnTasks = getColumnTasks(draggedTask.status);
      const oldIndex = columnTasks.findIndex((t) => t._id === activeTaskId);
      const newIndex = columnTasks.findIndex((t) => t._id === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      const reordered = arrayMove(columnTasks, oldIndex, newIndex);

      
      setTasks((prev) => [
        ...prev.filter((t) => t.status !== draggedTask.status),
        ...reordered,
      ]);

      try {
        await axiosInstance.patch(`/tasks/${activeTaskId}/move`, {
          status: draggedTask.status,
          position: newIndex,
        });
        emit('task_moved', {
          boardId,
          taskId: activeTaskId,
          status: draggedTask.status,
          position: newIndex,
        });
      } catch (err) {
        console.error('Failed to persist task reorder:', err);
      }
    }
  };

  
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
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
        {}
        <header className="h-auto min-h-14 bg-black/30 backdrop-blur-sm border-b border-white/10 flex flex-wrap items-center justify-between px-4 md:px-6 py-3 gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-white font-bold text-base md:text-lg truncate max-w-[150px] md:max-w-none">
              {board?.title || 'Board'}
            </h1>
            <button
              onClick={handleToggleStar}
              className="transition-colors flex-shrink-0"
              title={starred ? 'Unstar board' : 'Star board'}
            >
              <Star
                size={16}
                className={
                  starred ? 'fill-amber-400 text-amber-400' : 'text-slate-500 hover:text-amber-400'
                }
              />
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex -space-x-2">
              {board?.members?.slice(0, 3).map((member, i) => (
                <div
                  key={member._id || i}
                  title={member.name}
                  className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-black/30 flex items-center justify-center text-white text-[10px] font-bold overflow-hidden"
                >
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
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

            <button
              onClick={() => navigate(`/workspace/${board?.workspace}/invite`)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all"
            >
              <UserPlus size={13} />
              <span className="hidden sm:inline">Invite</span>
            </button>

            <div ref={colorPickerRef} className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="Change board color"
              >
                <Palette size={16} />
              </button>

              {showColorPicker && (
                <div className="absolute right-0 top-9 bg-slate-900 rounded-2xl shadow-xl border border-white/10 p-4 z-50 w-52">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Board Color
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {BOARD_COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => handleColorChange(c.value)}
                        title={c.label}
                        className={`w-10 h-10 rounded-xl border-2 transition-all ${
                          bgColor === c.value ? 'border-indigo-400 scale-110' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/profile')}
              className="text-slate-400 hover:text-white transition-colors p-1"
              title="Settings"
            >
              <Settings size={16} />
            </button>
          </div>
        </header>

        {}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 md:p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 md:gap-5 items-start" style={{ minWidth: 'max-content' }}>
              {COLUMNS.map((column) => (
                <Column
                  key={column.status}
                  column={column}
                  tasks={getColumnTasks(column.status)}
                  onAddCard={(status) => setAddCardStatus(status)}
                  onCardClick={(task) => setSelectedTask(task)}
                />
              ))}

              <div className="w-64 md:w-72 flex-shrink-0 border-2 border-dashed border-white/20 rounded-xl h-16 flex items-center justify-center text-white/40 hover:border-white/40 hover:text-white/60 transition-all cursor-pointer text-sm font-medium">
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

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}

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