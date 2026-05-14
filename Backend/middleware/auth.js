// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // check the Authorization header exists
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // pull the token out from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // verify it against your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach the user to the request (minus their password)
    req.user = await User.findById(decoded.id).select('-passwordHash');

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };