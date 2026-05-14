// server/models/Board.js
const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Board title is required'],
      trim: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    bgColor: {
      type: String,
      default: '#1e293b', // slate-800
    },
    lists: [
      {
        title: { type: String, required: true },
        position: { type: Number, default: 0 },
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);