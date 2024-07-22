// src/components/CharacterDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CharacterDetail = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    // Fetch character details from the server
    fetch(`/api/characters/${id}`)
      .then(response => response.json())
      .then(data => setCharacter(data));
  }, [id]);

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <img src={character.image} alt={character.name} />
      <h2>{character.name}</h2>
      <p><strong>Class:</strong> {character.class}</p>
      <p><strong>Size:</strong> {character.size}</p>
      <p><strong>Alignment:</strong> {character.alignment}</p>
      <p>{character.description}</p>
    </div>
  );
};

export default CharacterDetail;
