const express = require('express');
const router = express.Router();
const {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
  inviteMember,
  removeMember,
  getMembers,
} = require('../controllers/workspaceController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getWorkspaces);
router.post('/', createWorkspace);
router.delete('/:id', deleteWorkspace);

// member management
router.get('/:id/members', getMembers);
router.post('/:id/invite', inviteMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
