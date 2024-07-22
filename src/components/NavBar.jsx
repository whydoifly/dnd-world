// src/components/NavBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './NavBar.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/')
  };

  return (
    <nav className={`navbar ${user && user.isAdmin ? 'navbar-admin' : ''}`}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/characters">Characters</Link>
            </li>
            {user.isAdmin && (
              <>
                <li>
                  <Link to="/create-character">Create Character</Link>
                </li>
                <li>
                  <Link to="/users">Manage Users</Link>
                </li>
              </>
            )}
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
