import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserList.css';

const UserList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [passwords, setPasswords] = useState({});
  const [visible, setVisible] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, [user.token]);

  const handlePasswordChange = (userId, newPassword) => {
    setPasswords({
      ...passwords,
      [userId]: newPassword,
    });
  };

  const toggleVisibility = (userId) => {
    setVisible({
      ...visible,
      [userId]: !visible[userId],
    });
  };

  const savePassword = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/users/${userId}/password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ password: passwords[userId] }),
        }
      );

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Unexpected response format');
      }

      const data = await response.json();
      if (response.ok) {
        setError('');
        alert('Password updated successfully');
      } else {
        setError(data.message || 'Error updating password');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Error updating password');
    }
  };

  const renderUsers = () =>
    users.map((user) => (
      <div key={user._id} className='user-card'>
        <h3>{user.username}</h3>
        <p>Email: {user.email}</p>
        <p>Admin: {user.isAdmin ? 'Yes' : 'No'}</p>
        <input
          type={visible[user._id] ? 'text' : 'password'}
          placeholder='New password'
          value={passwords[user._id] || ''}
          onChange={(e) => handlePasswordChange(user._id, e.target.value)}
        />
        <button onClick={() => toggleVisibility(user._id)}>
          {visible[user._id] ? 'Hide' : 'Show'}
        </button>
        <button onClick={() => savePassword(user._id)}>Save</button>
      </div>
    ));

  return (
    <div className='user-list-container'>
      <h2>User Management</h2>
      {error && <p className='error-message'>{error}</p>}
      <div className='user-list'>
        {users.length > 0 ? renderUsers() : <p>No users found</p>}
      </div>
    </div>
  );
};

export default UserList;
