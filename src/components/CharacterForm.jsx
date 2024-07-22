// src/components/CharacterForm.jsx
import React, { useState } from 'react';
import './CharacterForm.css';

const CharacterForm = () => {
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const characterData = {
      name,
      size,
      description,
      image
    };

    console.log('Sending data:', characterData); // Log data being sent

    const response = await fetch('http://localhost:5001/api/characters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(characterData)
    });

    if (response.ok) {
      alert('Character created successfully');
      setName('');
      setSize('');
      setDescription('');
      setImage('');
    } else {
      alert('Failed to create character');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="character-form-container">
      <form className="character-form" onSubmit={handleSubmit}>
        <h2>Create New Character</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="Size"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="file"
          onChange={handleImageChange}
          required
        />
        <button type="submit">Create Character</button>
      </form>
    </div>
  );
};

export default CharacterForm;
