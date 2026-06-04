// server/routes/auth.js
// server/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { register, login, getMe, googleAuth } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const passport = require('../config/passport');
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/google', googleAuth); // ← new

// ── Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/signin?error=google_failed`,
    session: false,
  }),
  (req, res) => {
    // generate JWT for the Google user
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // redirect to frontend with token in URL
    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${token}`
    );
  }
);

module.exports = router;