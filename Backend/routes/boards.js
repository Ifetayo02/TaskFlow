// server/routes/boards.js
const express = require('express');
const router = express.Router();
const { getBoard, createBoard, deleteBoard, toggleStar, getBoardMembers,updateBackground } = require('../controllers/boardController');
const { protect } = require('../middleware/auth');

router.use(protect);


router.get('/:id', getBoard);
router.get('/:id/members', getBoardMembers);
router.post('/', createBoard);
router.delete('/:id', deleteBoard);
router.patch('/:id/star', toggleStar);
router.patch('/:id/background', updateBackground);



module.exports = router;