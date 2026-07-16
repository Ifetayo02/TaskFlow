// server/controllers/taskController.js
const Task = require('../models/Task');

// GET /api/tasks?boardId=xxx — get all tasks for a board
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ board: req.query.boardId })
      .populate('assignedTo', 'name email')
      .sort({ position: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/tasks — create a new task
const createTask = async (req, res) => {
  try {
    const { title, boardId, workspaceId, status, dueDate, label, priority } = req.body;

    const task = await Task.create({
      title,
      board: boardId,
      workspace: workspaceId,
      status: status || 'todo',
      dueDate,
      label,
      priority,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/tasks/:id — update a task (title, description, dueDate etc)


// PATCH /api/tasks/:id/move — handle drag and drop column change
const moveTask = async (req, res) => {
  try {
    const { status, position } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status, position },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('board', 'title')
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/tasks/analytics?boardId=xxx — task stats for a board
const getBoardAnalytics = async (req, res) => {
  try {
    const { boardId } = req.query;
    const tasks = await Task.find({ board: boardId });

    const byStatus = {
      todo: tasks.filter((t) => t.status === 'todo').length,
      inprogress: tasks.filter((t) => t.status === 'inprogress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };

    const byPriority = {
      low: tasks.filter((t) => t.priority === 'low').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      high: tasks.filter((t) => t.priority === 'high').length,
    };

    const total = tasks.length;
    const completionRate = total > 0 ? Math.round((byStatus.done / total) * 100) : 0;

    const overdue = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
    ).length;

    res.json({ total, byStatus, byPriority, completionRate, overdue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // build activity entry
    const changes = [];
    if (req.body.status && req.body.status !== task.status) {
      changes.push(`moved to ${req.body.status}`);
    }
    if (req.body.assignedTo && req.body.assignedTo !== String(task.assignedTo)) {
      changes.push('assignee updated');
    }
    if (req.body.dueDate && req.body.dueDate !== String(task.dueDate)) {
      changes.push('due date updated');
    }

    if (changes.length > 0) {
      task.activity.push({
        user: req.user?.name || 'Someone',
        action: changes.join(', '),
        createdAt: new Date(),
      });
    }

    Object.assign(task, req.body);
    await task.save();

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/tasks/search?q=keyword
const searchTasks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    // find all workspaces the user belongs to
    const workspaces = await require('../models/Workspace').find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
      ],
    });

    const workspaceIds = workspaces.map((w) => w._id);

    const tasks = await Task.find({
      workspace: { $in: workspaceIds },
      title: { $regex: q, $options: 'i' },
    })
      .populate('board', 'title')
      .populate('assignedTo', 'name email')
      .limit(20)
      .sort({ updatedAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks, createTask, updateTask,
  moveTask, deleteTask, getMyTasks,
  getBoardAnalytics, searchTasks,
};