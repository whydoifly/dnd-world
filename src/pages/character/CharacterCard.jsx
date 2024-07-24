import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import './CharacterCard.css';

const CharacterCard = () => {
  const { user } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/characters', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setCharacters(data);
        } else {
          console.error('Failed to fetch characters');
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
        setError(error.message);
      }
    };

    if (user) {
      fetchCharacters();
    }
  }, [user]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!Array.isArray(characters)) {
    return <div>Unexpected response format</div>;
  }

  const deleteCharacter = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/characters/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      setCharacters(characters.filter((character) => character._id !== id));
      alert('Character deleted successfully');
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!Array.isArray(characters)) {
    return <div>Unexpected response format</div>;
  }

  return (
    <div className='character-list'>
      {characters.length >= 1
        ? characters.map((character) => (
            <div key={character._id} className='character-card'>
              <img src={character.imageUrl} alt={character.name} />
              <h3>{character.name}</h3>
              <p>{character.description}</p>
              <Link to={`/character/${character._id}`}>More Details</Link>
              <button
                onClick={() => deleteCharacter(character._id)}
                className='delete-button'>
                Delete
              </button>
            </div>
          ))
        : 'No characters yet!'}
    </div>
  );
};

export default CharacterCard;
