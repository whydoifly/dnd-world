// src/components/CharacterDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import './CharacterDetail.css';

const CharacterDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/characters/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
            credentials: 'include',
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        const data = await response.json();
        setCharacter(data);
      } catch (error) {
        console.error('Error fetching character:', error);
        setError(error.message);
      }
    };

    if (user) {
      fetchCharacter();
    }
  }, [id, user]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!character) {
    return <div>Loading...</div>;
  }

  const calculateModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  return (
    <div className='character-detail'>
      <h2>{character.name}</h2>
      <img src={character.imageUrl} alt={character.name} />
      <p>
        <strong>Armor Class:</strong> {character.armorClass}
      </p>
      <p>
        <strong>Hit Points:</strong> {character.hitPoints}
      </p>
      <p>
        <strong>Speed:</strong> {character.speed}
      </p>
      <h3>Attributes</h3>
      <p>
        <strong>Strength:</strong> {character.attributes.strength} (Modifier:{' '}
        {calculateModifier(character.attributes.strength)})
      </p>
      <p>
        <strong>Dexterity:</strong> {character.attributes.dexterity} (Modifier:{' '}
        {calculateModifier(character.attributes.dexterity)})
      </p>
      <p>
        <strong>Constitution:</strong> {character.attributes.constitution}{' '}
        (Modifier: {calculateModifier(character.attributes.constitution)})
      </p>
      <p>
        <strong>Intelligence:</strong> {character.attributes.intelligence}{' '}
        (Modifier: {calculateModifier(character.attributes.intelligence)})
      </p>
      <p>
        <strong>Wisdom:</strong> {character.attributes.wisdom} (Modifier:{' '}
        {calculateModifier(character.attributes.wisdom)})
      </p>
      <p>
        <strong>Charisma:</strong> {character.attributes.charisma} (Modifier:{' '}
        {calculateModifier(character.attributes.charisma)})
      </p>
      <p>
        <strong>Saving Throws:</strong> {character.savingThrows}
      </p>
      <p>
        <strong>Skills:</strong> {character.skills}
      </p>
      <p>
        <strong>Damage Immunities:</strong> {character.damageImmunities}
      </p>
      <p>
        <strong>Senses:</strong> {character.senses}
      </p>
      <p>
        <strong>Languages:</strong> {character.languages}
      </p>
      <p>
        <strong>Challenge:</strong> {character.challenge}
      </p>
      {character.legendaryResistance && (
        <>
          <p>
            <strong>Legendary Resistance:</strong>{' '}
            {character.legendaryResistance}
          </p>
        </>
      )}
      <h3>Actions</h3>
      <p>{character.actions}</p>
      {character.legendaryActions && (
        <>
          <h3>Legendary Actions</h3>
          <p>{character.legendaryActions}</p>
        </>
      )}
    </div>
  );
};

export default CharacterDetail;
