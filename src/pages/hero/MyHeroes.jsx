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
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          credentials: 'include',
        });

        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Unexpected response format');
        }

        const data = await response.json();
        console.log('Received data:', data); // Log the received data

        if (Array.isArray(data)) {
          setHeroes(data);
        } else {
          setHeroes([]);
          setError('Unexpected response format');
        }
      } catch (err) {
        console.error('Error fetching heroes:', err);
        setError('Error fetching heroes');
      }
    };

    fetchHeroes();
  }, [user.token]);

  if (error) {
    return <div className='error-message'>{error}</div>;
  }

  return (
    <div className='my-heroes-container'>
      <h2>My Heroes</h2>
      <Link to='/create-hero' className='create-hero-button'>
        Create New Hero
      </Link>
      <div className='heroes-list'>
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
