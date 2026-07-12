// server/routes/tasks.js
const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, moveTask, deleteTask,getMyTasks,getBoardAnalytics } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/my-tasks', getMyTasks);
router.get('/analytics', getBoardAnalytics);
router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.patch('/:id/move', moveTask);
router.delete('/:id', deleteTask);

module.exports = router;

