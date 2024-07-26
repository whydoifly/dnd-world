const express = require('express');
const Character = require('../models/Character');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    console.error('Error fetching characters:', err);
    res.status(500).json({ message: 'Error fetching characters' });
  }
});

router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      name, armorClass, hitPoints, speed,
      attributes, savingThrows, skills,
      damageImmunities, senses, languages, challenge,
      legendaryResistance, actions, legendaryActions, imageUrl
    } = req.body;

    const newCharacter = new Character({
      name, armorClass, hitPoints, speed,
      attributes,
      savingThrows, skills,
      damageImmunities, senses, languages, challenge,
      legendaryResistance, actions, legendaryActions, imageUrl
    });

    await newCharacter.save();
    res.status(201).json(newCharacter);
  } catch (err) {
    console.error('Error creating character:', err);
    res.status(500).json({ message: 'Error creating character' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.json(character);
  } catch (err) {
    console.error('Error fetching character:', err);
    res.status(500).json({ message: 'Error fetching character' });
  }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const characterId = req.params.id;
    await Character.findByIdAndDelete(characterId);
    res.status(200).json({ message: 'Character deleted successfully' });
  } catch (err) {
    console.error('Error deleting character:', err);
    res.status(500).json({ message: 'Error deleting character' });
  }
});

module.exports = router;
