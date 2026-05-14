

// server/routes/workspaces.js
const express = require('express');
const router = express.Router();
const { getWorkspaces, createWorkspace, deleteWorkspace } = require('../controllers/workspaceController');
const { protect } = require('../middleware/auth');

router.use(protect); // all workspace routes require login

router.get('/', getWorkspaces);
router.post('/', createWorkspace);
router.delete('/:id', deleteWorkspace);

module.exports = router;