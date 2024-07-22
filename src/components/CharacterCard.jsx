import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CharacterCard.css';

const CharacterCard = () => {
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/characters', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        const data = await response.json();
        setCharacters(data);
      } catch (error) {
        console.error('Error fetching characters:', error);
        setError(error.message);
      }
    };

    fetchCharacters();
  }, []);

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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
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
      {characters.map((character) => (
        <div key={character._id} className='character-card'>
          <img src={character.image} alt={character.name} />
          <h3>{character.name}</h3>
          <p>{character.description}</p>
          <Link to={`/character/${character._id}`}>More Details</Link>
          <button
            onClick={() => deleteCharacter(character._id)}
            className='delete-button'>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default CharacterCard;
