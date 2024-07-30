import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './MyHeroes.css';

const MyHeroes = () => {
  const { user } = useAuth();
  const [heroes, setHeroes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/heroes', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        setHeroes(data);
      } catch (err) {
        console.error('Error fetching heroes:', err);
        setError('Error fetching heroes');
      }
    };

    fetchHeroes();
  }, [user.token]);

  const deleteHero = async (heroId) => {
    if (!window.confirm('Are you sure you want to delete this hero?')) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/heroes/${heroId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Unexpected response format');
      }

      const data = await response.json();
      console.log('Server response:', data);
      if (response.ok) {
        setHeroes(heroes.filter((hero) => hero._id !== heroId));
        setError('');
        alert('Hero deleted successfully');
      } else {
        setError(data.message || 'Error deleting hero');
      }
    } catch (err) {
      console.error('Error deleting hero:', err);
      setError('Error deleting hero');
    }
  };

  return (
    <div className='my-heroes-container'>
      <h2>My Heroes</h2>
      <Link to='/create-hero' className='create-hero-button'>
        Create New Hero
      </Link>
      <div className='heroes-list'>
        {error && <p className='error-message'>{error}</p>}
        {heroes.length > 0 ? (
          heroes.map((hero) => (
            <div key={hero._id} className='hero-card'>
              <img src={hero.imageUrl} alt={hero.name} className='hero-image' />
              <h3>{hero.name}</h3>
              <p>
                {hero.class} - Level {hero.level}
              </p>
              <Link to={`/hero/${hero._id}`} className='view-details-button'>
                View Details
              </Link>
              <button
                onClick={() => deleteHero(hero._id)}
                className='delete-button'>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No heroes found</p>
        )}
      </div>
    </div>
  );
};

export default MyHeroes;
