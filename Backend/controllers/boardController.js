
const Board = require('../models/Board');
const Workspace = require('../models/Workspace');


const getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('members', 'name email');

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createBoard = async (req, res) => {
  try {
    const { title, workspaceId, bgColor } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const board = await Board.create({
      title,
      workspace: workspaceId,
      bgColor: bgColor || '#1e293b',
      lists: [
        { title: 'To Do', position: 0 },
        { title: 'In Progress', position: 1 },
        { title: 'Done', position: 2 },
      ],
      members: [req.user._id],
    });

    
    await Workspace.findByIdAndUpdate(workspaceId, {
      $push: { boards: board._id },
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    await board.deleteOne();
    res.json({ message: 'Board deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleStar = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    board.starred = !board.starred;
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getBoardMembers = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('members', 'name email avatar');
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board.members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBackground = async (req, res) => {
  try {
    const { bgColor } = req.body;
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      { bgColor },
      { new: true }
    );
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBoard, createBoard, deleteBoard,
  toggleStar, getBoardMembers, updateBackground,
};

