const express = require('express');
const router = express.Router();
const {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
  getMembers,
  inviteMember,
  removeMember,
  updateWorkspace,
  updateMemberRole,
} = require('../controllers/workspaceController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getWorkspaces);
router.post('/', createWorkspace);
router.patch('/:id', updateWorkspace);
router.delete('/:id', deleteWorkspace);
router.get('/:id/members', getMembers);
router.post('/:id/invite', inviteMember);
router.delete('/:id/members/:userId', removeMember);
router.patch('/:id/members/:userId/role', updateMemberRole);

module.exports = router;
