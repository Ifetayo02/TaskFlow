const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
// const User = require('../models/User');
const {
  register,
  login,
  getMe,
  googleAuth,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);