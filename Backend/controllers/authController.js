// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// helper to generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // hash the password — never store plain text
    const passwordHash = await bcrypt.hash(password, 12);

    // create the user
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

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // compare the submitted password against the stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me  (protected)
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

    // find or create the user
    let user = await User.findOne({ email });

    if (!user) {
      // first time Google sign in — create account
      user = await User.create({
        name,
        email,
        passwordHash: 'GOOGLE_AUTH',
        avatar: avatar || null,
      });
    }

    // return your own JWT just like regular login
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // always return success even if email doesn't exist
    // this prevents email enumeration attacks
    if (!user) {
      return res.json({
        message: 'If that email exists you will receive a reset link shortly.',
      });
    }

    // generate a reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // send reset email
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

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters.',
      });
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link.' });
    }

    // update password
    user.passwordHash = await bcrypt.hash(password, 12);
    await user.save();

    res.json({ message: 'Password reset successfully. You can now sign in.' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Invalid or expired reset link.' });
    }
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




