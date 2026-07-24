
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['todo', 'inprogress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    position: {
      type: Number,
      default: 0, 
    },
    label: {
      type: String,
      default: '',
    },
    
    checklist: [
      {
        label: { type: String, required: true },
        checked: { type: Boolean, default: false },
      },
    ],
    activity: [
  {
    user: { type: String },
    action: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
],
    comments: [
      {
        author: { type: String },
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);