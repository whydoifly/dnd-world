const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err)
      return res.status(500).json({ message: 'Failed to authenticate token' });

    req.user = await User.findById(decoded._id);
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ message: 'Access denied' });
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
};
