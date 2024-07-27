import React, { useReducer, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './HeroDetail.css';

const initialState = {
  name: '',
  class: '',
  level: 1,
  race: '',
  alignment: '',
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
  senses: '',
  languages: '',
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
    case 'SET_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const HeroDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(`http://localhost:5001/api/heroes/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'SET_STATE', payload: data }))
      .catch((err) => console.error('Error fetching hero:', err));
  }, [id, user.token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', payload: { name, value } });
    handleAutoSave(name, value);
  };

  const handleAutoSave = async (name, value) => {
    try {
      await fetch(`http://localhost:5001/api/heroes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ [name]: value }),
      });
    } catch (err) {
      console.error('Error auto-saving hero:', err);
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
    { label: 'Class', name: 'class' },
    { label: 'Level', name: 'level', type: 'number' },
    { label: 'Race', name: 'race' },
    { label: 'Alignment', name: 'alignment' },
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
    { label: 'Senses', name: 'senses' },
    { label: 'Languages', name: 'languages' },
    { label: 'Image URL', name: 'imageUrl', type: 'url' },
  ];

  return (
    <div className='hero-detail-container'>
      <h2>{state.name}</h2>
      <form>
        {inputFields.map((field) =>
          renderInput(field.label, field.name, field.type)
        )}
      </form>
    </div>
  );
};

export default HeroDetail;
