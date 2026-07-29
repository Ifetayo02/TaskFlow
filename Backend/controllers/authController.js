
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { cloudinary } = require('../config/cloudinary');
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    };

    res.json(responseData);
    checkOverdueTasksForUser(user).catch((err) =>
      console.error('Overdue check error:', err.message)
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const checkOverdueTasksForUser = async (user) => {
  try {
    const Task = require('../models/Task');
    const sendEmail = require('../utils/sendEmail');

    const now = new Date();
    const overdueTasks = await Task.find({
      assignedTo: user._id,
      status: { $ne: 'done' },
      dueDate: { $lt: now },
    }).populate('board', 'title');

    if (overdueTasks.length === 0) return;
    const taskListHtml = overdueTasks.map((task) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">
          <strong style="color: #0f172a;">${task.title}</strong>
          <br/>
          <span style="font-size: 12px; color: #64748b;">
            ${task.board?.title || 'Unknown board'}
          </span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #ef4444; font-weight: 600; white-space: nowrap;">
          Due ${new Date(task.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </td>
      </tr>
    `).join('');

    await sendEmail({
      to: user.email,
      subject: `⚠️ You have ${overdueTasks.length} overdue task${overdueTasks.length !== 1 ? 's' : ''} on TaskFlow`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

            <div style="margin-bottom: 24px;">
              <span style="background: #4f46e5; color: white; font-weight: 800; font-size: 18px; padding: 8px 16px; border-radius: 8px;">
                TaskFlow
              </span>
            </div>

            <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">
              Welcome back, ${user.name} 👋
            </h1>
            <p style="color: #64748b; font-size: 15px; margin: 0 0 32px;">
              You have <strong style="color: #ef4444;">${overdueTasks.length} overdue task${overdueTasks.length !== 1 ? 's' : ''}</strong> that need your attention.
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 12px; text-align: left; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
                    Task
                  </th>
                  <th style="padding: 12px; text-align: left; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody>
                ${taskListHtml}
              </tbody>
            </table>

            <a href="${process.env.CLIENT_URL}/my-tasks"
              style="display: inline-block; background: #4f46e5; color: white; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 14px;">
              View My Tasks →
            </a>

            <p style="margin-top: 32px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px;">
              You received this because you logged into TaskFlow with overdue tasks.
              <br/>© 2026 TaskFlow Inc.
            </p>
          </div>
        </div>
      `,
    });

    console.log(`Overdue reminder sent to ${user.email} — ${overdueTasks.length} tasks`);
  } catch (err) {
    console.error('checkOverdueTasksForUser error:', err.message);
  }
};
const getMe = async (req, res) => {
  res.json(req.user);
};
const googleAuth = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        passwordHash: 'GOOGLE_AUTH',
        avatar: avatar || null,
      });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
    checkOverdueTasksForUser(user).catch((err) =>
      console.error('Overdue check error:', err.message)
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: 'If that email exists you will receive a reset link shortly.',
      });
    }

    
    if (user.passwordHash === 'GOOGLE_AUTH') {
      return res.json({
        message: 'If that email exists you will receive a reset link shortly.',
      });
      
      
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await sendEmail({
      to: email,
      subject: 'Reset your TaskFlow password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 16px; padding: 40px;">
            <span style="background: #4f46e5; color: white; font-weight: 800; font-size: 18px; padding: 8px 16px; border-radius: 8px;">TaskFlow</span>
            <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 24px 0 12px;">Reset your password</h1>
            <p style="color: #64748b; margin: 0 0 32px;">Click below to reset your password. This link expires in 1 hour.</p>
            <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}"
              style="display: inline-block; background: #4f46e5; color: white; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none;">
              Reset Password →
            </a>
            <p style="margin-top: 32px; font-size: 12px; color: #94a3b8;">
              If you didn't request this, ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    res.json({
      message: 'If that email exists you will receive a reset link shortly.',
    });
  } catch (error) {
  console.error('Forgot password error:', error.message);
  console.error('Full error:', error);
  res.status(500).json({ message: error.message });
}
};


const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters.',
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link.' });
    }
    user.passwordHash = await bcrypt.hash(password, 12);
    await user.save();
    res.json({ message: 'Password reset successfully. You can now sign in.' });
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(400).json({ message: 'Invalid or expired reset link.' });
    }
    res.status(500).json({ message: error.message });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: 'Email already in use.' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.passwordHash === 'GOOGLE_AUTH') {
      return res.status(400).json({
        message: 'Your account uses Google sign-in. Password change is not available.',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters.',
      });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const user = await User.findById(req.user._id);

    
    if (user.avatar) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`taskflow/avatars/${publicId}`);
    }

    user.avatar = req.file.path;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  googleAuth,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  uploadAvatar,
};