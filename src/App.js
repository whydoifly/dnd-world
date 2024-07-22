// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CharacterCard from './components/CharacterCard';
import CharacterDetail from './components/CharacterDetail';
import CharacterForm from './components/CharacterForm';
import NavBar from './components/NavBar';
import { AuthProvider, useAuth } from './AuthContext';
import './components/CharacterForm.css';

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

const AdminRoute = ({ element }) => {
  const { user } = useAuth();
  return user && user.isAdmin ? element : <Navigate to="/login" />;
};

const App = () => (
  <Router>
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/characters" element={<ProtectedRoute element={<CharacterCard />} />} />
        <Route path="/character/:id" element={<ProtectedRoute element={<CharacterDetail />} />} />
        <Route path="/create-character" element={<AdminRoute element={<CharacterForm />} />} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default App;
