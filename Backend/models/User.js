
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    workspaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);