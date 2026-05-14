// server/routes/test.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const sendEmail = require('../utils/sendEmail');

// GET /api/test/deadline — manually trigger the deadline check
router.get('/deadline', async (req, res) => {
  try {
    const now = new Date();
    const in24hrs = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      dueDate: { $gte: now, $lte: in24hrs },
      status: { $ne: 'done' },
      assignedTo: { $ne: null },
    })
      .populate('assignedTo', 'name email')
      .populate('board', 'title');

    if (tasks.length === 0) {
      return res.json({
        message: 'No tasks due in the next 24 hours.',
        tip: 'Create a task with a due date of tomorrow and assign it to a user to test.',
      });
    }

    for (const task of tasks) {
      if (!task.assignedTo?.email) continue;
      await sendEmail({
        to: task.assignedTo.email,
        subject: `⏰ Reminder: "${task.title}" is due tomorrow`,
        html: `<p>Hi ${task.assignedTo.name}, your task <b>${task.title}</b> is due tomorrow!</p>`,
      });
    }

    res.json({
      message: `${tasks.length} reminder(s) sent successfully.`,
      tasks: tasks.map((t) => ({
        title: t.title,
        sentTo: t.assignedTo?.email,
        dueDate: t.dueDate,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;