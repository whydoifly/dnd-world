const express = require('express');
const Hero = require('../models/Hero');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all heroes for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const heroes = await Hero.find({ user: req.user._id });
    console.log('Fetched heroes:', heroes); // Log the fetched heroes
    res.json(heroes);
  } catch (err) {
    console.error('Error fetching heroes:', err);
    res.status(500).json({ message: 'Error fetching heroes' });
  }
});

// Create a new hero
router.post('/', verifyToken, async (req, res) => {
  const {
    name,
    class: heroClass,
    level,
    race,
    alignment,
    armorClass,
    hitPoints,
    speed,
    attributes,
    savingThrows,
    skills,
    senses,
    languages,
    imageUrl,
  } = req.body;
  try {
    const newHero = new Hero({
      user: req.user._id,
      name,
      class: heroClass,
      level,
      race,
      alignment,
      armorClass,
      hitPoints,
      speed,
      attributes,
      savingThrows,
      skills,
      senses,
      languages,
      imageUrl,
    });
    await newHero.save();
    res.status(201).json(newHero);
  } catch (err) {
    console.error('Error creating hero:', err);
    res.status(500).json({ message: 'Error creating hero' });
  }
});

// Update a hero
router.put('/:id', verifyToken, async (req, res) => {
  const {
    name,
    class: heroClass,
    level,
    race,
    alignment,
    armorClass,
    hitPoints,
    speed,
    attributes,
    savingThrows,
    skills,
    senses,
    languages,
    imageUrl,
  } = req.body;
  try {
    const hero = await Hero.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        name,
        class: heroClass,
        level,
        race,
        alignment,
        armorClass,
        hitPoints,
        speed,
        attributes,
        savingThrows,
        skills,
        senses,
        languages,
        imageUrl,
      },
      { new: true }
    );
    if (!hero) {
      return res.status(404).json({ message: 'Hero not found' });
    }
    res.json(hero);
  } catch (err) {
    console.error('Error updating hero:', err);
    res.status(500).json({ message: 'Error updating hero' });
  }
});

module.exports = router;
