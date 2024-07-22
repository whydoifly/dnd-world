// src/components/CharacterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CharacterForm.css';

const CharacterForm = () => {
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
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
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, size, description, image }),
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
