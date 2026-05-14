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
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
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

module.exports = { getTasks, createTask, updateTask, moveTask, deleteTask };