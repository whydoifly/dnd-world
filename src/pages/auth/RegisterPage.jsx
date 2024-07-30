// src/components/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(username, email, password, isAdmin);
      navigate('/');
    } catch (err) {
      console.error('Error during registration:', err);
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className='auth-container'>
      <form className='auth-form' onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className='error'>{error}</p>}
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Username'
          required
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          required
        />
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          required
        />
        <label>
          <input
            type='checkbox'
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          Admin
        </label>
        <button type='submit'>Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
