const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
  level: { type: Number, required: true },
  race: { type: String, required: true },
  alignment: { type: String, required: true },
  armorClass: { type: Number, required: true },
  hitPoints: { type: Number, required: true },
  speed: { type: Number, required: true },
  attributes: {
    strength: { type: Number, required: true },
    dexterity: { type: Number, required: true },
    constitution: { type: Number, required: true },
    intelligence: { type: Number, required: true },
    wisdom: { type: Number, required: true },
    charisma: { type: Number, required: true },
  },
  savingThrows: { type: String, required: true },
  skills: { type: String, required: true },
  senses: { type: String, required: true },
  languages: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model('Hero', heroSchema);
