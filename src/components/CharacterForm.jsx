// src/components/CharacterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CharacterForm.css';

const CharacterForm = () => {
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
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5001/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
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
          image,
        }),
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
      <form onSubmit={handleSubmit}>
        <h2>Create a New Character</h2>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Name'
          required
        />
        <input
          type='number'
          value={armorClass}
          onChange={(e) => setArmorClass(e.target.value)}
          placeholder='Armor Class'
          required
        />
        <input
          type='text'
          value={hitPoints}
          onChange={(e) => setHitPoints(e.target.value)}
          placeholder='Hit Points'
          required
        />
        <input
          type='number'
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          placeholder='Speed'
          required
        />
        <h3>Attributes</h3>
        <input
          type='number'
          name='strength'
          value={attributes.strength}
          onChange={handleAttributeChange}
          placeholder='Strength'
          required
        />
        <input
          type='number'
          name='dexterity'
          value={attributes.dexterity}
          onChange={handleAttributeChange}
          placeholder='Dexterity'
          required
        />
        <input
          type='number'
          name='constitution'
          value={attributes.constitution}
          onChange={handleAttributeChange}
          placeholder='Constitution'
          required
        />
        <input
          type='number'
          name='intelligence'
          value={attributes.intelligence}
          onChange={handleAttributeChange}
          placeholder='Intelligence'
          required
        />
        <input
          type='number'
          name='wisdom'
          value={attributes.wisdom}
          onChange={handleAttributeChange}
          placeholder='Wisdom'
          required
        />
        <input
          type='number'
          name='charisma'
          value={attributes.charisma}
          onChange={handleAttributeChange}
          placeholder='Charisma'
          required
        />
        <textarea
          value={savingThrows}
          onChange={(e) => setSavingThrows(e.target.value)}
          placeholder='Saving Throws'
          required
        />
        <textarea
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder='Skills'
          required
        />
        <textarea
          value={damageImmunities}
          onChange={(e) => setDamageImmunities(e.target.value)}
          placeholder='Damage Immunities'
          required
        />
        <textarea
          value={senses}
          onChange={(e) => setSenses(e.target.value)}
          placeholder='Senses'
          required
        />
        <textarea
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          placeholder='Languages'
          required
        />
        <textarea
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          placeholder='Challenge'
          required
        />
        <textarea
          value={legendaryResistance}
          onChange={(e) => setLegendaryResistance(e.target.value)}
          placeholder='Legendary Resistance'
        />
        <textarea
          value={actions}
          onChange={(e) => setActions(e.target.value)}
          placeholder='Actions'
          required
        />
        <textarea
          value={legendaryActions}
          onChange={(e) => setLegendaryActions(e.target.value)}
          placeholder='Legendary Actions'
        />
        <input
          type='text'
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder='Image URL'
          required
        />
        <button type='submit'>Create Character</button>
      </form>
    </div>
  );
};

export default CharacterForm;
