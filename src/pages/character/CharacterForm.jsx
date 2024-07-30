import React, { useReducer, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

import './CharacterForm.css';

const initialState = {
  name: '',
  armorClass: '',
  hitPoints: '',
  speed: '',
  attributes: {
    strength: '',
    dexterity: '',
    constitution: '',
    intelligence: '',
    wisdom: '',
    charisma: '',
  },
  savingThrows: '',
  skills: '',
  damageImmunities: '',
  senses: '',
  languages: '',
  challenge: '',
  legendaryResistance: '',
  actions: '',
  legendaryActions: '',
  imageUrl: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      if (action.payload.name.startsWith('attributes.')) {
        const attributeName = action.payload.name.split('.')[1];
        return {
          ...state,
          attributes: {
            ...state.attributes,
            [attributeName]: action.payload.value,
          },
        };
      } else {
        return {
          ...state,
          [action.payload.name]: action.payload.value,
        };
      }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const CharacterForm = () => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', payload: { name, value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        credentials: 'include',
        body: JSON.stringify(state),
      });

      if (response.ok) {
        setMessage('Character created successfully');
        dispatch({ type: 'RESET' });
      } else {
        const data = await response.json();
        setError(data.message || 'Error creating character');
      }
    } catch (err) {
      setError('Error creating character');
    }
  };

  const renderInput = (label, name, type = 'text') => (
    <div className='form-group' key={name}>
      <label>{label}:</label>
      <input
        type={type}
        name={name}
        value={
          name.startsWith('attributes.')
            ? state.attributes[name.split('.')[1]]
            : state[name]
        }
        onChange={handleInputChange}
        required
      />
    </div>
  );

  const inputFields = [
    { label: 'Name', name: 'name' },
    { label: 'Armor Class', name: 'armorClass', type: 'number' },
    { label: 'Hit Points', name: 'hitPoints' },
    { label: 'Speed', name: 'speed', type: 'number' },
    { label: 'Strength', name: 'attributes.strength', type: 'number' },
    { label: 'Dexterity', name: 'attributes.dexterity', type: 'number' },
    { label: 'Constitution', name: 'attributes.constitution', type: 'number' },
    { label: 'Intelligence', name: 'attributes.intelligence', type: 'number' },
    { label: 'Wisdom', name: 'attributes.wisdom', type: 'number' },
    { label: 'Charisma', name: 'attributes.charisma', type: 'number' },
    { label: 'Saving Throws', name: 'savingThrows' },
    { label: 'Skills', name: 'skills' },
    { label: 'Damage Immunities', name: 'damageImmunities' },
    { label: 'Senses', name: 'senses' },
    { label: 'Languages', name: 'languages' },
    { label: 'Challenge', name: 'challenge' },
    { label: 'Legendary Resistance', name: 'legendaryResistance' },
    { label: 'Actions', name: 'actions' },
    { label: 'Legendary Actions', name: 'legendaryActions' },
    { label: 'Image URL', name: 'imageUrl' },
  ];

  return (
    <div className='character-form-container'>
      <h2>Create Character</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        {inputFields.map((field) =>
          renderInput(field.label, field.name, field.type)
        )}
        <button type='submit'>Create Character</button>
      </form>
    </div>
  );
};

export default CharacterForm;
