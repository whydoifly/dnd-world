import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    const isAdmin = Cookies.get('isAdmin') === 'true';
    if (token) {
      setUser({ token, isAdmin });
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password, isAdmin) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, isAdmin }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Unexpected response format');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      console.log(data.user);
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };

  const login = async (username, password) => {
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Login response:', data); // Add this line to check the response
      Cookies.set('token', data.token);
      Cookies.set('isAdmin', data.isAdmin);
      setUser({ token: data.token, isAdmin: data.isAdmin });
    } else {
      const errorData = await response.json();
      console.error('Login error:', errorData);
      throw new Error(errorData.message || 'Invalid login');
    }
  };

  const logout = async () => {
    await fetch('http://localhost:5001/api/auth/logout', {
      method: 'GET',
      credentials: 'include',
    });
    Cookies.remove('token');
    Cookies.remove('isAdmin');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
