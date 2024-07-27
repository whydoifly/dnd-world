const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user password
router.put('/:id/password', verifyToken, isAdmin, async (req, res) => {
  const { password } = req.body;
  try {
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ message: 'Error updating password' });
  }
});

module.exports = router;
