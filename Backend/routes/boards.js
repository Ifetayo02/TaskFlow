// server/routes/boards.js
const express = require('express');
const router = express.Router();
const { getBoard, createBoard, deleteBoard } = require('../controllers/boardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/:id', getBoard);
router.post('/', createBoard);
router.delete('/:id', deleteBoard);

module.exports = router;