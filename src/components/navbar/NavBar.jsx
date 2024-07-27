// src/components/navbar/NavBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './NavBar.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='navbar'>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>

        {user && (
          <>
            <li>
              <Link to='/my-heroes' className='navbar-link'>
                My Heroes
              </Link>
            </li>
            <li>
              <Link to='/create-hero' className='navbar-link'>
                Create Hero
              </Link>
            </li>
            <li>
              <Link to='/characters'>Characters</Link>
            </li>
          </>
        )}
        {user && user.isAdmin && (
          <>
            <li>
              <Link to='/create-character'>Create Character</Link>
            </li>
            <li>
              <Link to='/users'>Manage Users</Link>
            </li>
          </>
        )}
        {user ? (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <>
            <li>
              <Link to='/login'>Login</Link>
            </li>
            <li>
              <Link to='/register'>Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
