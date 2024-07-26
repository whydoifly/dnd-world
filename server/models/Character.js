const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  armorClass: { type: Number, required: true },
  hitPoints: { type: String, required: true },
  speed: { type: Number, required: true },
  attributes: {
    strength: { type: Number, required: true },
    dexterity: { type: Number, required: true },
    constitution: { type: Number, required: true },
    intelligence: { type: Number, required: true },
    wisdom: { type: Number, required: true },
    charisma: { type: Number, required: true }
  },
  savingThrows: { type: String, required: true },
  skills: { type: String, required: true },
  damageImmunities: { type: String, required: true },
  senses: { type: String, required: true },
  languages: { type: String, required: true },
  challenge: { type: String, required: true },
  legendaryResistance: { type: String },
  actions: { type: String, required: true },
  legendaryActions: { type: String },
  imageUrl: { type: String, required: true }
});

module.exports = mongoose.model('Character', characterSchema);
