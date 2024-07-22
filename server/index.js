const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET =
  'e2cbacf5694ab17297224d2b3c0903f3116082cc6445b4e603fb5c21b22d3028f761d57acd41967fd41a42417798c96ffc065fa544fb46634aa3bfd89fcc7137'; // Use the JWT secret key from the environment

console.log('JWT_SECRET:', JWT_SECRET); // Verify the secret key is loaded

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/dnd-app';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

// Character Schema
const characterSchema = new mongoose.Schema({
  name: String,
  size: String,
  description: String,
  image: String,
});

const Character = mongoose.model('Character', characterSchema);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token)
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Middleware to check admin rights
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  next();
};

// Routes
app.post('/api/register', async (req, res) => {
  const { username, password, isAdmin } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // If the username is not taken, proceed to create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, isAdmin });
    await user.save();
    res.status(201).json({ message: 'User registered.' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user)
    return res.status(400).json({ message: 'Invalid username or password.' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({ message: 'Invalid username or password.' });

  const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token, isAdmin: user.isAdmin });
});

app.get('/api/characters', verifyToken, async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    console.error('Error fetching characters:', err);
    res.status(500).json({ message: 'Error fetching characters' });
  }
});

app.post('/api/characters', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, size, description, image } = req.body;
    const newCharacter = new Character({ name, size, description, image });
    await newCharacter.save();
    res.status(201).json(newCharacter);
  } catch (err) {
    console.error('Error creating character:', err);
    res.status(500).json({ message: 'Error creating character' });
  }
});

app.delete('/api/characters/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const characterId = req.params.id;
    await Character.findByIdAndDelete(characterId);
    res.status(200).json({ message: 'Character deleted successfully' });
  } catch (err) {
    console.error('Error deleting character:', err);
    res.status(500).json({ message: 'Error deleting character' });
  }
});

// Route to get all users (admin only)
app.get('/api/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Route to delete a user (admin only)
app.delete('/api/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Route to update a user role (admin only)
app.put('/api/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { isAdmin } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
