import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const [characterName, setCharacterName] = useState(null);

  useEffect(() => {
    const fetchCharacterName = async (id) => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(
          `http://localhost:5001/api/characters/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setCharacterName(data.name);
        }
      } catch (error) {
        console.error('Error fetching character name:', error);
      }
    };

    if (pathnames[0] === 'character' && pathnames[1]) {
      fetchCharacterName(pathnames[1]);
    } else {
      setCharacterName(null);
    }
  }, [pathnames]);

  const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <nav className='breadcrumbs'>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        {pathnames.map((value, index) => {
          const isCharacterPage = value === 'character';
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          return (
            <li key={to}>
              {index === 1 && characterName ? (
                <span>{capitalize(characterName)}</span>
              ) : (
                <Link to={isCharacterPage ? '/characters' : to}>
                  {capitalize(isCharacterPage ? 'characters' : value)}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
