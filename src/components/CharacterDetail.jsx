// src/components/CharacterDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CharacterDetail.css';

const CharacterDetail = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/characters/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

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

    fetchCharacter();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="character-detail">
      <h2>{character.name}</h2>
      <img src={character.image} alt={character.name} />
      <p><strong>Size:</strong> {character.size}</p>
      <p><strong>Description:</strong> {character.description}</p>
      <p><strong>Class:</strong> {character.class}</p>
      <p><strong>Alignment:</strong> {character.alignment}</p>
      {/* Add other character details as needed */}
    </div>
  );
};

export default CharacterDetail;
