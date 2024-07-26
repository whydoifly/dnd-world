const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
const { generateToken } = require('../utils/generateToken');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, email, isAdmin } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already exists.' });
      } else if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already exists.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      email,
      isAdmin,
    });
    await user.save();

    res.status(201).json({ message: 'User registered.' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password');
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const token = generateToken(
      { _id: user._id, isAdmin: user.isAdmin },
      JWT_SECRET
    );
    req.session.token = token;
    res.json({ token, isAdmin: user.isAdmin });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Error during login' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});

module.exports = router;
