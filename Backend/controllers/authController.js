// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { cloudinary } = require('../config/cloudinary');

// helper to generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
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

// POST /api/auth/login
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

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

// POST /api/auth/google
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
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
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="margin-bottom: 24px;">
              <span style="background: #4f46e5; color: white; font-weight: 800; font-size: 18px; padding: 8px 16px; border-radius: 8px;">TaskFlow</span>
            </div>
            <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 12px;">
              Reset your password
            </h1>
            <p style="color: #64748b; font-size: 15px; margin: 0 0 32px;">
              Click the button below to reset your password. This link expires in 1 hour.
            </p>
            <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}"
              style="display: inline-block; background: #4f46e5; color: white; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 14px;">
              Reset Password →
            </a>
            <p style="margin-top: 32px; font-size: 12px; color: #94a3b8;">
              If you didn't request this you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });
    res.json({
      message: 'If that email exists you will receive a reset link shortly.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/reset-password
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

// PATCH /api/auth/update-profile
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

// PATCH /api/auth/change-password
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

// POST /api/auth/upload-avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const user = await User.findById(req.user._id);

    // delete old avatar from Cloudinary if it exists
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