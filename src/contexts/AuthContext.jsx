import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const isAdmin = Cookies.get('isAdmin') === 'true';
    if (token) {
      setUser({ token, isAdmin });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await fetch('http://localhost:5001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      Cookies.set('token', data.token);
      Cookies.set('isAdmin', data.isAdmin);
      setUser({ token: data.token, isAdmin: data.isAdmin });
    } else {
      throw new Error('Invalid login');
    }
  };

  const logout = async () => {
    await fetch('http://localhost:5001/api/logout', {
      method: 'GET',
      credentials: 'include',
    });
    Cookies.remove('token');
    Cookies.remove('isAdmin');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
