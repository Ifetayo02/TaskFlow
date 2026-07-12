// server/routes/boards.js
const express = require('express');
const router = express.Router();
const { getBoard, createBoard, deleteBoard,toggleStar } = require('../controllers/boardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/:id', getBoard);
router.post('/', createBoard);
router.delete('/:id', deleteBoard);
router.patch('/:id/star', toggleStar);

module.exports = router;