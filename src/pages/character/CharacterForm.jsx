// src/pages/character/CharacterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import './CharacterForm.css';

const CharacterForm = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [armorClass, setArmorClass] = useState('');
  const [hitPoints, setHitPoints] = useState('');
  const [speed, setSpeed] = useState('');
  const [attributes, setAttributes] = useState({
    strength: '',
    dexterity: '',
    constitution: '',
    intelligence: '',
    wisdom: '',
    charisma: '',
  });
  const [savingThrows, setSavingThrows] = useState('');
  const [skills, setSkills] = useState('');
  const [damageImmunities, setDamageImmunities] = useState('');
  const [senses, setSenses] = useState('');
  const [languages, setLanguages] = useState('');
  const [challenge, setChallenge] = useState('');
  const [legendaryResistance, setLegendaryResistance] = useState('');
  const [actions, setActions] = useState('');
  const [legendaryActions, setLegendaryActions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const characterData = {
      name,
      armorClass,
      hitPoints,
      speed,
      attributes,
      savingThrows,
      skills,
      damageImmunities,
      senses,
      languages,
      challenge,
      legendaryResistance,
      actions,
      legendaryActions,
      imageUrl,
    };

    try {
      const response = await fetch('http://localhost:5001/api/characters', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(characterData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Character created:', data);
        navigate('/characters');
      } else {
        const errorData = await response.json();
        console.error('Error creating character:', errorData.message);
        alert(errorData.message);
      }
    } catch (error) {
      console.error('Error creating character:', error);
      alert('An error occurred while creating the character.');
    }
  };

  const handleAttributeChange = (e) => {
    setAttributes({
      ...attributes,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='character-form-container'>
      <form onSubmit={handleSubmit} className='character-form'>
        <h2>Create a New Character</h2>
        <div className='form-group'>
          <label>Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Name'
            required
          />
        </div>
        <div className='form-group'>
          <label>Armor Class</label>
          <input
            type='number'
            value={armorClass}
            onChange={(e) => setArmorClass(e.target.value)}
            placeholder='Armor Class'
            required
          />
        </div>
        <div className='form-group'>
          <label>Hit Points</label>
          <input
            type='text'
            value={hitPoints}
            onChange={(e) => setHitPoints(e.target.value)}
            placeholder='Hit Points'
            required
          />
        </div>
        <div className='form-group'>
          <label>Speed</label>
          <input
            type='number'
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            placeholder='Speed'
            required
          />
        </div>
        <h3>Attributes</h3>
        <div className='form-group'>
          <label>Strength</label>
          <input
            type='number'
            name='strength'
            value={attributes.strength}
            onChange={handleAttributeChange}
            placeholder='Strength'
            required
          />
        </div>
        <div className='form-group'>
          <label>Dexterity</label>
          <input
            type='number'
            name='dexterity'
            value={attributes.dexterity}
            onChange={handleAttributeChange}
            placeholder='Dexterity'
            required
          />
        </div>
        <div className='form-group'>
          <label>Constitution</label>
          <input
            type='number'
            name='constitution'
            value={attributes.constitution}
            onChange={handleAttributeChange}
            placeholder='Constitution'
            required
          />
        </div>
        <div className='form-group'>
          <label>Intelligence</label>
          <input
            type='number'
            name='intelligence'
            value={attributes.intelligence}
            onChange={handleAttributeChange}
            placeholder='Intelligence'
            required
          />
        </div>
        <div className='form-group'>
          <label>Wisdom</label>
          <input
            type='number'
            name='wisdom'
            value={attributes.wisdom}
            onChange={handleAttributeChange}
            placeholder='Wisdom'
            required
          />
        </div>
        <div className='form-group'>
          <label>Charisma</label>
          <input
            type='number'
            name='charisma'
            value={attributes.charisma}
            onChange={handleAttributeChange}
            placeholder='Charisma'
            required
          />
        </div>
        <div className='form-group'>
          <label>Saving Throws</label>
          <textarea
            value={savingThrows}
            onChange={(e) => setSavingThrows(e.target.value)}
            placeholder='Saving Throws'
            required
          />
        </div>
        <div className='form-group'>
          <label>Skills</label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder='Skills'
            required
          />
        </div>
        <div className='form-group'>
          <label>Damage Immunities</label>
          <textarea
            value={damageImmunities}
            onChange={(e) => setDamageImmunities(e.target.value)}
            placeholder='Damage Immunities'
            required
          />
        </div>
        <div className='form-group'>
          <label>Senses</label>
          <textarea
            value={senses}
            onChange={(e) => setSenses(e.target.value)}
            placeholder='Senses'
            required
          />
        </div>
        <div className='form-group'>
          <label>Languages</label>
          <textarea
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            placeholder='Languages'
            required
          />
        </div>
        <div className='form-group'>
          <label>Challenge</label>
          <textarea
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder='Challenge'
            required
          />
        </div>
        <div className='form-group'>
          <label>Legendary Resistance</label>
          <textarea
            value={legendaryResistance}
            onChange={(e) => setLegendaryResistance(e.target.value)}
            placeholder='Legendary Resistance'
          />
        </div>
        <div className='form-group'>
          <label>Actions</label>
          <textarea
            value={actions}
            onChange={(e) => setActions(e.target.value)}
            placeholder='Actions'
            required
          />
        </div>
        <div className='form-group'>
          <label>Legendary Actions</label>
          <textarea
            value={legendaryActions}
            onChange={(e) => setLegendaryActions(e.target.value)}
            placeholder='Legendary Actions'
          />
        </div>
        <div className='form-group'>
          <label>Image URL</label>
          <input
            type='text'
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder='Image URL'
            required
          />
        </div>
        <button type='submit'>Create Character</button>
      </form>
    </div>
  );
};

export default CharacterForm;
