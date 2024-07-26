import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CharacterCard from './pages/character/CharacterCard';
import CharacterDetail from './pages/character/CharacterDetail';
import CharacterForm from './pages/character/CharacterForm';
import UserList from './pages/user/UserList';
import Breadcrumbs from './components/breadcrumbs/Breadcrumbs';
import NavBar from './components/navbar/NavBar';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import './assets/styles/global.css';

const ProtectedRoute = ({ element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? element : <Navigate to='/login' />;
};

const AdminRoute = ({ element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user && user.isAdmin ? element : <Navigate to='/login' />;
};

const App = () => (
  <Router>
    <AuthProvider>
      <NavBar />
      <Breadcrumbs />

      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route
          path='/characters'
          element={<ProtectedRoute element={<CharacterCard />} />}
        />
        <Route
          path='/character/:id'
          element={<ProtectedRoute element={<CharacterDetail />} />}
        />
        <Route
          path='/create-character'
          element={<AdminRoute element={<CharacterForm />} />}
        />
        <Route path='/users' element={<AdminRoute element={<UserList />} />} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default App;
