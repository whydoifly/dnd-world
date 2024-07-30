const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
const { generateToken } = require('../utils/generateToken');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin,
    });

    console.log(newUser)

    await newUser.save();

    const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: newUser });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// User login
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
